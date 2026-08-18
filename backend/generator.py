from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class DocumentContext:
    data: dict[str, Any]


def format_fpe(numero: str | None, ano: int | None) -> str:
    if not numero or not ano:
        return "[PREENCHER FPE]"
    return f"{numero}/{ano}"


def format_processo(numero: str | None) -> str:
    return numero if numero else "[PREENCHER PROCESSO]"


def format_vigencia(anos: float) -> str:
    if anos == 5:
        return "5 (cinco) anos"
    return f"{anos:g} anos"


def render(template: str, context: dict[str, Any]) -> str:
    """Small deterministic renderer for the MVP.

    It intentionally supports only {{path.to.value}} substitutions and simple
    {{#items}}...{{/items}} list blocks. Legal text is kept in templates; this
    function only injects data.
    """
    import re

    def lookup(path: str, obj: Any) -> Any:
        current = obj
        for part in path.strip().split("."):
            if isinstance(current, dict):
                current = current.get(part)
            else:
                current = getattr(current, part, None)
        return current

    pattern = re.compile(r"\{\{#([\w.]+)\}\}(.*?)\{\{/\1\}\}", re.S)

    def block(match: re.Match[str]) -> str:
        value = lookup(match.group(1), context)
        if not value:
            return ""
        body = match.group(2)
        if isinstance(value, list):
            return "".join(render(body, item if isinstance(item, dict) else {"value": item}) for item in value)
        return render(body, context)

    previous = None
    while previous != template:
        previous = template
        template = pattern.sub(block, template)

    def scalar(match: re.Match[str]) -> str:
        value = lookup(match.group(1), context)
        return "" if value is None else str(value)

    return re.sub(r"\{\{([\w.]+)\}\}", scalar, template)


def build_context(data: dict[str, Any]) -> dict[str, Any]:
    context = dict(data)
    context.setdefault("fpe_formatado", format_fpe(data.get("fpe_numero"), data.get("fpe_ano")))
    context.setdefault("processo_formatado", format_processo(data.get("processo_numero")))
    context.setdefault("vigencia_anos_formatada", format_vigencia(float(data.get("vigencia_anos", 5))))
    context.setdefault("se_vigencia_menor_que_5", float(data.get("vigencia_anos", 5)) < 5)
    return context


def render_text_template(template_path: str | Path, data: dict[str, Any]) -> str:
    template = Path(template_path).read_text(encoding="utf-8")
    return render(template, build_context(data))
