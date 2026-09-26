/**
 * 🍔 BurguerSync Ourinhos - Aplicação Principal SPA
 * Coordenação entre as Visões do Cliente, Rotas de Entrega e Cozinha KDS
 */
import { initClient } from "./client.js";
import { initKitchen } from "./kitchen.js";
import { initRoutes } from "./routes.js";

// Botões de Navegação
const btnModoCliente = document.getElementById("btnModoCliente");
const btnModoRotas = document.getElementById("btnModoRotas");
const btnModoCozinha = document.getElementById("btnModoCozinha");
const btnBannerRotas = document.getElementById("btnBannerRotas");
const brandHomeBtn = document.getElementById("brandHomeBtn");

// Telas / Seções
const visaoCliente = document.getElementById("visaoCliente");
const visaoRotas = document.getElementById("visaoRotas");
const visaoCozinha = document.getElementById("visaoCozinha");

function alternarAba(abaDestino) {
  // Reset active classes
  [btnModoCliente, btnModoRotas, btnModoCozinha].forEach(btn => {
    if (btn) btn.classList.remove("active");
  });

  // Ocultar todas as seções
  [visaoCliente, visaoRotas, visaoCozinha].forEach(visao => {
    if (visao) visao.classList.add("hidden");
  });

  if (abaDestino === "cliente") {
    if (btnModoCliente) btnModoCliente.classList.add("active");
    if (visaoCliente) visaoCliente.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (abaDestino === "rotas") {
    if (btnModoRotas) btnModoRotas.classList.add("active");
    if (visaoRotas) visaoRotas.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (abaDestino === "cozinha") {
    if (btnModoCozinha) btnModoCozinha.classList.add("active");
    if (visaoCozinha) visaoCozinha.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicialização dos módulos
  initClient();
  initKitchen();
  initRoutes();

  // Binds de navegação
  if (btnModoCliente) btnModoCliente.addEventListener("click", () => alternarAba("cliente"));
  if (btnModoRotas) btnModoRotas.addEventListener("click", () => alternarAba("rotas"));
  if (btnModoCozinha) btnModoCozinha.addEventListener("click", () => alternarAba("cozinha"));
  if (btnBannerRotas) btnBannerRotas.addEventListener("click", () => alternarAba("rotas"));
  if (brandHomeBtn) brandHomeBtn.addEventListener("click", () => alternarAba("cliente"));

  console.log("⚡ BurguerSync Ourinhos iniciado com sucesso no Google Antigravity!");
});
