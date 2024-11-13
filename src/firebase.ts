// frontend/src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAI_eds4kEOB1SDOovNJW7AbBek2N4OUIk",
    authDomain: "jamoveo-8ae65.firebaseapp.com",
    projectId: "jamoveo-8ae65",
    storageBucket: "jamoveo-8ae65.firebasestorage.app",
    messagingSenderId: "336904601000",
    appId: "1:336904601000:web:715c621e0e8498225e719d",
    measurementId: "G-2VS6ZF06X6"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
