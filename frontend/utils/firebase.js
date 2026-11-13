import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginvertexlearnai.firebaseapp.com",
  projectId: "loginvertexlearnai",
  storageBucket: "loginvertexlearnai.appspot.com",
  messagingSenderId: "380805556055",
  appId: "1:380805556055:web:77af8cc475c511d09fc012"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Keep the signed-in user in this browser profile.
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase persistence error:", error);
});

const provider = new GoogleAuthProvider();
// In Incognito, Google may ask for credentials because no Google session exists.
// This parameter asks Google to show account selection/sign-in.
provider.setCustomParameters({ prompt: "select_account" });

export { auth, provider };
