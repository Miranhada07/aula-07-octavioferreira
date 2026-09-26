Especificação de UI/UX & Frontend Design System: BurguerSync OurinhosDocumento de diretriz técnica para implementação da interface, contendo tokens de design, hierarquia tipográfica, arquitetura de componentes semânticos (HTML5) e estilos globais (CSS3 puro com variáveis e responsividade Mobile-First).1. Design Tokens & Paleta de CoresAplicação estruturada em Dark Mode imersivo com contraste otimizado (WCAG AAA para textos informativos e AA para botões interativos), acentos em laranja/amarelo neon para estímulo de apetite/conversão e verde vibrante para validações e checkout.CSS:root {
  /* Surface & Backgrounds */
  --bg-primary: #0C0C0E;        /* Fundo principal da aplicação */
  --bg-surface: #18181B;        /* Cards, modais e containers */
  --bg-surface-elevated: #27272A;/* Inputs, painéis flutuantes, tooltips */
  --bg-overlay: rgba(12, 12, 14, 0.85); /* Backdrops de modal/carrinho */

  /* Borders & Dividers */
  --border-subtle: #2E2E35;
  --border-active: #3F3F46;

  /* Typography Colors */
  --text-primary: #F4F4F5;      /* Textos principais, títulos, preços */
  --text-secondary: #A1A1AA;    /* Descrições, tags secundárias, rótulos */
  --text-muted: #71717A;        /* Placeholders, hints desabilitados */
  --text-inverse: #0C0C0E;      /* Texto sobre botões vibrantes */

  /* Brand Accents (Laranja / Amarelo Neon) */
  --accent-primary: #FF9000;    /* CTA de adicionar, ícones de destaque */
  --accent-neon: #FFB703;       /* Hover state, badge de observações */
  --accent-glow: rgba(255, 144, 0, 0.35);

  /* Feedback & Confirmações */
  --success-primary: #04D361;   /* Finalização de pedido, status entregue */
  --success-glow: rgba(4, 211, 97, 0.35);
  --warning-primary: #FB8500;   /* Status em preparo */
  --warning-glow: rgba(251, 133, 0, 0.30);
  --info-primary: #38BDF8;      /* Status saiu para entrega */
  --danger-primary: #EF4444;    /* Cancelamento / remoção */

  /* Spacings & Layout */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-smooth: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
2. Tipografia e Hierarquia VisualA tipografia utiliza a fonte Inter ou Plus Jakarta Sans como primária (legibilidade de interfaces) e Space Grotesk ou Montserrat para títulos e valores monetários.NívelFamíliaTamanhoPesoLine HeightAplicaçãoDisplay / H1Space Grotesk2rem (32px) / 2.5rem (40px desktop)700 (Bold)1.2Cabeçalhos de topo e tela inicialH2Space Grotesk1.5rem (24px)700 (Bold)1.3Seções da Vitrine, Carrinho, CozinhaH3 / Card TitlePlus Jakarta Sans1.125rem (18px)600 (Semi-bold)1.3Nome do Lanche, Título do PedidoPreço em DestaqueSpace Grotesk1.25rem (20px)700 (Bold)1.1Valores monetários (R$ 28,00)Body (Corpo)Inter0.9375rem (15px)400 (Regular)1.5Descrições dos lanches, resumosLabels & InputsInter0.875rem (14px)500 (Medium)1.4Formulários, seletores de pagamentoBadges / MetadadosInter / Mono0.75rem (12px)600 (Semi-bold)1.2Status de pedido, contadores, tags3. Arquitetura HTML5 SemânticaEstrutura completa com seletores e IDs necessários para a reatividade do Front-End:HTML<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BurguerSync Ourinhos | Delivery Express</title>
</head>
<body>
  <!-- Header Principal com Seletor de Modo e Atalho do Carrinho -->
  <header class="app-header">
    <div class="header-container">
      <div class="brand">
        <span class="brand-badge">Ourinhos</span>
        <h1 class="brand-title">Burguer<span>Sync</span></h1>
      </div>

      <nav class="mode-navigation">
        <button id="btnModoCliente" class="nav-btn active" type="button">🛍️ Cliente</button>
        <button id="btnModoCozinha" class="nav-btn" type="button">👨‍🍳 Cozinha <span id="cozinhaContador" class="badge-counter">0</span></button>
      </nav>

      <button id="btnAbrirCarrinho" class="cart-floating-trigger" aria-label="Ver Carrinho">
        🛒 <span class="cart-trigger-label">Carrinho</span>
        <span id="carrinhoQtdTotal" class="badge-neon">0</span>
      </button>
    </div>
  </header>

  <!-- ================= VISÃO DO CLIENTE ================= -->
  <main id="visaoCliente" class="main-content">
    
    <!-- Hero / Boas-vindas -->
    <section class="banner-hero">
      <div class="banner-content">
        <h2>O Smash Mais Quente de Ourinhos</h2>
        <p>Pão brioche selado, carne artesanal e entrega rápida em toda a cidade.</p>
      </div>
    </section>

    <!-- Vitrine de Lanches -->
    <section class="catalogo-section">
      <div class="section-title-wrap">
        <h2>Cardápio de Lanches & Porções</h2>
      </div>

      <div id="gridLanches" class="products-grid">
        <!-- Exemplo Card 1 -->
        <article class="card-produto" data-id="1">
          <div class="card-imagem-wrap">
            <img src="assets/ourinhos-smash.jpg" alt="Ourinhos Smash Burguer" class="card-img" loading="lazy">
            <span class="tag-categoria">Smash Burger</span>
          </div>
          <div class="card-detalhes">
            <h3 class="produto-nome">Ourinhos Smash Burguer</h3>
            <p class="produto-descricao">Pão brioche tostado na manteiga, 2x smash burger 80g, queijo cheddar cremoso e bacon artesanal crocante.</p>
            <div class="card-footer-action">
              <span class="produto-preco">R$ 28,00</span>
              <button class="btn-adicionar" data-action="adicionar" data-id="1">
                + Adicionar
              </button>
            </div>
          </div>
        </article>

        <!-- Exemplo Card 2 -->
        <article class="card-produto" data-id="2">
          <div class="card-imagem-wrap">
            <img src="assets/monster-bacon.jpg" alt="Monster Bacon SENAI" class="card-img" loading="lazy">
            <span class="tag-categoria">Monster</span>
          </div>
          <div class="card-detalhes">
            <h3 class="produto-nome">Monster Bacon SENAI</h3>
            <p class="produto-descricao">Pão australiano legítimo, 200g blend artesanal, extra bacon defumado, anéis de cebola empanados e molho barbecue.</p>
            <div class="card-footer-action">
              <span class="produto-preco">R$ 34,00</span>
              <button class="btn-adicionar" data-action="adicionar" data-id="2">
                + Adicionar
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Gaveta / Modal do Carrinho -->
    <aside id="carrinho" class="carrinho-drawer hidden" aria-hidden="true">
      <div class="carrinho-header">
        <h3>Seu Pedido</h3>
        <button id="btnFecharCarrinho" class="btn-icon-close">&times;</button>
      </div>

      <div id="listaItensCarrinho" class="carrinho-body">
        <!-- Template de Item do Carrinho -->
        <div class="carrinho-item" data-id="1">
          <div class="item-info">
            <h4 class="item-title">Ourinhos Smash Burguer</h4>
            <span class="item-preco-unit">R$ 28,00</span>
            <input type="text" class="input-observacao" placeholder="Obs: Sem cebola, ponto da carne..." maxlength="120">
          </div>
          <div class="item-controles">
            <button class="btn-qty" data-action="diminuir">-</button>
            <span class="qty-number">1</span>
            <button class="btn-qty" data-action="aumentar">+</button>
            <button class="btn-remove" title="Excluir item">&times;</button>
          </div>
        </div>
      </div>

      <!-- Resumo de Valores -->
      <div class="carrinho-resumo">
        <div class="resumo-linha">
          <span>Subtotal</span>
          <span id="carrinhoSubtotal">R$ 0,00</span>
        </div>
        <div class="resumo-linha">
          <span>Taxa de Entrega (Ourinhos)</span>
          <span id="taxaEntrega">R$ 5,00</span>
        </div>
        <div class="resumo-linha total">
          <span>Total Geral</span>
          <span id="carrinhoTotal">R$ 0,00</span>
        </div>
      </div>

      <!-- Formulário de Entrega e Pagamento -->
      <form id="formCheckout" class="checkout-form">
        <h4>Dados de Entrega</h4>
        <div class="form-group">
          <label for="nomeCliente">Nome Completo *</label>
          <input type="text" id="nomeCliente" name="nomeCliente" required placeholder="Ex: João da Silva">
        </div>

        <div class="form-group-row">
          <div class="form-group flex-2">
            <label for="telefoneCliente">WhatsApp/Celular *</label>
            <input type="tel" id="telefoneCliente" name="telefoneCliente" required placeholder="(14) 99999-9999">
          </div>
          <div class="form-group flex-1">
            <label for="numeroCasa">Nº *</label>
            <input type="text" id="numeroCasa" name="numeroCasa" required placeholder="123">
          </div>
        </div>

        <div class="form-group">
          <label for="enderecoCliente">Rua / Logradouro *</label>
          <input type="text" id="enderecoCliente" name="enderecoCliente" required placeholder="Ex: Rua Duque de Caxias">
        </div>

        <div class="form-group">
          <label for="bairroCliente">Bairro *</label>
          <input type="text" id="bairroCliente" name="bairroCliente" required placeholder="Ex: Vila Nova Christoni">
        </div>

        <div class="form-group">
          <label for="obsEntrega">Instruções para Entrega</label>
          <input type="text" id="obsEntrega" name="obsEntrega" placeholder="Apto 42, buzinar no portão preto...">
        </div>

        <h4>Forma de Pagamento</h4>
        <div class="payment-tabs">
          <label class="payment-option">
            <input type="radio" name="tipoPagamento" id="tipoPagamento" value="pix" checked>
            <div class="payment-card-badge">
              <span class="icon">⚡</span>
              <span>Pix (Instantâneo)</span>
            </div>
          </label>

          <label class="payment-option">
            <input type="radio" name="tipoPagamento" value="cartao">
            <div class="payment-card-badge">
              <span class="icon">💳</span>
              <span>Cartão na Entrega</span>
            </div>
          </label>

          <label class="payment-option">
            <input type="radio" name="tipoPagamento" value="dinheiro">
            <div class="payment-card-badge">
              <span class="icon">💵</span>
              <span>Dinheiro</span>
            </div>
          </label>
        </div>

        <!-- Bloco Condicional de Troco -->
        <div id="trocoContainer" class="form-group hidden">
          <label for="valorTroco">Precisa de troco para quanto?</label>
          <input type="text" id="valorTroco" name="valorTroco" placeholder="Ex: R$ 50,00">
        </div>

        <!-- Bloco Pix com QR Code e Copia e Cola -->
        <div id="pixContainer" class="pix-preview-box">
          <div class="pix-badge">Chave Pix Oficial</div>
          <div class="pix-copiacola-wrap">
            <input type="text" id="pixCodigoCopia" readonly value="00020126580014br.gov.bcb.pix0136burguersync-ourinhos-pix-key520400005303986540528.005802BR">
            <button type="button" id="btnCopiarPix" class="btn-copy">Copiar Código</button>
          </div>
          <small>Após finalizar, envie o comprovante se solicitado.</small>
        </div>

        <button type="submit" id="btnFinalizarPedido" class="btn-checkout-action">
          🚀 Finalizar e Enviar para a Cozinha
        </button>
      </form>
    </aside>
  </main>

  <!-- ================= VISÃO DA COZINHA ================= -->
  <section id="visaoCozinha" class="cozinha-dashboard hidden">
    <div class="cozinha-header-status">
      <div>
        <h2>Painel KDS da Cozinha</h2>
        <p>Monitoramento e expedição em tempo real.</p>
      </div>
      <div class="filtro-pedidos">
        <span class="status-summary">Ativos: <strong id="totalPedidosAtivos">3</strong></span>
      </div>
    </div>

    <div id="listaPedidos" class="pedidos-kanban-grid">
      <!-- Exemplo de Card de Pedido na Cozinha -->
      <article class="card-pedido-cozinha status-preparo" data-pedido-id="101">
        <div class="pedido-top">
          <div class="pedido-id-time">
            <span class="pedido-codigo">#101</span>
            <span class="pedido-tempo">12:35 (Há 12 min)</span>
          </div>
          <span class="badge-status badge-warning">Em Preparo</span>
        </div>

        <div class="pedido-cliente">
          <strong>Lucas Andrade</strong>
          <span>(14) 99821-4433</span>
          <p class="endereco-entrega">Rua Expedicionários, 742 - Centro</p>
        </div>

        <div class="pedido-itens-lista">
          <div class="pedido-item-row">
            <span class="qty">2x</span>
            <span class="nome">Ourinhos Smash Burguer</span>
          </div>
          <div class="obs-destaque">
            ⚠️ <strong>Obs:</strong> Sem cebola em um dos lanches.
          </div>
          <div class="pedido-item-row">
            <span class="qty">1x</span>
            <span class="nome">Batata Rústica Suprema</span>
          </div>
        </div>

        <div class="pedido-footer-actions">
          <button class="btn-status-flow btn-status-proximo" data-next-status="Saiu para Entrega">
            Avançar ➔ Saiu p/ Entrega
          </button>
        </div>
      </article>
    </div>
  </section>

  <!-- Overlay para fechar drawer no mobile -->
  <div id="backdropCarrinho" class="carrinho-overlay hidden"></div>
</body>
</html>
4. Estilos CSS3 Modernos (Dark Mode, Flexbox/Grid, Efeitos Neon)Estrutura pronta para compilar diretamente na folha de estilos:CSS/* ==========================================================
   RESET & CONFIGURAÇÕES GLOBAIS
   ========================================================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

img {
  max-width: 100%;
  display: block;
}

/* ==========================================================
   HEADER & NAVEGAÇÃO
   ========================================================== */
.app-header {
  position: sticky;
  top: 0;
  z-index: 90;
  background-color: rgba(18, 18, 20, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 12px 16px;
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-badge {
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
}

.brand-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #FFFFFF;
}

.brand-title span {
  color: var(--accent-neon);
}

.mode-navigation {
  display: flex;
  background: var(--bg-surface-elevated);
  border-radius: var(--radius-full);
  padding: 3px;
  border: 1px solid var(--border-subtle);
}

.nav-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.82rem;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-btn.active {
  background: var(--bg-primary);
  color: var(--accent-neon);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.cart-floating-trigger {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-neon));
  border: none;
  color: var(--text-inverse);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px var(--accent-glow);
  transition: var(--transition-smooth);
}

.cart-floating-trigger:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(255, 183, 3, 0.5);
}

.badge-neon {
  background: var(--text-inverse);
  color: var(--accent-neon);
  padding: 2px 7px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 800;
}

/* ==========================================================
   VITRINE & PRODUTOS (MOBILE-FIRST GRID)
   ========================================================== */
.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;
}

.banner-hero {
  background: linear-gradient(180deg, #201A15 0%, var(--bg-surface) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
}

.banner-hero h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  color: #FFF;
  margin-bottom: 6px;
}

.banner-hero p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.section-title-wrap {
  margin-bottom: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.card-produto {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition-smooth);
}

.card-produto:hover {
  transform: translateY(-4px);
  border-color: var(--accent-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.card-imagem-wrap {
  position: relative;
  height: 180px;
  background: #121214;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tag-categoria {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(12, 12, 14, 0.75);
  backdrop-filter: blur(4px);
  color: var(--accent-neon);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 183, 3, 0.3);
}

.card-detalhes {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.produto-nome {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.produto-descricao {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 16px;
  flex-grow: 1;
}

.card-footer-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-subtle);
  padding-top: 12px;
}

.produto-preco {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-neon);
}

.btn-adicionar {
  background: transparent;
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.btn-adicionar:hover {
  background: var(--accent-primary);
  color: var(--text-inverse);
  box-shadow: 0 0 16px var(--accent-glow);
}

/* ==========================================================
   DRAWER DO CARRINHO & CHECKOUT
   ========================================================== */
.carrinho-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 440px;
  height: 100vh;
  background: var(--bg-surface);
  border-left: 1px solid var(--border-subtle);
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0,0,0,0.7);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
}

.carrinho-drawer.hidden {
  transform: translateX(100%);
  display: none;
}

.carrinho-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
}

.carrinho-header h3 {
  font-family: 'Space Grotesk', sans-serif;
}

.btn-icon-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
}

.carrinho-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.carrinho-item {
  background: var(--bg-surface-elevated);
  border-radius: var(--radius-sm);
  padding: 12px;
  border: 1px solid var(--border-subtle);
}

.item-info .item-title {
  font-size: 0.95rem;
  color: #FFF;
}

.item-info .item-preco-unit {
  font-size: 0.85rem;
  color: var(--accent-neon);
  font-weight: 600;
}

.input-observacao {
  width: 100%;
  margin-top: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.75rem;
  padding: 6px 8px;
}

.item-controles {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn-qty {
  width: 26px;
  height: 26px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
}

.qty-number {
  font-weight: 700;
  font-size: 0.9rem;
}

.btn-remove {
  background: transparent;
  border: none;
  color: var(--danger-primary);
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 8px;
}

.carrinho-resumo {
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.resumo-linha {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.resumo-linha.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #FFF;
  margin-top: 8px;
}

.resumo-linha.total span:last-child {
  color: var(--accent-neon);
}

/* Formulário de Entrega e Pagamento */
.checkout-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.checkout-form h4 {
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group-row {
  display: flex;
  gap: 10px;
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.form-group label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.form-group input {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  padding: 10px 12px;
  font-size: 0.9rem;
  outline: none;
  transition: var(--transition-smooth);
}

.form-group input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

/* Opções de Pagamento */
.payment-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.payment-option input {
  display: none;
}

.payment-card-badge {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 10px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.payment-option input:checked + .payment-card-badge {
  border-color: var(--accent-neon);
  background: rgba(255, 183, 3, 0.1);
  color: var(--accent-neon);
}

/* Pix Container */
.pix-preview-box {
  background: #111B15;
  border: 1px dashed var(--success-primary);
  border-radius: var(--radius-sm);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pix-badge {
  font-size: 0.75rem;
  color: var(--success-primary);
  font-weight: 700;
}

.pix-copiacola-wrap {
  display: flex;
  gap: 6px;
}

.pix-copiacola-wrap input {
  flex-grow: 1;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 0.75rem;
  padding: 6px;
  border-radius: 4px;
}

.btn-copy {
  background: var(--success-primary);
  color: var(--text-inverse);
  border: none;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0 10px;
  border-radius: 4px;
  cursor: pointer;
}

/* Botão de Finalização Principal */
.btn-checkout-action {
  background: linear-gradient(135deg, #04D361 0%, #03A84E 100%);
  color: #042512;
  border: none;
  padding: 14px;
  border-radius: var(--radius-md);
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 18px var(--success-glow);
  transition: var(--transition-smooth);
}

.btn-checkout-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(4, 211, 97, 0.6);
  color: #000;
}

.carrinho-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: 95;
}

/* ==========================================================
   PAINEL DA COZINHA (KDS KANBAN)
   ========================================================== */
.cozinha-dashboard {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 16px;
}

.cozinha-header-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.pedidos-kanban-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.card-pedido-cozinha {
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.card-pedido-cozinha::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.card-pedido-cozinha.status-recebido::before { background: var(--accent-neon); }
.card-pedido-cozinha.status-preparo::before { background: var(--warning-primary); }
.card-pedido-cozinha.status-entrega::before { background: var(--info-primary); }
.card-pedido-cozinha.status-entregue::before { background: var(--success-primary); }

.pedido-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pedido-codigo {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.15rem;
  color: #FFF;
}

.pedido-tempo {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: 6px;
}

/* Badges Neon */
.badge-status {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.badge-warning {
  background: rgba(251, 133, 0, 0.15);
  color: var(--warning-primary);
  border: 1px solid var(--warning-primary);
  box-shadow: 0 0 10px var(--warning-glow);
}

.pedido-cliente {
  border-bottom: 1px dashed var(--border-subtle);
  padding-bottom: 10px;
}

.pedido-cliente strong {
  display: block;
  font-size: 0.95rem;
  color: #FFF;
}

.pedido-cliente span, .endereco-entrega {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.pedido-itens-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pedido-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.pedido-item-row .qty {
  font-weight: 800;
  color: var(--accent-neon);
}

.obs-destaque {
  background: rgba(255, 144, 0, 0.1);
  border-left: 3px solid var(--accent-primary);
  padding: 6px 10px;
  font-size: 0.75rem;
  color: #FFD29D;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.btn-status-flow {
  width: 100%;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  color: #FFF;
  padding: 10px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.btn-status-flow:hover {
  background: var(--accent-primary);
  color: var(--text-inverse);
  box-shadow: 0 0 14px var(--accent-glow);
}

.hidden {
  display: none !important;
}

/* ==========================================================
   BREAKPOINTS & RESPONSIVIDADE (TABLET & DESKTOP)
   ========================================================== */
@media (min-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .pedidos-kanban-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .card-imagem-wrap {
    height: 210px;
  }
}

@media (min-width: 1280px) {
  .pedidos-kanban-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
5. Diretrizes de Interação e Estados de Feedback (UX Rules)Micro-interação de Compra: Ao clicar em + Adicionar, o botão deve alternar brevemente para um estado de confirmação (ícone de check verde) e o contador do carrinho (#carrinhoQtdTotal) deve disparar uma animação de escala (scale(1.25) -> scale(1.0)).Atualização Dinâmica de Formas de Pagamento:Selecionar a opção Dinheiro aciona trocoContainer.classList.remove('hidden').Selecionar a opção Pix exibe o box do QR Code/Copia e Cola e esconde o campo de troco.Persistência de Visão (Tabs): O estado da visualização ativa (#visaoCliente ou #visaoCozinha) deve ser alternado via classe .hidden na tag container e sincronizado pelo seletor de topo .mode-navigation.Alerta Visual de Pedido Crítico na Cozinha: Pedidos que ultrapassarem 20 minutos no status [Em Preparo] devem receber classe de pulso sutil no card para alertar a equipe sobre atrasos na entrega.