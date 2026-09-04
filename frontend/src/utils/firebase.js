import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewos-92408.firebaseapp.com",
  projectId: "interviewos-92408",
  storageBucket: "interviewos-92408.firebasestorage.app",
  messagingSenderId: "886717075334",
  appId: "1:886717075334:web:64b16c88e13b640a7da607",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
