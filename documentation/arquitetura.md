# 🏛️ Documentação de Arquitetura - BurguerSync Ourinhos

## 1. Visão Geral da Arquitetura de 3 Camadas
O projeto é estruturado segundo as diretrizes de confiabilidade do agente:

```text
aula-07-octavioferreira/
├── .env.example              # Modelo de variáveis de ambiente
├── .gitignore                # Proteção de credenciais e caches
├── README.md                 # Apresentação do projeto bilíngue
├── instruction.md            # Guia passo a passo de operação
├── executar.bat              # Script batch para execução no Windows
├── index.html                # Ponto de entrada com redirecionamento para o frontend
│
├── directives/               # [CAMADA 1 - ESTRATÉGIA]
│   ├── projeto.md            # SOP mestre com regras de negócio
│   └── design/design.md      # Especificação de UI/UX e Design System
│
├── execution/                # [CAMADA 3 - DETERMINISMO & SCRIPTS]
│   ├── server.mjs            # Servidor HTTP estático nativo
│   ├── test-firestore.mjs    # Teste de conexão do Firestore
│   ├── seed-firebase.mjs     # População de pedidos de teste no banco
│   └── deploy-github.mjs     # Automação de criação de repositório e deploy
│
├── frontend/                 # [CAMADA 3 - INTERFACE & CLIENTE]
│   ├── index.html            # Aplicação SPA (Cliente, Rotas, Cozinha KDS)
│   ├── css/style.css         # Estilização completa Dark Mode com acentos neon
│   └── js/
│       ├── app.js            # Orquestrador de visualizações e eventos SPA
│       ├── cardapio.js       # Catálogo de produtos e bairros com URLs Stitch
│       ├── client.js         # Lógica do autosserviço, carrinho e checkout
│       ├── kitchen.js        # Painel KDS reativo com listeners Firestore
│       ├── routes.js         # Mapa e taxas de bairros de Ourinhos
│       └── firebase-config.js# Inicialização do SDK Firebase Web v10
│
└── documentation/            # [DOCUMENTAÇÃO & AUDITORIA]
    ├── promptHistory.md      # Rastreabilidade integral de todos os prompts
    └── arquitetura.md        # Este documento
```

---

## 2. Fluxo de Dados e Ciclo de Vida do Pedido

1. **Seleção de Produtos:** O cliente navega pelo catálogo e clica em `+ Adicionar`.
2. **Carrinho & Customização:** O item é adicionado ao estado local com suporte a observações específicas por lanche.
3. **Cálculo da Entrega:** O cliente escolhe seu bairro em Ourinhos. A taxa de entrega é recalculada instantaneamente (R$ 5,00 a R$ 8,00 dependendo da localidade).
4. **Checkout & Persistência:** Ao submeter o formulário, o pedido é gravado na coleção `pedidos` do Firebase Firestore com o timestamp do servidor (`serverTimestamp()`).
5. **Esteira da Cozinha (KDS):** O listener `onSnapshot` captura a inclusão do documento instantaneamente e renderiza o cartão no KDS com alarme de tempo e botão de avanço de status.
6. **Transição de Estados:**
   `Recebido` ➔ `Em Preparo` ➔ `Saiu para Entrega` ➔ `Entregue`
   Cada avanço dispara um `updateDoc` atômico no Firestore.
