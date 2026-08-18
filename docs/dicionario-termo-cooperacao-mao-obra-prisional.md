# Dicionário de dados — Termo de Cooperação para utilização de mão de obra prisional

> Documento de trabalho do MVP. O conteúdo abaixo foi levantado a partir das minutas e Planos de Trabalho fornecidos para o projeto. Não substitui revisão jurídica/técnica.

## 1. Princípio do modelo

O sistema deve manter um único conjunto de dados estruturados e gerar a partir dele o Termo de Cooperação e o Plano de Trabalho. O formulário deve pedir somente informações que não possam ser obtidas dos documentos enviados, do cadastro do sistema ou de regras previamente definidas.

## 2. Dados do instrumento

| Campo interno | Nome exibido | Origem ideal | TC | PT | Regra/observação |
|---|---|---|---|---|---|
| `tipo_convenente` | Tipo de convenente | seleção | ✓ | indiretamente | Empresa ou Município; muda a redação do instrumento |
| `fpe_numero` | Número FPE | sistema/processo | ✓ | cabeçalho | Deve aparecer como campo pendente/destaque se ainda não existir |
| `fpe_ano` | Ano FPE | sistema/processo | ✓ | cabeçalho | Integra a identificação FPE nº XXXX/AAAA |
| `processo_numero` | Número do processo | sistema/processo | ✓ | referência | Deve aparecer como campo pendente/destaque se ainda não existir |
| `processo_ano` | Ano do processo | sistema/processo | ✓ | referência | O ano integra o próprio número do processo, mas deve ser armazenado separadamente para validação |
| `numero_instrumento` | Número do Termo de Cooperação | sistema | ✓ | — | Não deve ser solicitado ao interessado; será preenchido quando conhecido |
| `ano_instrumento` | Ano do instrumento | sistema | ✓ | — | Derivado do número/data conforme fluxo |
| `data_assinatura` | Data de assinatura | sistema/assinatura | ✓ | ✓ | Não deve ser exigida no formulário inicial |

## 3. Convenente — empresa ou município

| Campo interno | Nome exibido | Origem ideal | TC | PT | Observação |
|---|---|---|---|---|---|
| `convenente_nome_razao_social` | Nome/Razão social | CNPJ + contrato social | ✓ | ✓ | Deve ser extraído e conferido |
| `convenente_cnpj` | CNPJ | cartão CNPJ | ✓ | ✓ | Campo estruturante; validar formato e consistência |
| `convenente_endereco` | Endereço | cartão CNPJ | ✓ | ✓ | Conferir com contrato social quando necessário |
| `convenente_numero` | Número | documento | ✓ | ✓ | Pode permanecer integrado ao endereço |
| `convenente_complemento` | Complemento | documento | ✓ | ✓ | Opcional |
| `convenente_bairro` | Bairro | documento | ✓ | ✓ | — |
| `convenente_municipio` | Município | documento | ✓ | ✓ | — |
| `convenente_uf` | UF | documento | ✓ | ✓ | — |
| `convenente_cep` | CEP | documento | ✓ | ✓ | — |
| `convenente_telefone` | Telefone | documento/carta proposta | — | ✓ | Consta nos PTs analisados |
| `convenente_email` | E-mail | documento/carta proposta | — | ✓ | Consta nos PTs analisados |
| `convenente_homepage` | Home page | documento/carta proposta | — | ✓ | Campo existente no modelo do PT; pode ficar vazio |
| `representante_nome` | Nome do representante | contrato social/ata/documento | ✓ | ✓ | Conferência obrigatória quando extraído |
| `representante_cpf` | CPF | documento do representante | ✓ | ✓ | — |
| `representante_rg` | CI/RG | documento do representante | ✓ | ✓ | — |
| `representante_orgao_expedidor` | Órgão expedidor | documento do representante | ✓ | ✓ | — |
| `representante_cargo` | Cargo | contrato social/ata | — | ✓ | No PT |
| `representante_funcao` | Função | contrato social/ata | — | ✓ | No PT |

Para município, o conjunto de documentos e os dados esperados são diferentes: carta proposta, cartão CNPJ da Prefeitura, ata de posse do Prefeito e documento de identificação do Prefeito. O modelo deve permitir isso sem criar uma tela separada inteira.

## 4. Partícipes fixos do Estado

Estes dados não devem ser digitados pelo usuário. Devem existir como configuração institucional versionada.

### SSPS

- Estado do Rio Grande do Sul
- Secretaria de Sistemas Penal e Socioeducativo
- CNPJ: 32.613.632/0001-17
- Endereço: Avenida Borges de Medeiros, nº 1501, 11º andar, Porto Alegre/RS
- Representante: Secretário de Sistemas Penal e Socioeducativo

### Polícia Penal

- Polícia Penal
- CNPJ: 17.176.399/0001-69
- Endereço: Avenida Joaquim Porto Villanova, nº 201, Porto Alegre/RS
- Representante: Superintendente da Polícia Penal

Os documentos analisados mostram esses dados repetidos no TC e no PT. fileciteturn97file0L39-L54 fileciteturn97file0L229-L286

## 5. Execução do trabalho

| Campo interno | Nome exibido | Origem ideal | TC | PT | Observação |
|---|---|---|---|---|---|
| `quantidade_pessoas` | Quantidade de pessoas presas | carta proposta | ✓ | ✓ | Não impor limite artificial de quantidade |
| `regimes` | Regimes prisionais | carta proposta | ✓ | derivado | Pode conter fechado, semiaberto e aberto |
| `estabelecimentos` | Estabelecimentos prisionais | seleção/cadastro | ✓ | ✓ | Lista dinâmica; pode conter várias unidades |
| `atividades` | Atividades a serem desenvolvidas | carta proposta | ✓ | ✓ | Lista de atividades; normalizar capitalização sem alterar nomes próprios |
| `local_prestacao_tipo` | Local de prestação | seleção | ✓ | derivado | Sede da empresa / sede do estabelecimento prisional / Outro |
| `local_prestacao_outro` | Outro local | manual | ✓ | derivado | Obrigatório somente quando tipo = outro |
| `local_prestacao_municipio` | Município do local | documento/cadastro | ✓ | — | Pode ser derivado do endereço selecionado |
| `jornada_inicio` | Início da jornada | carta proposta | ✓ | — | Ex.: 08:00 |
| `jornada_fim` | Fim da jornada | carta proposta | ✓ | — | Ex.: 18:00 |
| `intervalo_duracao` | Intervalo intrajornada | carta proposta | ✓ | — | Ex.: 2 horas |
| `dias_trabalho` | Dias de trabalho | carta proposta | ✓ | — | Ex.: segunda a sexta-feira |
| `dias_repouso` | Dias de repouso | derivado/manual | ✓ | — | Deve refletir a informação apresentada no instrumento |
| `jornada_semanal` | Carga horária semanal | derivado | ✓ | — | Sistema calcula a partir da jornada quando possível |
| `regras_feriados` | Regra específica de feriados | carta proposta/manual | ✓ | — | Se houver situação especial, alertar e permitir prosseguimento |
| `feriados_especificos` | Feriados/permuta | carta proposta/manual | ✓ | — | Lista livre quando aplicável |

Os documentos mostram variações relevantes: jornada 08:00–18:00 com intervalo de 2 horas e atividades de confecção/costura; 08:30–17:30 com intervalo de 1 hora e atividades de acabamento/fabricação; e 07:30–17:30 com intervalo de 2 horas e trabalho eventualmente aos sábados. fileciteturn97file0L64-L72 fileciteturn97file2L557-L567 fileciteturn99file1L20-L30

Portanto, não devemos criar uma jornada fixa no código.

## 6. Regimes e estabelecimentos

`estabelecimentos` deve ser uma relação N:N com o cadastro de estabelecimentos penais.

Exemplos encontrados nas minutas:

- Penitenciária Estadual de Charqueadas III; fileciteturn97file0L76-L78
- Penitenciária Estadual Feminina de Guaíba; fileciteturn97file2L570-L575
- Presídio Estadual de Lajeado + Instituto Penal de Monitoramento Eletrônico da 8ª Região; fileciteturn97file3L970-L973
- Instituto Penal de Monitoramento Eletrônico da 4ª Região + Presídio Estadual de Frederico Westphalen. fileciteturn99file0L5-L14

A quantidade total é única no instrumento, mas o Plano de Trabalho pode decompor a execução por estabelecimento. No caso do RDR, por exemplo, o PT criou as etapas 1.1 e 1.2 para os dois estabelecimentos. fileciteturn97file3L1240-L1256

## 7. Remuneração

`remuneracao_texto` deve ser texto estruturado/flexível, e não apenas percentual.

Os documentos demonstram pelo menos três situações:

- ao menos 75% do salário mínimo; fileciteturn97file0L116-L123
- 75% do salário mínimo; fileciteturn97file2L623-L630
- 100% do salário mínimo + auxílio/vale-alimentação e auxílio/vale-transporte para regimes semiaberto/aberto. fileciteturn97file3L1026-L1035

O sistema deve oferecer um exemplo no campo, como placeholder: `100% do salário mínimo nacional vigente`.

## 8. Pecúlio e recolhimentos

A redação atualmente observada no modelo contém regras que aparecem automaticamente no instrumento:

- acréscimo de 10% sobre o valor bruto para o Fundo Penitenciário; fileciteturn97file0L120-L127
- pecúlio correspondente a 20% da remuneração. fileciteturn97file0L128-L133

Esses elementos devem ser tratados inicialmente como texto fixo do template, e não como campos do formulário, salvo se uma futura revisão da minuta indicar necessidade de parametrização.

## 9. Vigência

| Campo | Regra |
|---|---|
| `vigencia_anos` | padrão = 5 anos |
| `vigencia_justificativa` | obrigatória se vigência < 5 anos |
| `vigencia_inicio` | decorrente da regra do instrumento; a minuta diz que conta da publicação da súmula |
| `vigencia_fim` | calculável quando houver data de início conhecida |

As três minutas analisadas utilizam vigência de 5 anos a contar da publicação da súmula. fileciteturn97file0L139-L145 fileciteturn97file2L651-L655

## 10. Plano de Trabalho

### 10.1 Dados cadastrais

O PT repete praticamente todo o cadastro do convenente e acrescenta campos que não aparecem no TC, como telefone, e-mail, home page, cargo, função e matrícula/IF dos representantes institucionais. fileciteturn97file0L199-L228 fileciteturn97file0L229-L286

### 10.2 Descrição do projeto

Campos:

- `titulo_projeto` — atualmente “Utilização de mão de obra prisional”;
- `periodo_execucao_inicio`;
- `periodo_execucao_fim`;
- `identificacao_objeto` — atualmente texto fixo sobre utilização de mão de obra da pessoa presa;
- `justificativa_proposicao` — atualmente texto padrão sobre inclusão social da pessoa presa.

Os documentos analisados mantêm o mesmo título, objeto e justificativa. fileciteturn97file0L287-L297

### 10.3 Cronograma de execução

Manteremos, para o MVP, a estrutura existente:

- Meta;
- Descrição da Meta;
- Etapa;
- Descrição da Etapa;
- Indicador Físico — Unidade = `Mês`;
- Quantidade;
- Início;
- Término.

Para uma vigência de 5 anos, as minutas usam quantidade 60 e período 2026–2031. fileciteturn97file0L298-L326

A geração deve ser automática a partir de quantidade, estabelecimentos e vigência. Se houver mais de um estabelecimento, o sistema pode gerar uma etapa por estabelecimento, como já ocorre na minuta do RDR. fileciteturn97file3L1240-L1256

### 10.4 Plano de aplicação

A minuta apresenta uma estrutura de CONVENENTE / ESTADO / TOTAL GERAL e texto vinculado à remuneração. O valor total geral aparece como 0,00 nos exemplos analisados. fileciteturn97file0L327-L337

No MVP, o sistema deve preservar o modelo sem tentar calcular valores que dependam de informações não disponíveis.

### 10.5 Declaração

A declaração é texto padrão do Plano de Trabalho e identifica o representante legal do proponente. fileciteturn97file0L338-L346

Não deve ser digitada manualmente.

### 10.6 Aprovação

A aprovação contém texto padrão e os representantes da SSPS e Polícia Penal. fileciteturn97file0L347-L353

Não deve ser digitada pelo interessado.

## 11. Campos derivados / não solicitar ao usuário

Os seguintes dados devem ser derivados sempre que possível:

- descrição do objeto;
- identificação dos partícipes estaduais;
- endereços institucionais;
- representação da SSPS e Polícia Penal;
- descrição da meta;
- descrição das etapas;
- indicador físico `Mês`;
- quantidade de meses;
- início e término do cronograma;
- declaração padrão;
- aprovação;
- cláusulas jurídicas padronizadas.

## 12. Campos que devem ser obtidos prioritariamente por documentos

### Empresa

Documentos previstos no fluxo do projeto:

1. Carta Proposta assinada;
2. Comprovante de endereço empresarial;
3. Contrato Social vigente e alterações;
4. Documento do responsável;
5. Cartão CNPJ atualizado;
6. Inscrição estadual;
7. Termo de opção pelo Simples Nacional.

### Município

1. Carta Proposta;
2. Cartão CNPJ da Prefeitura;
3. Ata de posse do Prefeito;
4. Documento de identificação do Prefeito.

A interface deve tentar extrair desses documentos o máximo possível antes de pedir preenchimento manual.

## 13. Campos de intervenção humana

Devem continuar existindo, mesmo após OCR/extração automática:

- confirmação dos dados extraídos;
- correção de divergências documentais;
- quantidade de pessoas;
- regimes;
- estabelecimentos;
- atividades;
- local de prestação;
- jornada;
- remuneração;
- regras especiais de feriados;
- justificativa de vigência inferior a 5 anos;
- FPE/processo quando ainda não disponíveis.

## 14. Alertas — não bloqueios

O sistema deve alertar, mas não impedir a geração, quando:

- jornada diária ficar fora de 6–8 horas;
- carga semanal ultrapassar 44 horas;
- houver situação atípica envolvendo domingos/feriados;
- remuneração informada parecer incompatível com o mínimo esperado;
- documentos divergirem entre si;
- vigência for inferior a 5 anos;
- FPE ou processo ainda não estiverem disponíveis.

A decisão administrativa permanece humana.

## 15. Normalização de atividades

Atividades devem ser armazenadas como itens independentes, permitindo que o usuário adicione várias.

O sistema poderá sugerir uma redação padronizada, preservando nomes próprios e termos técnicos. Exemplo de transformação desejada:

`ROÇADA` → `Roçada`

`CAPINA E LIMPEZA` → `Capina e limpeza`

A sugestão não deve substituir automaticamente o texto do usuário sem confirmação.

## 16. Arquitetura de dados desejada

```text
solicitacao
 ├── convenente
 ├── representante
 ├── estabelecimentos [N:N]
 ├── atividades [1:N]
 ├── regimes [N:N]
 ├── jornada
 ├── remuneracao
 ├── local_prestacao
 ├── vigencia
 ├── documentos_submetidos [1:N]
 └── documentos_gerados [1:N]
```

O TC e o PT devem ser **projeções do mesmo objeto de dados**, e não dois formulários independentes.

## 17. Próxima implementação

1. Revisar este dicionário com as diferenças restantes das versões fornecidas.
2. Ajustar o schema do Supabase para refletir os campos realmente necessários.
3. Criar o modelo JSON interno da solicitação.
4. Criar o primeiro formulário mínimo.
5. Implementar a geração do TC e do PT a partir de um caso de teste.
6. Só depois adicionar extração/OCR e conferência documental.
