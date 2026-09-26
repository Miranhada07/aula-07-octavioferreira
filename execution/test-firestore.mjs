/**
 * 🛠️ Execution Script: Teste de Conexão e Validação do Firestore
 * Layer 3 - Execução Determinística
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpDn_L5QSTERoSVmu0Z8kfUaYEMOxAovA",
  authDomain: "burguer-sync.firebaseapp.com",
  projectId: "burguer-sync",
  storageBucket: "burguer-sync.firebasestorage.app",
  messagingSenderId: "113021307879",
  appId: "1:113021307879:web:e3bdd920b02f74e2bb0b42",
  measurementId: "G-C1EZY82REE"
};

async function testConnection() {
  console.log("🔍 Conectando ao Firebase Firestore com projectId:", firebaseConfig.projectId);
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("📝 Tentando escrever um documento de teste na coleção '__healthcheck'...");
    const testDoc = await addDoc(collection(db, "__healthcheck"), {
      status: "online",
      timestamp: serverTimestamp(),
      agent: "Google Antigravity Orquestrador"
    });
    console.log("✅ Escrita realizada com sucesso! ID do documento:", testDoc.id);

    console.log("📖 Lendo documentos da coleção '__healthcheck'...");
    const snapshot = await getDocs(collection(db, "__healthcheck"));
    console.log(`✅ Leitura realizada com sucesso! Total de documentos encontrados: ${snapshot.size}`);

    // Limpeza
    await deleteDoc(doc(db, "__healthcheck", testDoc.id));
    console.log("🧹 Documento de teste removido com sucesso.");

    console.log("\n🎉 Conexão e regras do Firestore validadas com 100% de sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Falha na conexão com o Firestore:", error);
    process.exit(1);
  }
}

testConnection();
