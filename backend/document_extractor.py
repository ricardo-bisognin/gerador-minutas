from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Literal


DocumentKind = Literal[
    "carta_proposta",
    "comprovante_endereco",
    "contrato_social",
    "documento_responsavel",
    "cnpj",
    "inscricao_estadual",
    "simples_nacional",
    "ato_posse_nomeacao",
    "documento_representante",
    "desconhecido",
]


@dataclass
class ExtractedField:
    name: str
    value: str | None = None
    confidence: float | None = None
    source: str | None = None
    needs_review: bool = False


@dataclass
class ExtractionResult:
    kind: DocumentKind
    filename: str
    text: str = ""
    fields: list[ExtractedField] = field(default_factory=list)
    ocr_used: bool = False
    warnings: list[str] = field(default_factory=list)


def classify_document(filename: str) -> DocumentKind:
    """Classificação inicial baseada no nome do arquivo.

    É apenas uma primeira pista. A classificação definitiva deverá considerar
    também o conteúdo extraído, especialmente quando o usuário enviar arquivos
    com nomes genéricos como 'scan001.pdf'.
    """
    name = Path(filename).stem.lower()
    rules = {
        "carta_proposta": ("carta", "proposta"),
        "comprovante_endereco": ("endereco", "endereço", "comprovante"),
        "contrato_social": ("contrato", "social"),
        "documento_responsavel": ("responsavel", "responsável", "rg", "cpf"),
        "cnpj": ("cnpj",),
        "inscricao_estadual": ("inscricao", "inscrição", "estadual"),
        "simples_nacional": ("simples",),
        "ato_posse_nomeacao": ("posse", "nomeacao", "nomeação"),
        "documento_representante": ("representante",),
    }
    for kind, terms in rules.items():
        if any(term in name for term in terms):
            return kind  # type: ignore[return-value]
    return "desconhecido"


def extract_text(path: str | Path) -> ExtractionResult:
    """Ponto único para leitura de documentos.

    A primeira versão será conservadora: documentos digitais são lidos
    diretamente quando possível. OCR fica isolado neste módulo para que possa
    ser ativado depois sem alterar o fluxo do frontend.
    """
    file = Path(path)
    kind = classify_document(file.name)
    result = ExtractionResult(kind=kind, filename=file.name)

    suffix = file.suffix.lower()
    if suffix == ".txt":
        result.text = file.read_text(encoding="utf-8", errors="ignore")
        return result

    if suffix in {".pdf", ".docx", ".jpg", ".jpeg", ".png"}:
        result.warnings.append("Leitura do formato disponível no adaptador correspondente; OCR será usado como fallback para documentos digitalizados.")
        return result

    result.warnings.append(f"Formato não suportado: {suffix or 'sem extensão'}")
    return result


def map_fields(result: ExtractionResult) -> ExtractionResult:
    """Transforma texto extraído em campos candidatos para a tela de conferência.

    Nenhum valor é considerado definitivo aqui. Divergências ou baixa confiança
    devem sempre ser apresentadas ao usuário para decisão humana.
    """
    # O mapeamento por conteúdo será implementado depois dos primeiros testes
    # com documentos reais anonimizados.
    return result
