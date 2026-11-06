// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginvertexlearnai.firebaseapp.com",
  projectId: "loginvertexlearnai",
  storageBucket: "loginvertexlearnai.appspot.com",
  messagingSenderId: "380805556055",
  appId: "1:380805556055:web:77af8cc475c511d09fc012"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
const auth = getAuth(app);

// Google Provider
const provider = new GoogleAuthProvider();

export { auth, provider };