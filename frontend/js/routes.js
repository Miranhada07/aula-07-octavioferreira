/**
 * 🗺️ BurguerSync Ourinhos - Gerenciamento de Rotas e Bairros
 * Exibição das zonas de entrega e cálculo estimado de tempo
 */
import { bairrosOurinhos } from "./cardapio.js";
import { formatarMoeda } from "./client.js";

const bairrosListaContainer = document.getElementById("bairrosListaContainer");

export function initRoutes() {
  if (!bairrosListaContainer) return;

  bairrosListaContainer.innerHTML = "";

  bairrosOurinhos.forEach(bairro => {
    const item = document.createElement("div");
    item.className = "bairro-item";
    item.innerHTML = `
      <div>
        <strong style="color: #FFF; display: block;">📍 ${bairro.nome}</strong>
        <small style="color: var(--text-secondary);">Tempo estimado: ${bairro.tempoEstimado}</small>
      </div>
      <div style="text-align: right;">
        <span class="bairro-taxa">${formatarMoeda(bairro.taxa)}</span>
        <small style="display: block; color: var(--success-primary); font-size: 0.7rem;">Entrega Ativa</small>
      </div>
    `;
    bairrosListaContainer.appendChild(item);
  });
}
