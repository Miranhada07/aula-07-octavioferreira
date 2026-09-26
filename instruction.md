# 📖 Guia de Operação e Instruções - BurguerSync Ourinhos

Este documento detalha o procedimento para configuração de ambiente, execução local determinística, arquitetura de persistência e processo de publicação.

---

## 🛠️ 1. Pré-Requisitos do Sistema

- **Node.js**: Versão 18.x ou superior (testado e validado no Node v24.x).
- **Navegador Moderno**: Google Chrome, Microsoft Edge ou Mozilla Firefox com suporte a módulos ES6.
- **Git**: Configurado localmente.

---

## 🔐 2. Configuração de Variáveis de Ambiente (`.env`)

O projeto utiliza um arquivo `.env` na raiz para centralizar credenciais e chaves de acesso.

```env
# Chave de Acesso Pessoal ao GitHub (com permissão de repositórios e Pages)
GITHUB_PERSONAL_KEY=ghp_...

# Credenciais do Projeto Firebase Cloud Firestore
FIREBASE_apiKey="AIzaSyBpDn_L5QSTERoSVmu0Z8kfUaYEMOxAovA"
FIREBASE_authDomain="burguer-sync.firebaseapp.com"
FIREBASE_projectId="burguer-sync"
FIREBASE_storageBucket="burguer-sync.firebasestorage.app"
FIREBASE_messagingSenderId="113021307879"
FIREBASE_appId="1:113021307879:web:e3bdd920b02f74e2bb0b42"
FIREBASE_measurementId="G-C1EZY82REE"
```

---

## 🚀 3. Execução Local

### Método Rápido (Windows):
Dê um duplo clique no script batch:
```cmd
executar.bat
```

### Método via Terminal:
```bash
node execution/server.mjs
```
O servidor estará disponível em: **`http://localhost:3000`** ou diretamente no frontend **`http://localhost:3000/frontend/index.html`**.

---

## 🧪 4. Validação Determinística & Seeds (Layer 3)

### Validar Conexão com Firestore:
```bash
node execution/test-firestore.mjs
```

### Popular Pedidos de Teste no KDS:
```bash
node execution/seed-firebase.mjs
```

---

## 🌐 5. Publicação no GitHub & GitHub Pages

Para publicar as alterações e atualizar o repositório remoto:
```bash
node execution/deploy-github.mjs
```
Ou via comandos Git tradicionais:
```bash
git add .
git commit -m "feat: implementacao completa BurguerSync Ourinhos"
git push origin main
```
