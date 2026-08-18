from __future__ import annotations

from dataclasses import dataclass


@dataclass
class TitularInstitucional:
    nome: str
    cargo: str
    cpf: str | None = None
    rg: str | None = None
    matricula: str | None = None
    email: str | None = None


@dataclass
class ConfiguracaoInstitucional:
    ssps: TitularInstitucional
    policia_penal: TitularInstitucional
    email_domain: str = "policiapenal.rs.gov.br"

    def atualizar_ssps(self, **dados: str) -> None:
        for campo, valor in dados.items():
            if hasattr(self.ssps, campo):
                setattr(self.ssps, campo, valor)

    def atualizar_policia_penal(self, **dados: str) -> None:
        for campo, valor in dados.items():
            if hasattr(self.policia_penal, campo):
                setattr(self.policia_penal, campo, valor)
