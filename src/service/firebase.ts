import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJbfw3cvymY3r-MulCHUcPSxR4qxgtOhM",
  authDomain: "tarefas1404.firebaseapp.com",
  projectId: "tarefas1404",
  storageBucket: "tarefas1404.firebasestorage.app",
  messagingSenderId: "245289226990",
  appId: "1:245289226990:web:420af9e981c7beb53419ff"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
