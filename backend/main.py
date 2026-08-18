from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Gerador de Minutas API", version="0.1.0")

class Jornada(BaseModel):
    horas_dia: float = Field(ge=0, le=24)
    dias_semana: int = Field(ge=1, le=7)

@app.get("/health")
def health():
    return {"ok": True, "service": "gerador-minutas"}

@app.post("/validar-jornada")
def validar_jornada(jornada: Jornada):
    semanal = jornada.horas_dia * jornada.dias_semana
    return {
        "horas_dia": jornada.horas_dia,
        "horas_semana": semanal,
        "fora_parametros": jornada.horas_dia < 6 or jornada.horas_dia > 8 or semanal > 44,
        "bloqueia": False,
        "mensagem": "A jornada será permitida para prosseguimento, mas a situação deve ser analisada no processo administrativo."
        if jornada.horas_dia < 6 or jornada.horas_dia > 8 or semanal > 44 else None,
    }
