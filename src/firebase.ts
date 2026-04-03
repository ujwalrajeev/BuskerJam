import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxSivRfNgaBb-SwCRaHBx8RHDmCjDGRaA",
  authDomain: "buskerjam-project.firebaseapp.com",
  projectId: "buskerjam-project",
  storageBucket: "buskerjam-project.firebasestorage.app",
  messagingSenderId: "76903159949",
  appId: "1:76903159949:web:f9ef75cb33f4927c08eac4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);