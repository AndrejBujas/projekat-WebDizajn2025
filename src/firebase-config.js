
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
const firebaseConfig = {

  apiKey: "AIzaSyDGluw2PFIST5jrSbYXY-JEqWMmNsO2cb0",

  authDomain: "webdizajn-knjizare.firebaseapp.com",

  databaseURL: "https://webdizajn-knjizare-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "webdizajn-knjizare",

  storageBucket: "webdizajn-knjizare.firebasestorage.app",

  messagingSenderId: "976393224795",

  appId: "1:976393224795:web:1e1d7e77edbef3758db57e"

};



const app = initializeApp(firebaseConfig);

export const db = getDatabase(app); 