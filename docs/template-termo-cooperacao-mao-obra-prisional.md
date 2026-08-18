# Template parametrizado — Termo de Cooperação

Este arquivo define a primeira camada do gerador documental. Ele separa o texto jurídico padronizado dos dados que vêm da solicitação.

## Identificação

`FPE nº {{fpe_numero}}/{{fpe_ano}}`  
`Processo nº {{processo_numero}}`

Quando FPE ou processo ainda não estiverem disponíveis, o gerador deve preservar um marcador visual de preenchimento pendente, sem inventar o número.

## Partícipes

**ESTADO DO RIO GRANDE DO SUL**, por intermédio da **SECRETARIA DE SISTEMAS PENAL E SOCIOEDUCATIVO**, doravante denominada **SSPS**, e da **POLÍCIA PENAL**, e **{{convenente_nome_razao_social}}**, inscrita no CNPJ sob nº **{{convenente_cnpj}}**, com sede em **{{convenente_endereco_completo}}**, neste ato representada por **{{representante_nome}}**, CPF nº **{{representante_cpf}}**, na qualidade de **{{representante_cargo}}**, resolvem celebrar o presente Termo de Cooperação.

> A identificação institucional fixa deverá vir da configuração institucional vigente, não de campos digitados pelo interessado.

## Cláusula Primeira — Do Objeto

O presente Termo de Cooperação tem por objeto a utilização de mão de obra da pessoa presa, nos termos da legislação aplicável, conforme condições estabelecidas neste instrumento e no Plano de Trabalho que o integra.

## Cláusula Segunda — Da Execução

A execução compreenderá até **{{quantidade_pessoas}}** pessoas presas, dos regimes **{{regimes_formatados}}**, vinculadas aos seguintes estabelecimentos:

{{#estabelecimentos}}
- **{{nome}}**, localizado em **{{municipio}}/RS**;
{{/estabelecimentos}}

As atividades a serem desenvolvidas compreenderão:

{{#atividades}}
- {{descricao}}
{{/atividades}}

A prestação das atividades ocorrerá **{{local_prestacao_formatado}}**.

A jornada será de **{{jornada_descricao}}**, totalizando **{{jornada_semanal_formatada}}** semanais, observado o regime jurídico aplicável à pessoa presa.

A remuneração será de **{{remuneracao_texto}}**.

### Alertas jurídicos não bloqueantes

O gerador deve analisar os dados e, quando identificar jornada, feriado ou outra condição potencialmente divergente da legislação/regramento aplicável, apresentar alerta ao usuário. O alerta não deve impedir a geração do documento. A decisão e a justificativa administrativa permanecem no processo.

## Cláusula de vigência

O presente Termo terá vigência de **{{vigencia_anos_formatada}}**, a contar da publicação da súmula no Diário Oficial do Estado.

{{#se_vigencia_menor_que_5}}
**JUSTIFICATIVA DE VIGÊNCIA INFERIOR A 5 (CINCO) ANOS**

{{vigencia_justificativa}}
{{/se_vigencia_menor_que_5}}

## Disposições padronizadas

As demais cláusulas jurídicas, obrigações dos partícipes, acompanhamento, fiscalização, alterações, rescisão, publicação, foro e demais disposições deverão ser incorporadas a partir da minuta-base oficial vigente, sem alteração automática de conteúdo jurídico pelo gerador.

## Assinaturas

**{{convenente_nome_razao_social}}**  
{{representante_nome}}  
{{representante_cargo}}

**SECRETARIA DE SISTEMAS PENAL E SOCIOEDUCATIVO**  
Secretário de Sistemas Penal e Socioeducativo

**POLÍCIA PENAL**  
Superintendente da Polícia Penal

---

## Regras do primeiro gerador

1. Nunca inventar FPE ou processo.
2. FPE e processo ausentes recebem marcador visual de pendência.
3. Vigência padrão: 5 anos.
4. Vigência inferior a 5 anos exige justificativa e gera documento separado.
5. Quantidade de pessoas não possui limite artificial imposto pelo frontend.
6. Estabelecimentos são selecionados do cadastro; a lista é dinâmica.
7. Atividades são uma lista de entradas livres, com normalização de capitalização sem destruir nomes próprios.
8. Remuneração é texto livre, com exemplo no campo.
9. Local de prestação possui três opções: sede da empresa, sede do estabelecimento prisional ou outro.
10. Alertas legais são não bloqueantes.
11. Cláusulas jurídicas padronizadas devem vir da minuta-base oficial, não ser reconstruídas livremente pelo modelo.
12. O Plano de Trabalho será gerado a partir da mesma solicitação, evitando duplicação de preenchimento.
