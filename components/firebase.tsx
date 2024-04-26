// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBEfFZXLyFEU03O2y2TpH3lCxJP_PkoQ8U",
  authDomain: "hackathon-team20.firebaseapp.com",
  projectId: "hackathon-team20",
  storageBucket: "hackathon-team20.appspot.com",
  messagingSenderId: "244364540788",
  appId: "1:244364540788:web:ca228b46917d0d386c8a21",
  measurementId: "G-Y89DL9BK52",
  databaseURL: "https://hackathon-team20-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};
