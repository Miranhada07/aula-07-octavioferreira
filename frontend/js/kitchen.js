/**
 * 👨‍🍳 BurguerSync Ourinhos - KDS (Kitchen Display System) em Tempo Real
 * Listener Reativo com Firebase Cloud Firestore (SDK Web v10)
 */
import { db, collection, updateDoc, doc, onSnapshot, query, orderBy } from "./firebase-config.js";
import { formatarMoeda, showToast } from "./client.js";

const listaPedidos = document.getElementById("listaPedidos");
const totalPedidosAtivosEl = document.getElementById("totalPedidosAtivos");
const cozinhaContadorEl = document.getElementById("cozinhaContador");

// Máquina de Estados dos Pedidos
const PROXIMO_STATUS = {
  "Recebido": "Em Preparo",
  "Em Preparo": "Saiu para Entrega",
  "Saiu para Entrega": "Entregue"
};

// Formatação amigável do tempo decorrido
function calcularTempoDecorrido(timestamp) {
  if (!timestamp) return "Agora mesmo";
  const agora = new Date();
  const dataPedido = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = agora - dataPedido;
  const diffMinutos = Math.floor(diffMs / 60000);

  if (diffMinutos < 1) return "Agora mesmo";
  if (diffMinutos === 1) return "Há 1 min";
  if (diffMinutos < 60) return `Há ${diffMinutos} min`;
  const diffHoras = Math.floor(diffMinutos / 60);
  return `Há ${diffHoras}h ${diffMinutos % 60}m`;
}

// Renderização dos cards de pedidos no KDS
function renderizarPedidos(pedidos) {
  if (!listaPedidos) return;

  if (pedidos.length === 0) {
    listaPedidos.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
        <span style="font-size: 3rem; display: block; margin-bottom: 12px;">👨‍🍳</span>
        <h3 style="color: #FFF; font-family: 'Space Grotesk', sans-serif;">Nenhum pedido na esteira no momento</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 6px;">Os pedidos enviados pela tela de Autosserviço aparecerão aqui em tempo real via Firestore.</p>
      </div>
    `;
    if (totalPedidosAtivosEl) totalPedidosAtivosEl.textContent = "0";
    if (cozinhaContadorEl) cozinhaContadorEl.textContent = "0";
    return;
  }

  // Filtrar pedidos ativos (que não foram entregues há muito tempo)
  const ativos = pedidos.filter(p => p.status !== "Entregue");
  if (totalPedidosAtivosEl) totalPedidosAtivosEl.textContent = ativos.length;
  if (cozinhaContadorEl) cozinhaContadorEl.textContent = ativos.length;

  listaPedidos.innerHTML = "";

  pedidos.forEach(pedido => {
    const card = document.createElement("article");
    const statusClass = pedido.status === "Recebido" 
      ? "status-recebido" 
      : pedido.status === "Em Preparo" 
      ? "status-preparo" 
      : pedido.status === "Saiu para Entrega" 
      ? "status-entrega" 
      : "status-entregue";

    // Checagem de pedido crítico (> 20 min em preparo)
    let isCritico = false;
    if (pedido.status === "Em Preparo" && pedido.horario && pedido.horario.toDate) {
      const minutos = (new Date() - pedido.horario.toDate()) / 60000;
      if (minutos > 20) isCritico = true;
    }

    card.className = `card-pedido-cozinha ${statusClass} ${isCritico ? "pedido-critico" : ""}`;
    card.dataset.pedidoId = pedido.id;

    const codigoCurto = pedido.id ? pedido.id.slice(-5).toUpperCase() : "000";
    const tempoTexto = calcularTempoDecorrido(pedido.horario);
    const badgeClass = pedido.status === "Recebido" ? "badge-warning" : pedido.status === "Em Preparo" ? "badge-warning" : pedido.status === "Saiu para Entrega" ? "badge-info" : "badge-success";

    // Itens HTML
    const itensHtml = (pedido.itens || []).map(item => `
      <div class="pedido-item-row">
        <span class="qty">${item.quantidade}x</span>
        <span class="nome">${item.nome}</span>
      </div>
      ${item.obsItem ? `<div class="obs-destaque">⚠️ <strong>Obs:</strong> ${item.obsItem}</div>` : ""}
    `).join("");

    // Botão de avanço
    const proximo = PROXIMO_STATUS[pedido.status];
    const acaoBotao = proximo 
      ? `<button class="btn-status-flow" data-id="${pedido.id}" data-next="${proximo}">Avançar ➔ ${proximo}</button>`
      : `<button class="btn-status-flow" style="background: rgba(4, 211, 97, 0.15); color: var(--success-primary); border-color: var(--success-primary);" disabled>✓ Concluído & Entregue</button>`;

    card.innerHTML = `
      <div class="pedido-top">
        <div class="pedido-id-time">
          <span class="pedido-codigo">#${codigoCurto}</span>
          <span class="pedido-tempo">${tempoTexto}</span>
        </div>
        <span class="badge-status ${badgeClass}">${pedido.status}</span>
      </div>

      <div class="pedido-cliente">
        <strong>${pedido.cliente ? pedido.cliente.nome : "Cliente"}</strong>
        <span>${pedido.cliente ? pedido.cliente.celular : ""}</span>
        <p class="endereco-entrega">📍 ${pedido.cliente ? `${pedido.cliente.endereco} - ${pedido.cliente.bairro}` : "Balcão"}</p>
        ${pedido.cliente && pedido.cliente.obsEntrega ? `<p style="color: var(--accent-neon); font-size: 0.75rem; margin-top: 4px;">🛵 <strong>Obs Entrega:</strong> ${pedido.cliente.obsEntrega}</p>` : ""}
      </div>

      <div class="pedido-itens-lista">
        ${itensHtml}
      </div>

      <div style="font-size: 0.82rem; color: var(--text-secondary); border-top: 1px dashed var(--border-subtle); padding-top: 8px; display: flex; justify-content: space-between;">
        <span>Pagamento: <strong>${pedido.pagamento ? pedido.pagamento.metodo : "Pix"}</strong></span>
        <span style="color: var(--accent-neon); font-weight: 700;">${pedido.valores ? formatarMoeda(pedido.valores.total) : ""}</span>
      </div>

      <div class="pedido-footer-actions">
        ${acaoBotao}
      </div>
    `;

    // Event listener para avançar status
    const btnFlow = card.querySelector(".btn-status-flow:not(:disabled)");
    if (btnFlow) {
      btnFlow.addEventListener("click", () => {
        const nextStatus = btnFlow.dataset.next;
        const id = btnFlow.dataset.id;
        avancarStatusPedido(id, nextStatus, btnFlow);
      });
    }

    listaPedidos.appendChild(card);
  });
}

// Atualizar status no Firestore
async function avancarStatusPedido(pedidoId, novoStatus, botaoEl) {
  try {
    if (botaoEl) {
      botaoEl.disabled = true;
      botaoEl.textContent = "Atualizando...";
    }

    const docRef = doc(db, "pedidos", pedidoId);
    await updateDoc(docRef, { status: novoStatus });
    showToast(`Pedido atualizado para "${novoStatus}"!`, "👨‍🍳");
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    alert(`Erro ao atualizar pedido: ${error.message}`);
    if (botaoEl) botaoEl.disabled = false;
  }
}

// Inicializar Listener Reativo do KDS
export function initKitchen() {
  const q = query(collection(db, "pedidos"), orderBy("horario", "desc"));

  onSnapshot(q, (snapshot) => {
    const pedidos = [];
    snapshot.forEach(docSnap => {
      pedidos.push({ id: docSnap.id, ...docSnap.data() });
    });
    renderizarPedidos(pedidos);
  }, (error) => {
    console.error("Erro na escuta do Firestore:", error);
    if (listaPedidos) {
      listaPedidos.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--danger-primary);">
          <p>⚠️ Falha de sincronização com o banco em tempo real: ${error.message}</p>
          <small style="color: var(--text-muted)">Verifique sua conexão ou permissões no Firebase Firestore.</small>
        </div>
      `;
    }
  });
}
