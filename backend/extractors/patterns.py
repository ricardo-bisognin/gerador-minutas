from __future__ import annotations

import re
from typing import Any


CPF_RE = re.compile(r"\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2}\b")
CNPJ_RE = re.compile(r"\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[/\s]?\d{4}[-\s]?\d{2}\b")
CEP_RE = re.compile(r"\b\d{5}[-\s]?\d{3}\b")
RG_RE = re.compile(r"\b\d{1,3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?[0-9Xx]\b")
DATE_RE = re.compile(r"\b\d{2}[/-]\d{2}[/-]\d{4}\b")


def _digits(value: str) -> str:
    return re.sub(r"\D", "", value)


def _cpf_valid(value: str) -> bool:
    digits = _digits(value)
    if len(digits) != 11 or len(set(digits)) == 1:
        return False
    total = sum(int(digits[i]) * (10 - i) for i in range(9))
    d1 = (total * 10) % 11
    d1 = 0 if d1 == 10 else d1
    if d1 != int(digits[9]):
        return False
    total = sum(int(digits[i]) * (11 - i) for i in range(10))
    d2 = (total * 10) % 11
    d2 = 0 if d2 == 10 else d2
    return d2 == int(digits[10])


def _cnpj_valid(value: str) -> bool:
    digits = _digits(value)
    if len(digits) != 14 or len(set(digits)) == 1:
        return False
    weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    d1 = sum(int(d) * w for d, w in zip(digits[:12], weights1)) % 11
    d1 = 0 if d1 < 2 else 11 - d1
    d2 = sum(int(d) * w for d, w in zip(digits[:12] + str(d1), weights2)) % 11
    d2 = 0 if d2 < 2 else 11 - d2
    return digits[-2:] == f"{d1}{d2}"


def extract_structured_patterns(text: str) -> dict[str, Any]:
    """Extract values whose format provides a strong signal.

    The regexes intentionally tolerate OCR substitutions such as spaces instead of
    punctuation. Values are validated before being returned as high-confidence
    candidates. The result is still a suggestion and must be human-confirmed.
    """
    cpfs = [m.group(0) for m in CPF_RE.finditer(text) if _cpf_valid(m.group(0))]
    cnpjs = [m.group(0) for m in CNPJ_RE.finditer(text) if _cnpj_valid(m.group(0))]
    ceps = [m.group(0) for m in CEP_RE.finditer(text)]
    dates = [m.group(0) for m in DATE_RE.finditer(text)]
    rgs = [m.group(0) for m in RG_RE.finditer(text)]

    return {
        "cpf": _unique(cpfs),
        "cnpj": _unique(cnpjs),
        "cep": _unique(ceps),
        "data": _unique(dates),
        "rg_candidates": _unique(rgs),
    }


def _unique(values: list[str]) -> list[str]:
    result: list[str] = []
    for value in values:
        if value not in result:
            result.append(value)
    return result
