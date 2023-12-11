import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6zuZs53Djye_UgpJuAsONahLcY5rFxOo",
  authDomain: "devenv-9016f.firebaseapp.com",
  projectId: "devenv-9016f",
  storageBucket: "devenv-9016f.appspot.com",
  messagingSenderId: "36199640329",
  appId: "1:36199640329:web:f6897c8f030168de4077d8",
  measurementId: "G-VXV8E52SED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
