/**
 * 🍔 BurguerSync Ourinhos - Configuração Modular do Firebase v10
 * SDK Web Modular via CDN para execução sem bundler obrigatório
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpDn_L5QSTERoSVmu0Z8kfUaYEMOxAovA",
  authDomain: "burguer-sync.firebaseapp.com",
  projectId: "burguer-sync",
  storageBucket: "burguer-sync.firebasestorage.app",
  messagingSenderId: "113021307879",
  appId: "1:113021307879:web:e3bdd920b02f74e2bb0b42",
  measurementId: "G-C1EZY82REE"
};

// Inicialização da aplicação Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { 
  app, 
  db, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy,
  getDocs
};
