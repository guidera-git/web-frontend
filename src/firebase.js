import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup,sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZK1dmOr8A6T1wRZdB2hIsNOGIGnmBqXI",
  authDomain: "guidera-e4e58.firebaseapp.com",
  projectId: "guidera-e4e58",
  storageBucket: "guidera-e4e58.firebasestorage.app",
  messagingSenderId: "558758078608",
  appId: "1:558758078608:web:516f425b64168b7f6c1015",
  measurementId: "G-8BZLM1LJ40"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup,sendPasswordResetEmail };
