# Template parametrizado — Plano de Trabalho

O Plano de Trabalho é gerado a partir da mesma solicitação estruturada do Termo de Cooperação. O usuário não deve redigitar dados já informados no TC.

## 1. DADOS CADASTRAIS

### Órgão/Entidade Proponente

- CNPJ: `{{convenente_cnpj}}`
- Razão Social: `{{convenente_nome_razao_social}}`
- Endereço: `{{convenente_endereco_completo}}`
- Município: `{{convenente_municipio}}`
- UF: `{{convenente_uf}}`
- CEP: `{{convenente_cep}}`
- Telefone: `{{convenente_telefone}}`
- E-mail: `{{convenente_email}}`
- Home page: `{{convenente_homepage}}`

### Representante Legal

- Nome: `{{representante_nome}}`
- CPF: `{{representante_cpf}}`
- CI: `{{representante_rg}}`
- Órgão expedidor: `{{representante_orgao_expedidor}}`
- Cargo: `{{representante_cargo}}`
- Função: `{{representante_funcao}}`

### Partícipes institucionais

Os dados da SSPS e da Polícia Penal são preenchidos pela configuração institucional vigente.

## 2. DESCRIÇÃO DO PROJETO

### 2.1 Título do projeto

**Utilização de mão de obra prisional**

### 2.2 Período de execução

- Início: `{{periodo_execucao_inicio}}`
- Término: `{{periodo_execucao_fim}}`

Os períodos devem ser derivados da vigência do Termo quando a regra do modelo permitir.

### 2.3 Identificação do objeto

Texto padrão da minuta-base vigente, parametrizado apenas quando houver necessidade de inserir informações específicas da solicitação.

### 2.4 Justificativa da proposição

Texto padrão da minuta-base vigente. Não solicitar ao usuário se o modelo oficial permanecer inalterado.

## 3. CRONOGRAMA DE EXECUÇÃO

### Meta 1

**Descrição da Meta:** `{{meta_descricao}}`

A descrição deve ser derivada do objeto e dos dados da solicitação sempre que possível.

### Etapas

Para cada estabelecimento selecionado:

| Etapa | Descrição | Indicador Físico | Quantidade | Início | Término |
|---|---|---|---:|---|---|
| `{{etapa_numero}}` | `{{etapa_descricao}}` | Mês | `{{quantidade_meses}}` | `{{etapa_inicio}}` | `{{etapa_termino}}` |

A unidade do indicador físico permanece **Mês** no MVP.

Se houver dois estabelecimentos, por exemplo, o gerador poderá criar automaticamente 1.1 e 1.2. A descrição da etapa deverá incorporar o estabelecimento correspondente.

## 4. PLANO DE APLICAÇÃO

A estrutura da tabela deverá ser preservada conforme a minuta-base oficial:

| Natureza da Despesa | CONVENENTE | ESTADO | TOTAL GERAL |
|---|---:|---:|---:|
| `{{natureza_despesa}}` | `{{valor_convenente}}` | `{{valor_estado}}` | `{{valor_total}}` |

O MVP não deve inventar valores financeiros. Quando o modelo oficial utilizar valor 0,00 ou informação textual, preservar a regra da minuta-base.

## 5. DECLARAÇÃO

A declaração é texto padronizado. O nome do representante legal é inserido automaticamente:

**{{representante_nome}}**, CPF nº **{{representante_cpf}}**.

O restante da declaração deve ser preservado da minuta-base oficial.

## 6. APROVAÇÃO

Texto padronizado da minuta-base, com identificação dos representantes institucionais vigentes. Não deve ser digitado pelo interessado.

---

## Regras do gerador

1. Nunca solicitar novamente dados já disponíveis no objeto da solicitação.
2. Derivar o período de execução da vigência quando possível.
3. Criar automaticamente uma etapa por estabelecimento quando o modelo assim exigir.
4. Manter indicador físico como `Mês` no MVP.
5. Não calcular valores financeiros sem dados suficientes.
6. Não alterar livremente textos jurídicos padronizados.
7. Usar a configuração institucional vigente para SSPS e Polícia Penal.
