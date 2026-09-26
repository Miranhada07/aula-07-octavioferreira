/**
 * 🛠️ Execution Script: Automação Git, Criação de Repositório Remoto e Deploy
 * Layer 3 - Execução Determinística
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Ler Token do .env
function getGithubToken() {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error("Arquivo .env não encontrado na raiz!");
  }

  const content = fs.readFileSync(envPath, "utf-8");
  const match = content.match(/GITHUB_PERSONAL_KEY\s*=\s*(.+)/);
  if (!match) {
    throw new Error("GITHUB_PERSONAL_KEY não encontrada no .env!");
  }
  return match[1].trim();
}

async function runDeploy() {
  const token = getGithubToken();
  const repoName = "aula-07-octavioferreira";
  const user = "Miranhada07";

  console.log(`🚀 Iniciando automação de publicação para ${user}/${repoName}...`);

  // 2. Verificar se repositório já existe no GitHub
  console.log("🔍 Verificando repositório no GitHub via API REST...");
  let repoExists = false;
  try {
    const checkRes = await fetch(`https://api.github.com/repos/${user}/${repoName}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "Antigravity-Agent",
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (checkRes.status === 200) {
      repoExists = true;
      console.log(`✅ Repositório ${user}/${repoName} já existe no GitHub.`);
    } else if (checkRes.status === 404) {
      console.log(`ℹ️ Repositório ${repoName} ainda não existe. Criando agora...`);
    } else {
      console.log(`⚠️ Resposta da checagem: Status ${checkRes.status}`);
    }
  } catch (err) {
    console.error("Erro na verificação do repositório:", err.message);
  }

  // 3. Criar se não existir
  if (!repoExists) {
    try {
      const createRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": "Antigravity-Agent",
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: repoName,
          description: "🍔 BurguerSync Ourinhos - Sistema Full-Stack de Delivery e KDS em Tempo Real desenvolvido com Google Antigravity e Firebase",
          private: false,
          has_issues: true,
          has_projects: true,
          has_wiki: true
        })
      });

      if (createRes.ok) {
        console.log(`🎉 Repositório público ${user}/${repoName} criado com sucesso no GitHub!`);
      } else {
        const errorData = await createRes.json();
        console.warn(`Aviso ao criar repositório: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error("Erro ao criar repositório:", err.message);
    }
  }

  // 4. Executar Git local
  console.log("📦 Configurando Git local e preparando commit...");
  try {
    // Configurar git ignore se não existir
    const gitignorePath = path.join(rootDir, ".gitignore");
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, "node_modules/\n.tmp/\n.temp_ag_kit/\n.env\n", "utf-8");
    }

    // Comandos git
    execSync("git init -b main", { cwd: rootDir, stdio: "inherit" });
    execSync(`git config user.name "Octavio Ferreira"`, { cwd: rootDir, stdio: "inherit" });
    execSync(`git config user.email "octavioferreira@users.noreply.github.com"`, { cwd: rootDir, stdio: "inherit" });
    
    // Remote
    const remoteUrl = `https://${token}@github.com/${user}/${repoName}.git`;
    try {
      execSync(`git remote remove origin`, { cwd: rootDir, stdio: "ignore" });
    } catch (_) {}
    execSync(`git remote add origin ${remoteUrl}`, { cwd: rootDir, stdio: "inherit" });

    execSync("git add .", { cwd: rootDir, stdio: "inherit" });
    
    try {
      execSync(`git commit -m "feat: implementacao completa BurguerSync Ourinhos (Antigravity + Firebase + Stitch)"`, { cwd: rootDir, stdio: "inherit" });
    } catch (e) {
      console.log("ℹ️ Nada a commitar ou commit já realizado.");
    }

    console.log("📤 Enviando commits para o GitHub (main branch)...");
    execSync("git push -u origin main --force", { cwd: rootDir, stdio: "inherit" });
    console.log("✅ Push realizado com sucesso!");

    // 5. Ativar GitHub Pages
    console.log("🌐 Configurando GitHub Pages na branch main...");
    try {
      const pagesRes = await fetch(`https://api.github.com/repos/${user}/${repoName}/pages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": "Antigravity-Agent",
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source: {
            branch: "main",
            path: "/"
          }
        })
      });

      if (pagesRes.ok) {
        console.log(`🎉 GitHub Pages ativado com sucesso! Acesse em: https://${user}.github.io/${repoName}/`);
      } else {
        const pagesData = await pagesRes.json();
        console.log(`ℹ️ Status do GitHub Pages: ${pagesData.message || "Já configurado ou em processamento."}`);
      }
    } catch (err) {
      console.warn("Nota sobre GitHub Pages:", err.message);
    }

    console.log(`\n🎉 Publicação finalizada com sucesso!`);
    console.log(`🔗 Repositório: https://github.com/${user}/${repoName}`);
    console.log(`🌐 Live Demo (Pages): https://${user}.github.io/${repoName}/`);
  } catch (err) {
    console.error("❌ Falha na automação do Git:", err.message);
    process.exit(1);
  }
}

runDeploy();
