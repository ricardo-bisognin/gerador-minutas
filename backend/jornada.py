from __future__ import annotations

from dataclasses import dataclass


DIAS = {
    "segunda": "segunda-feira",
    "terça": "terça-feira",
    "terca": "terça-feira",
    "quarta": "quarta-feira",
    "quinta": "quinta-feira",
    "sexta": "sexta-feira",
    "sábado": "sábado",
    "sabado": "sábado",
    "domingo": "domingo",
}


@dataclass(frozen=True)
class Jornada:
    dias_trabalhados: tuple[str, ...]
    horas_semanais: float
    horario: str = ""
    intervalo: str = ""

    @property
    def dias_descanso(self) -> tuple[str, ...]:
        ordem = ("segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo")
        trabalhados = set(self.dias_trabalhados)
        return tuple(dia for dia in ordem if dia not in trabalhados)

    @property
    def dias_trabalhados_formatados(self) -> str:
        return _lista(self.dias_trabalhados)

    @property
    def dias_descanso_formatados(self) -> str:
        return _lista(self.dias_descanso)


def normalizar_dias(dias: list[str]) -> tuple[str, ...]:
    resultado: list[str] = []
    for dia in dias:
        chave = dia.strip().lower()
        if chave not in DIAS:
            raise ValueError(f"Dia inválido: {dia}")
        canonico = DIAS[chave]
        if canonico not in resultado:
            resultado.append(canonico)
    return tuple(resultado)


def _lista(dias: tuple[str, ...]) -> str:
    if not dias:
        return "nenhum"
    if len(dias) == 1:
        return dias[0]
    if len(dias) == 2:
        return f"{dias[0]} e {dias[1]}"
    return ", ".join(dias[:-1]) + f" e {dias[-1]}"


def criar_jornada(dias_trabalhados: list[str], horas_semanais: float, horario: str = "", intervalo: str = "") -> Jornada:
    return Jornada(
        dias_trabalhados=normalizar_dias(dias_trabalhados),
        horas_semanais=horas_semanais,
        horario=horario,
        intervalo=intervalo,
    )
