from __future__ import annotations

from copy import deepcopy
from pathlib import Path
from typing import Any

from docx import Document


def _all_paragraphs(doc: Document):
    for paragraph in doc.paragraphs:
        yield paragraph
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    yield paragraph


def _replace_paragraph_text(paragraph, replacements: dict[str, str]) -> None:
    text = paragraph.text
    new_text = text
    for old, new in replacements.items():
        new_text = new_text.replace(old, new)
    if new_text == text:
        return
    if paragraph.runs:
        paragraph.runs[0].text = new_text
        for run in paragraph.runs[1:]:
            run.text = ""
    else:
        paragraph.add_run(new_text)


def _format_number(value: int) -> str:
    words = {
        1: "um", 2: "dois", 3: "três", 4: "quatro", 5: "cinco",
        6: "seis", 7: "sete", 8: "oito", 9: "nove", 10: "dez",
        20: "vinte", 30: "trinta", 40: "quarenta", 50: "cinquenta",
        60: "sessenta", 70: "setenta", 80: "oitenta", 90: "noventa",
        100: "cem",
    }
    return words.get(value, str(value))


def _establishments_text(establishments: list[dict[str, Any]]) -> str:
    names = [str(item.get("nome", "")).strip() for item in establishments if item.get("nome")]
    if not names:
        return "[SELECIONAR ESTABELECIMENTO]"
    if len(names) == 1:
        return names[0]
    if len(names) == 2:
        return f"{names[0]} e {names[1]}"
    return ", ".join(names[:-1]) + f" e {names[-1]}"


def _activities_text(activities: list[str]) -> str:
    clean = [a.strip() for a in activities if a and a.strip()]
    if not clean:
        return "[INFORMAR ATIVIDADES]"
    if len(clean) == 1:
        return clean[0]
    if len(clean) == 2:
        return f"{clean[0]} e {clean[1]}"
    return ", ".join(clean[:-1]) + f" e {clean[-1]}"


def build_replacements(data: dict[str, Any]) -> dict[str, str]:
    quantidade = int(data.get("quantidade_pessoas", 0))
    vigencia = float(data.get("vigencia_anos", 5))
    inicio = int(data.get("periodo_inicio_ano", data.get("ano_assinatura", 2026)))
    fim = int(data.get("periodo_fim_ano", inicio + int(vigencia)))
    estabelecimentos = data.get("estabelecimentos", [])

    if vigencia == 5:
        vigencia_texto = "5 (cinco) anos"
    else:
        vigencia_texto = f"{vigencia:g} anos"

    return {
        "{{fpe_formatado}}": data.get("fpe_formatado") or "[PREENCHER FPE]",
        "{{processo_formatado}}": data.get("processo_formatado") or "[PREENCHER PROCESSO]",
        "{{convenente_nome_razao_social}}": data.get("convenente_nome_razao_social", "[INFORMAR CONVENENTE]"),
        "{{convenente_endereco_completo}}": data.get("convenente_endereco_completo", "[INFORMAR ENDEREÇO]"),
        "{{convenente_cnpj}}": data.get("convenente_cnpj", "[INFORMAR CNPJ]"),
        "{{representante_nome}}": data.get("representante_nome", "[INFORMAR REPRESENTANTE]"),
        "{{representante_rg}}": data.get("representante_rg", "[INFORMAR RG]"),
        "{{representante_cpf}}": data.get("representante_cpf", "[INFORMAR CPF]"),
        "{{representante_cargo}}": data.get("representante_cargo", "[INFORMAR CARGO]"),
        "{{jornada_horario}}": data.get("jornada_horario", "[INFORMAR HORÁRIO]"),
        "{{jornada_intervalo}}": data.get("jornada_intervalo", "[INFORMAR INTERVALO]"),
        "{{jornada_dias}}": data.get("jornada_dias", "[INFORMAR DIAS]"),
        "{{atividades_formatadas}}": _activities_text(data.get("atividades", [])),
        "{{local_prestacao}}": data.get("local_prestacao", "[INFORMAR LOCAL DE PRESTAÇÃO]"),
        "{{quantidade_pessoas_formatada}}": f"{quantidade} ({_format_number(quantidade)})" if quantidade else "[INFORMAR QUANTIDADE]",
        "{{quantidade_pessoas}}": str(quantidade) if quantidade else "[INFORMAR QUANTIDADE]",
        "{{regimes_formatados}}": data.get("regimes_formatados", "[INFORMAR REGIMES]"),
        "{{estabelecimento_nome}}": _establishments_text(estabelecimentos),
        "{{estabelecimentos_formatados}}": _establishments_text(estabelecimentos),
        "{{remuneracao_texto}}": data.get("remuneracao_texto", "[INFORMAR REMUNERAÇÃO]"),
        "{{remuneracao_plano_aplicacao}}": data.get("remuneracao_texto", "[INFORMAR REMUNERAÇÃO]"),
        "{{vigencia_formatada}}": vigencia_texto,
        "{{ano_assinatura}}": str(data.get("ano_assinatura", inicio)),
        "{{periodo_inicio_ano}}": str(inicio),
        "{{periodo_fim_ano}}": str(fim),
        "{{quantidade_meses}}": str(int(vigencia * 12)),
        "{{ssps_representante_nome}}": data.get("ssps_representante_nome", "[CONFIGURAR REPRESENTANTE SSPS]"),
        "{{ssps_representante_rg}}": data.get("ssps_representante_rg", "[CONFIGURAR RG SSPS]"),
        "{{ssps_representante_cpf}}": data.get("ssps_representante_cpf", "[CONFIGURAR CPF SSPS]"),
        "{{pp_representante_nome}}": data.get("pp_representante_nome", "[CONFIGURAR REPRESENTANTE POLÍCIA PENAL]"),
        "{{pp_representante_rg}}": data.get("pp_representante_rg", "[CONFIGURAR RG POLÍCIA PENAL]"),
        "{{pp_representante_cpf}}": data.get("pp_representante_cpf", "[CONFIGURAR CPF POLÍCIA PENAL]"),
    }


def generate_termo_cooperacao(template_path: str | Path, output_path: str | Path, data: dict[str, Any]) -> Path:
    """Generate a DOCX from the official-base template without rewriting legal clauses."""
    document = Document(str(template_path))
    replacements = build_replacements(data)
    for paragraph in _all_paragraphs(document):
        _replace_paragraph_text(paragraph, replacements)

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    document.save(output)
    return output
