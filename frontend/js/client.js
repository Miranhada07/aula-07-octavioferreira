/**
 * 🍔 BurguerSync Ourinhos - Lógica do Cliente e Autosserviço
 * Integração com Firebase Firestore e Catálogo Dinâmico
 */
import { cardapio, bairrosOurinhos } from "./cardapio.js";
import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

// Estado local do Carrinho
let carrinho = JSON.parse(localStorage.getItem("burguersync_carrinho") || "[]");
let taxaEntregaAtual = 5.00;

// Elementos do DOM
const gridLanches = document.getElementById("gridLanches");
const filterPills = document.querySelectorAll(".filter-pill");
const carrinhoDrawer = document.getElementById("carrinho");
const backdropCarrinho = document.getElementById("backdropCarrinho");
const btnAbrirCarrinho = document.getElementById("btnAbrirCarrinho");
const btnFecharCarrinho = document.getElementById("btnFecharCarrinho");
const listaItensCarrinho = document.getElementById("listaItensCarrinho");
const carrinhoQtdTotal = document.getElementById("carrinhoQtdTotal");
const carrinhoSubtotal = document.getElementById("carrinhoSubtotal");
const taxaEntregaEl = document.getElementById("taxaEntrega");
const carrinhoTotal = document.getElementById("carrinhoTotal");
const formCheckout = document.getElementById("formCheckout");
const selectBairro = document.getElementById("bairroCliente");
const trocoContainer = document.getElementById("trocoContainer");
const pixContainer = document.getElementById("pixContainer");
const paymentRadios = document.querySelectorAll("input[name='tipoPagamento']");
const btnCopiarPix = document.getElementById("btnCopiarPix");
const pixCodigoCopia = document.getElementById("pixCodigoCopia");
const toastEl = document.getElementById("toastNotification");
const comprovanteModal = document.getElementById("comprovanteModal");
const btnFecharComprovante = document.getElementById("btnFecharComprovante");

// Utilitário para formatar moeda em BRL
export function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Exibir Toast animado
export function showToast(mensagem, icon = "✅") {
  if (!toastEl) return;
  toastEl.innerHTML = `<span>${icon}</span> <span>${mensagem}</span>`;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3500);
}

// 1. Renderizar Vitrine de Produtos
function renderizarProdutos(categoria = "todos") {
  if (!gridLanches) return;
  gridLanches.innerHTML = "";

  const produtosFiltrados = categoria === "todos" 
    ? cardapio 
    : cardapio.filter(p => p.categoria === categoria);

  produtosFiltrados.forEach(produto => {
    const card = document.createElement("article");
    card.className = "card-produto";
    card.dataset.id = produto.id;
    card.dataset.categoria = produto.categoria;

    card.innerHTML = `
      <div class="card-imagem-wrap">
        <img src="${produto.imagem}" alt="${produto.nome}" class="card-img" loading="lazy">
        <span class="tag-categoria">${produto.categoriaLabel}</span>
      </div>
      <div class="card-detalhes">
        <h3 class="produto-nome">${produto.nome}</h3>
        <p class="produto-descricao">${produto.descricao}</p>
        <div class="card-footer-action">
          <span class="produto-preco">${formatarMoeda(produto.preco)}</span>
          <button class="btn-adicionar" data-id="${produto.id}">
            + Adicionar
          </button>
        </div>
      </div>
    `;

    const btnAdd = card.querySelector(".btn-adicionar");
    btnAdd.addEventListener("click", () => adicionarAoCarrinho(produto, btnAdd));

    gridLanches.appendChild(card);
  });
}

// 2. Adicionar Item ao Carrinho com Microinteração
function adicionarAoCarrinho(produto, botaoEl) {
  const itemExistente = carrinho.find(item => item.id === produto.id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
      observacao: ""
    });
  }

  // Feedback no botão
  if (botaoEl) {
    const textoOriginal = botaoEl.innerHTML;
    botaoEl.classList.add("added");
    botaoEl.innerHTML = "✓ Adicionado!";
    setTimeout(() => {
      botaoEl.classList.remove("added");
      botaoEl.innerHTML = textoOriginal;
    }, 1200);
  }

  // Animação no badge
  if (carrinhoQtdTotal) {
    carrinhoQtdTotal.classList.add("badge-bounce");
    setTimeout(() => carrinhoQtdTotal.classList.remove("badge-bounce"), 250);
  }

  salvarCarrinho();
  atualizarCarrinhoUI();
  showToast(`${produto.nome} adicionado ao pedido!`, "🍔");
}

// 3. Atualizar e Salvar Carrinho no LocalStorage
function salvarCarrinho() {
  localStorage.setItem("burguersync_carrinho", JSON.stringify(carrinho));
}

function atualizarCarrinhoUI() {
  const qtdTotal = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  if (carrinhoQtdTotal) carrinhoQtdTotal.textContent = qtdTotal;

  if (!listaItensCarrinho) return;

  if (carrinho.length === 0) {
    listaItensCarrinho.innerHTML = `
      <div class="carrinho-vazio">
        <span>🛒</span>
        <p>Seu carrinho está vazio.</p>
        <small style="color: var(--text-muted)">Adicione hambúrgueres ou bebidas deliciosas!</small>
      </div>
    `;
    if (carrinhoSubtotal) carrinhoSubtotal.textContent = formatarMoeda(0);
    if (carrinhoTotal) carrinhoTotal.textContent = formatarMoeda(0);
    return;
  }

  listaItensCarrinho.innerHTML = "";
  let subtotal = 0;

  carrinho.forEach((item, index) => {
    subtotal += item.preco * item.quantidade;

    const itemDiv = document.createElement("div");
    itemDiv.className = "carrinho-item";
    itemDiv.innerHTML = `
      <div class="item-info">
        <h4 class="item-title">${item.nome}</h4>
        <span class="item-preco-unit">${formatarMoeda(item.preco * item.quantidade)}</span>
      </div>
      <input type="text" class="input-observacao" placeholder="Obs: Sem cebola, ponto da carne..." maxlength="120" value="${item.observacao || ""}">
      <div class="item-controles">
        <button class="btn-qty btn-menos" data-index="${index}">-</button>
        <span class="qty-number">${item.quantidade}</span>
        <button class="btn-qty btn-mais" data-index="${index}">+</button>
        <button class="btn-remove" data-index="${index}" title="Excluir item">&times;</button>
      </div>
    `;

    // Bindings de observação
    const inputObs = itemDiv.querySelector(".input-observacao");
    inputObs.addEventListener("input", (e) => {
      carrinho[index].observacao = e.target.value;
      salvarCarrinho();
    });

    // Binds de quantidade
    itemDiv.querySelector(".btn-menos").addEventListener("click", () => alterarQuantidade(index, -1));
    itemDiv.querySelector(".btn-mais").addEventListener("click", () => alterarQuantidade(index, 1));
    itemDiv.querySelector(".btn-remove").addEventListener("click", () => removerItem(index));

    listaItensCarrinho.appendChild(itemDiv);
  });

  const total = subtotal + taxaEntregaAtual;
  if (carrinhoSubtotal) carrinhoSubtotal.textContent = formatarMoeda(subtotal);
  if (taxaEntregaEl) taxaEntregaEl.textContent = formatarMoeda(taxaEntregaAtual);
  if (carrinhoTotal) carrinhoTotal.textContent = formatarMoeda(total);
}

function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }
  salvarCarrinho();
  atualizarCarrinhoUI();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinhoUI();
}

// 4. Controle de Abertura/Fechamento da Gaveta do Carrinho
function abrirCarrinho() {
  if (carrinhoDrawer) carrinhoDrawer.classList.remove("hidden");
  if (backdropCarrinho) backdropCarrinho.classList.remove("hidden");
}

function fecharCarrinho() {
  if (carrinhoDrawer) carrinhoDrawer.classList.add("hidden");
  if (backdropCarrinho) backdropCarrinho.classList.add("hidden");
}

// 5. Popular Bairros de Ourinhos no Formulário
function popularBairros() {
  if (!selectBairro) return;
  selectBairro.innerHTML = `<option value="" disabled selected>Selecione seu bairro em Ourinhos</option>`;
  
  bairrosOurinhos.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.nome;
    opt.dataset.taxa = b.taxa;
    opt.textContent = `${b.nome} (${formatarMoeda(b.taxa)})`;
    selectBairro.appendChild(opt);
  });

  selectBairro.addEventListener("change", (e) => {
    const selected = selectBairro.options[selectBairro.selectedIndex];
    if (selected && selected.dataset.taxa) {
      taxaEntregaAtual = parseFloat(selected.dataset.taxa);
      atualizarCarrinhoUI();
    }
  });
}

// 6. Controle de Formas de Pagamento
function configurarPagamento() {
  paymentRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "dinheiro") {
        if (trocoContainer) trocoContainer.classList.remove("hidden");
        if (pixContainer) pixContainer.classList.add("hidden");
      } else if (radio.value === "pix") {
        if (pixContainer) pixContainer.classList.remove("hidden");
        if (trocoContainer) trocoContainer.classList.add("hidden");
      } else {
        if (trocoContainer) trocoContainer.classList.add("hidden");
        if (pixContainer) pixContainer.classList.add("hidden");
      }
    });
  });

  if (btnCopiarPix && pixCodigoCopia) {
    btnCopiarPix.addEventListener("click", () => {
      navigator.clipboard.writeText(pixCodigoCopia.value).then(() => {
        showToast("Chave Pix copiada com sucesso!", "⚡");
      }).catch(() => {
        pixCodigoCopia.select();
        document.execCommand("copy");
        showToast("Código Pix copiado!", "⚡");
      });
    });
  }
}

// 7. Envio do Pedido para o Firebase Cloud Firestore
async function submeterPedido(e) {
  e.preventDefault();

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio! Adicione pelo menos um item para prosseguir.");
    return;
  }

  const nome = document.getElementById("nomeCliente").value.trim();
  const celular = document.getElementById("telefoneCliente").value.trim();
  const endereco = document.getElementById("enderecoCliente").value.trim();
  const numero = document.getElementById("numeroCasa").value.trim();
  const bairro = selectBairro.value;
  const obsEntrega = document.getElementById("obsEntrega").value.trim();
  const tipoPagamento = document.querySelector("input[name='tipoPagamento']:checked").value;
  const valorTroco = document.getElementById("valorTroco") ? document.getElementById("valorTroco").value.trim() : "";

  if (!nome || !celular || !endereco || !numero || !bairro) {
    alert("Por favor, preencha todos os campos obrigatórios marcados com *.");
    return;
  }

  const subtotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const total = subtotal + taxaEntregaAtual;

  const btnFinalizar = document.getElementById("btnFinalizarPedido");
  if (btnFinalizar) {
    btnFinalizar.disabled = true;
    btnFinalizar.innerHTML = "⏳ Enviando para a Cozinha...";
  }

  // Schema de Pedido conforme SOP /directives/projeto.md
  const pedidoData = {
    cliente: {
      nome,
      celular,
      endereco: `${endereco}, Nº ${numero}`,
      bairro,
      obsEntrega
    },
    itens: carrinho.map(item => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      quantidade: item.quantidade,
      obsItem: item.observacao || ""
    })),
    pagamento: {
      metodo: tipoPagamento === "pix" ? "Pix" : tipoPagamento === "cartao" ? "Cartão na Entrega" : "Dinheiro",
      troco: tipoPagamento === "dinheiro" && valorTroco ? valorTroco : "Não informado / Não necessário"
    },
    valores: {
      subtotal,
      taxaEntrega: taxaEntregaAtual,
      total
    },
    status: "Recebido",
    horario: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, "pedidos"), pedidoData);
    
    // Sucesso no envio
    exibirComprovante(docRef.id, pedidoData);

    // Limpar estado
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinhoUI();
    formCheckout.reset();
    fecharCarrinho();
    showToast("Pedido recebido pela Cozinha!", "🚀");
  } catch (error) {
    console.error("Erro ao enviar pedido para o Firestore:", error);
    alert(`Erro ao registrar o pedido: ${error.message}. Tente novamente.`);
  } finally {
    if (btnFinalizar) {
      btnFinalizar.disabled = false;
      btnFinalizar.innerHTML = "🚀 Finalizar e Enviar para a Cozinha";
    }
  }
}

// 8. Exibição do Modal de Comprovante
function exibirComprovante(pedidoId, dados) {
  if (!comprovanteModal) return;
  const codigoCurto = pedidoId.slice(-6).toUpperCase();
  const corpoComprovante = document.getElementById("comprovanteConteudo");

  if (corpoComprovante) {
    corpoComprovante.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="font-size: 0.75rem; color: var(--text-secondary);">CÓDIGO DO PEDIDO</span>
        <h2 style="font-family: 'Space Grotesk', sans-serif; color: var(--accent-neon); font-size: 1.8rem;">#${codigoCurto}</h2>
      </div>
      <div class="comprovante-detalhes">
        <p><strong>Cliente:</strong> ${dados.cliente.nome}</p>
        <p><strong>Destino:</strong> ${dados.cliente.endereco} - ${dados.cliente.bairro}</p>
        <p><strong>Pagamento:</strong> ${dados.pagamento.metodo}</p>
        <p><strong>Total com Entrega:</strong> ${formatarMoeda(dados.valores.total)}</p>
        <div style="border-top: 1px dashed var(--border-subtle); padding-top: 8px; margin-top: 4px;">
          <p style="color: var(--accent-neon); font-weight: 700;">Status Inicial: Recebido</p>
          <small style="color: var(--text-muted);">Você pode acompanhar o progresso deste pedido diretamente na aba 👨‍🍳 Cozinha.</small>
        </div>
      </div>
    `;
  }

  comprovanteModal.classList.remove("hidden");
}

// Inicialização dos Event Listeners do Cliente
export function initClient() {
  renderizarProdutos("todos");
  popularBairros();
  configurarPagamento();
  atualizarCarrinhoUI();

  // Filtros de Categoria
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderizarProdutos(pill.dataset.cat);
    });
  });

  // Gatilhos do Carrinho
  if (btnAbrirCarrinho) btnAbrirCarrinho.addEventListener("click", abrirCarrinho);
  if (btnFecharCarrinho) btnFecharCarrinho.addEventListener("click", fecharCarrinho);
  if (backdropCarrinho) backdropCarrinho.addEventListener("click", fecharCarrinho);
  if (formCheckout) formCheckout.addEventListener("submit", submeterPedido);

  if (btnFecharComprovante && comprovanteModal) {
    btnFecharComprovante.addEventListener("click", () => {
      comprovanteModal.classList.add("hidden");
    });
  }
}
