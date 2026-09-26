/**
 * 🛠️ Execution Script: População de Pedidos Iniciais (Seed)
 * Layer 3 - Execução Determinística
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpDn_L5QSTERoSVmu0Z8kfUaYEMOxAovA",
  authDomain: "burguer-sync.firebaseapp.com",
  projectId: "burguer-sync",
  storageBucket: "burguer-sync.firebasestorage.app",
  messagingSenderId: "113021307879",
  appId: "1:113021307879:web:e3bdd920b02f74e2bb0b42",
  measurementId: "G-C1EZY82REE"
};

const pedidosIniciais = [
  {
    cliente: {
      nome: "Lucas Andrade",
      celular: "(14) 99821-4433",
      endereco: "Rua Expedicionários, Nº 742",
      bairro: "Centro",
      obsEntrega: "Portão cinza, interfone 12"
    },
    itens: [
      {
        id: 1,
        nome: "Ourinhos Smash Burguer",
        preco: 28.00,
        quantidade: 2,
        obsItem: "Um dos lanches sem cebola, por favor"
      },
      {
        id: 4,
        nome: "Batata Rústica Suprema",
        preco: 19.00,
        quantidade: 1,
        obsItem: "Cheddar bem quente"
      }
    ],
    pagamento: {
      metodo: "Pix",
      troco: "Não necessário"
    },
    valores: {
      subtotal: 75.00,
      taxaEntrega: 5.00,
      total: 80.00
    },
    status: "Em Preparo",
    horario: new Date(Date.now() - 12 * 60 * 1000) // 12 minutos atrás
  },
  {
    cliente: {
      nome: "Camila Guimarães",
      celular: "(14) 99762-1100",
      endereco: "Rua Duque de Caxias, Nº 1050",
      bairro: "Vila Nova Christoni",
      obsEntrega: "Casa de esquina com cerca de madeira"
    },
    itens: [
      {
        id: 2,
        nome: "Monster Bacon SENAI",
        preco: 34.00,
        quantidade: 1,
        obsItem: "Ponto da carne: Ao ponto para bem passado"
      },
      {
        id: 5,
        nome: "Coca-Cola Gelada (Lata 350ml)",
        preco: 7.00,
        quantidade: 1,
        obsItem: ""
      }
    ],
    pagamento: {
      metodo: "Cartão na Entrega",
      troco: "Não necessário"
    },
    valores: {
      subtotal: 41.00,
      taxaEntrega: 5.00,
      total: 46.00
    },
    status: "Recebido",
    horario: new Date(Date.now() - 3 * 60 * 1000) // 3 minutos atrás
  },
  {
    cliente: {
      nome: "Renato Silveira",
      celular: "(14) 99134-8899",
      endereco: "Av. Altino Arantes, Nº 430",
      bairro: "Jardim Matilde",
      obsEntrega: "Deixar na portaria do condomínio"
    },
    itens: [
      {
        id: 3,
        nome: "Duplo Cheddar Melt",
        preco: 31.00,
        quantidade: 1,
        obsItem: "Extra cheddar"
      },
      {
        id: 6,
        nome: "Milkshake Ninho com Nutella",
        preco: 18.00,
        quantidade: 1,
        obsItem: ""
      }
    ],
    pagamento: {
      metodo: "Dinheiro",
      troco: "Troco para R$ 100,00"
    },
    valores: {
      subtotal: 49.00,
      taxaEntrega: 6.00,
      total: 55.00
    },
    status: "Saiu para Entrega",
    horario: new Date(Date.now() - 25 * 60 * 1000) // 25 minutos atrás
  }
];

async function seed() {
  console.log("🌱 Populando Firestore com pedidos iniciais de demonstração...");
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Verificar se já existem pedidos na coleção
    const existing = await getDocs(collection(db, "pedidos"));
    if (existing.size > 0) {
      console.log(`ℹ️ Coleção 'pedidos' já possui ${existing.size} documentos. Adicionando sementes para complementar...`);
    }

    for (const pedido of pedidosIniciais) {
      const docRef = await addDoc(collection(db, "pedidos"), pedido);
      console.log(`✅ Pedido inserido: #${docRef.id.slice(-5).toUpperCase()} (${pedido.cliente.nome}) - Status: ${pedido.status}`);
    }

    console.log("\n🎉 Seed de pedidos concluído com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Falha no seed:", error);
    process.exit(1);
  }
}

seed();
