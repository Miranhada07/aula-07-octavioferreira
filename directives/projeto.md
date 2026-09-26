📘 SOP Mestre: BurguerSync Ourinhos
Status: Planejamento / Inicialização | Versão: 2.5.5

1. Visão Geral e Objetivo Principal
O BurguerSync Ourinhos é um sistema full-stack em tempo real desenvolvido para digitalizar e agilizar o fluxo de ponta a ponta de uma hamburgueria, eliminando ruídos de comunicação entre o salão/delivery e a cozinha. Ele resolve a latência e o extravio de pedidos manuais através de duas frentes: uma interface de autosserviço/delivery para o cliente com validação rígida de dados e catálogo dinâmico, e uma esteira visual de pedidos (KDS - Kitchen Display System) com sincronização em tempo real (via Firebase Cloud Firestore) para a equipe de operação e preparo.

2. Arquitetura do Projeto (Antigravity v2.5.5)
O projeto estrutura-se estritamente no padrão de 3 camadas para isolamento de responsabilidades:
- Layer 1 (Diretiva & Estratégia - Regras de Negócio):
  - Diretrizes operacionais e regras de validação definidas neste SOP e em `directives/design/design.md`.
  - Definição de esquema de dados (schema NoSQL), regras de cálculo de pedidos (taxa fixa de entrega de R$ 5,00, cálculo de subtotal e total), máquina de estados dos pedidos (`Recebido` -> `Em Preparo` -> `Saiu para Entrega` -> `Entregue`) e políticas de cobrança/troco.
- Layer 2 (Orquestração / Agente IA):
  - Coordenação inteligente dos fluxos de desenvolvimento, geração de interfaces com auxílio de Google Stitch e Gemini, parsing de templates e estruturação dos módulos ES6.
  - Orquestração dos ciclos de deploy, controle de versões de artefatos e mediação entre diretivas de negócio e scripts determinísticos.
- Layer 3 (Execução & Determinismo):
  - Implementação do código executável determinístico em JavaScript puro modular (ES6 via CDN), validações via DOM API, inicialização do SDK Firebase Web v10 e rotinas de build/deploy.
  - Isolamento de arquivos: todo cache temporário, dumps de validação e builds transitórios residem estritamente no diretório `.tmp/`. Os entregáveis finais e o código de produção são direcionados para hospedagem em nuvem (GitHub Pages e Firebase Cloud Platform).

3. Escopo Tecnológico & Requisitos (Tech Stack)
- Frontend / Interface: HTML5 semântico, CSS3 estruturado (layouts gerados com suporte de Google Stitch e Gemini), JavaScript Vanilla (ES6 Modules via CDN). Sistema de alternância de abas/seções SPA (Visão Cliente vs. Visão Cozinha).
- Backend / BaaS & Realtime: Firebase Cloud Firestore (SDK Web v10 modular).
- Persistência / Dados: Coleção `pedidos` no Firestore com escuta reativa em tempo real via listener `onSnapshot` e ordenação descendente (`horario`, `desc`).
- Gerenciamento de Ambientes: Variáveis e credenciais do Firebase carregadas de forma dinâmica e segura via `.env` (com injeção determinística de build).
- Armazenamento Transitório e Nuvem:
  - Cache local e intermediários: `.tmp/`
  - Deploy e Produção: GitHub Pages (Frontend) e Google Firebase (Cloud Firestore & Security Rules).

4. Diretrizes de UX/UI e Referências Visuais
- Inspiração Real: Plataformas modernas de pedidos e delivery (iFood, Rappi) combinadas a painéis industriais de cozinha (KDS - McDonald's / Toast POS).
- Experiência do Usuário (UX/UI):
  - Seguir rigorosamente o padrão visual estabelecido em `directives/design/design.md`.
  - Design Mobile-First totalmente responsivo com microinterações fluidas ao adicionar/remover itens do carrinho.
  - Alternância intuitiva entre as visualizações "Visão Cliente" e "Visão Cozinha".
  - Feedback visual imediato: exibição de número do pedido, instruções customizadas para o meio de pagamento selecionado (ex.: geração ou cópia de chave Pix) e avisos de erro em campos faltantes (Nome, Celular, Endereço e carrinho vazio).
  - Atualização assíncrona instantânea na cozinha sem reload (F5) ou travamento de thread.

5. Fluxo Operacional de Execução
- Kickoff: Ingestão de `ideia_projeto.md` e consolidação da arquitetura no SOP mestre `projeto.md`.
- Configuração de Ambiente:
  - Criação do workspace local e isolamento do diretório `.tmp/` no `.gitignore`.
  - Configuração do projeto no Firebase Console, habilitando Cloud Firestore e configurando as chaves de acesso no `.env`.
- Modelagem de Dados e Layer 1:
  - Padronização do documento NoSQL da coleção `pedidos`:
    ```json
    {
      "cliente": { "nome": "", "email": "", "celular": "", "endereco": "", "obsEntrega": "" },
      "itens": [{ "nome": "", "preco": 0.0, "quantidade": 1, "obsItem": "" }],
      "pagamento": { "metodo": "Pix | Cartao_Entrega | Dinheiro_Entrega", "troco": 0.0 },
      "valores": { "subtotal": 0.0, "taxaEntrega": 5.00, "total": 0.0 },
      "status": "Recebido",
      "horario": "serverTimestamp()"
    }
    ```
- Implementação Determinística (Layer 3):
  - `src/js/firebase-config.js`: Carregamento dinâmico das credenciais e inicialização do Firestore via CDN ES6.
  - `src/js/client.js`: Gerenciamento do carrinho, validação obrigatória pré-envio, dispatch com `addDoc` e exibição de comprovante.
  - `src/js/kitchen.js`: Registro do listener reativo `onSnapshot` (`orderBy("horario", "desc")`) e binds dos botões de avanço de status disparando `updateDoc`.
- Verificação & Deploy:
  - Execução de testes manuais e de integração gravando logs de teste temporários em `.tmp/logs/`.
  - Configuração da action de deploy automatizado para o GitHub Pages.

6. Definição de Sucesso (Deliverables)
- Entregáveis em Nuvem:
  - Aplicação Web responsiva publicada e ativa no GitHub Pages com alternância de abas Cliente/Cozinha.
  - Instância do Cloud Firestore provisionada com regras de segurança ativas e coleção `pedidos` operacional.
- Artefatos Obrigatórios do Repositório:
  - `README.md`: Apresentação moderna do projeto, arquitetura, stack e link da aplicação em produção.
  - `instruction.md`: Guia passo a passo de configuração do `.env`, execução local e orientações de deploy.
  - `executar.bat`: Script de automação para inicialização de servidor estático local e validação rápida em ambiente Windows.

7. Tratamento de Erros, Resiliência e Self-Annealing
- Detecção Automática de Falhas (Feedback Loop):
  - Captura estruturada de erros de conexão com o Firebase (ex.: `PERMISSION_DENIED`, `UNAVAILABLE`) através de blocos `try/catch` nas chamadas `addDoc` e `updateDoc`, além do tratamento do callback de erro no `onSnapshot`.
  - Monitoramento de falhas de schema ou ausência de variáveis no `.env` durante o bootstrap da aplicação.
- Ciclo de Auto-Recuperação (Self-Annealing Cycle):
  1. *Captura & Log Transitório*: Toda falha de execução em tempo de desenvolvimento ou teste é interceptada e registrada em `.tmp/annealing-errors.log` com pilha de execução completa.
  2. *Degradação Graciosa em Runtime*: Caso a conexão em tempo real com o Firestore seja interrompida, a interface do cliente armazena a tentativa de envio temporariamente no `sessionStorage`/`localStorage` e exibe aviso de reconexão; a Visão Cozinha exibe um indicador visual de "Reconectando..." e tenta renovar o listener automaticamente com retentativas e recuo exponencial (exponential backoff).
  3. *Auditoria de Causa Raiz*: O agente orquestrador analisa o log de falha e identifica se a raiz está no Layer 1 (regra/schema defasado) ou no Layer 3 (código/chamada de API incorreta).
  4. *Correção Determinística*: Correção pontual do script determinístico correspondente sem efeitos colaterais nas diretivas.
  5. *Evolução Documental*: Qualquer alteração estrutural no payload do Firestore, nas regras de transição de status ou no ciclo de vida da aplicação deve ser retroalimentada e versionada diretamente nos sub-SOPs e neste documento mestre.