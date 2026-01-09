import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmIXlBm6Yr0umZFS0n1s7m1CeIgu4Tp_4",
  authDomain: "portifolio-davi-3b30a.firebaseapp.com",
  projectId: "portifolio-davi-3b30a",
  storageBucket: "portifolio-davi-3b30a.firebasestorage.app",
  messagingSenderId: "528239006796",
  appId: "1:528239006796:web:6eccb93fdb3edb8b2590e9"
};

export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}
