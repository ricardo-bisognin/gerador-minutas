from generator import build_context, render


def test_missing_fpe_and_process_are_marked():
    ctx = build_context({"vigencia_anos": 5})
    assert ctx["fpe_formatado"] == "[PREENCHER FPE]"
    assert ctx["processo_formatado"] == "[PREENCHER PROCESSO]"


def test_vigencia_under_five_is_flagged():
    ctx = build_context({"vigencia_anos": 3})
    assert ctx["se_vigencia_menor_que_5"] is True
    assert ctx["vigencia_anos_formatada"] == "3 anos"


def test_list_rendering():
    text = render("{{#items}}- {{nome}}\\n{{/items}}", {"items": [{"nome": "Casa A"}, {"nome": "Casa B"}]})
    assert "Casa A" in text
    assert "Casa B" in text
