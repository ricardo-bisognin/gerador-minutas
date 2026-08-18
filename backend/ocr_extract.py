from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


CPF_RE = re.compile(r"\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2}\b")
CNPJ_RE = re.compile(r"\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[/\s]?\d{4}[-\s]?\d{2}\b")
CEP_RE = re.compile(r"\b\d{5}[-\s]?\d{3}\b")
DATE_RE = re.compile(r"\b\d{1,2}/\d{1,2}/\d{4}\b")
EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)


@dataclass(frozen=True)
class Candidate:
    field: str
    value: str
    confidence: str
    source: str = "ocr"


def normalize_digits(value: str) -> str:
    return re.sub(r"\D", "", value)


def valid_cpf(value: str) -> bool:
    digits = normalize_digits(value)
    if len(digits) != 11 or len(set(digits)) == 1:
        return False
    for size in (9, 10):
        total = sum(int(digits[i]) * (size + 1 - i) for i in range(size))
        check = (total * 10) % 11
        if check == 10:
            check = 0
        if check != int(digits[size]):
            return False
    return True


def valid_cnpj(value: str) -> bool:
    digits = normalize_digits(value)
    if len(digits) != 14 or len(set(digits)) == 1:
        return False
    weights = (5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2)
    total = sum(int(d) * w for d, w in zip(digits[:12], weights))
    check = 11 - (total % 11)
    check = 0 if check >= 10 else check
    if check != int(digits[12]):
        return False
    weights = (6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2)
    total = sum(int(d) * w for d, w in zip(digits[:13], weights))
    check = 11 - (total % 11)
    check = 0 if check >= 10 else check
    return check == int(digits[13])


def extract_candidates(text: str) -> list[Candidate]:
    candidates: list[Candidate] = []
    for raw in CPF_RE.findall(text):
        confidence = "alta" if valid_cpf(raw) else "baixa"
        candidates.append(Candidate("cpf", normalize_digits(raw), confidence))
    for raw in CNPJ_RE.findall(text):
        confidence = "alta" if valid_cnpj(raw) else "baixa"
        candidates.append(Candidate("cnpj", normalize_digits(raw), confidence))
    for raw in CEP_RE.findall(text):
        candidates.append(Candidate("cep", normalize_digits(raw), "média"))
    for raw in DATE_RE.findall(text):
        candidates.append(Candidate("data", raw, "média"))
    for raw in EMAIL_RE.findall(text):
        candidates.append(Candidate("email", raw.lower(), "alta"))
    return candidates


def run_tesseract(image_path: str | Path, lang: str = "por", psm: int = 11) -> str:
    """Run local Tesseract. Production should call this only after image preprocessing."""
    result = subprocess.run(
        ["tesseract", str(image_path), "stdout", "-l", lang, "--psm", str(psm)],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout
