from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Alert:
    codigo: str
    mensagem: str
    bloqueante: bool = False


def validar_solicitacao(data: dict) -> list[Alert]:
    alerts: list[Alert] = []

    vigencia = float(data.get("vigencia_anos", 5))
    if vigencia < 5:
        alerts.append(Alert(
            "VIGENCIA_INFERIOR_5_ANOS",
            "A vigência informada é inferior a 5 anos. A justificativa é obrigatória para a geração dos documentos.",
            bloqueante=True,
        ))

    horas = data.get("jornada_horas_semanais")
    if horas is not None:
        horas = float(horas)
        if horas < 6:
            alerts.append(Alert(
                "JORNADA_INFERIOR_6_HORAS",
                "A jornada informada é inferior a 6 horas. A situação deve ser analisada no processo administrativo; a geração não será bloqueada.",
            ))
        if horas > 8:
            alerts.append(Alert(
                "JORNADA_SUPERIOR_8_HORAS",
                "A jornada informada é superior a 8 horas. A situação deve ser analisada no processo administrativo; a geração não será bloqueada.",
            ))
        if horas > 44:
            alerts.append(Alert(
                "JORNADA_SUPERIOR_44_SEMANAIS",
                "A jornada semanal informada supera 44 horas. A situação deve ser analisada no processo administrativo; a geração não será bloqueada.",
            ))

    dias = set(data.get("jornada_dias_trabalhados", []))
    if "domingo" in {str(x).lower() for x in dias}:
        alerts.append(Alert(
            "TRABALHO_DOMINGO",
            "A jornada inclui domingo. O sistema informa a regra aplicável, mas não impede a geração da minuta.",
        ))

    if data.get("feriados_trabalhados"):
        alerts.append(Alert(
            "TRABALHO_FERIADO",
            "Foi informado trabalho em feriado. O sistema informa a regra aplicável, mas não impede a geração da minuta.",
        ))

    return alerts
