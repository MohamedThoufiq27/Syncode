
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwA9pl2HuTtMduFSKo2TOGw0nXzAL4Ebo",
  authDomain: "syncode-72b58.firebaseapp.com",
  projectId: "syncode-72b58",
  storageBucket: "syncode-72b58.firebasestorage.app",
  messagingSenderId: "1071011100394",
  appId: "1:1071011100394:web:2cae26cbdce96bdeae8993",
  measurementId: "G-VXXG78BZ63"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

auth.useDeviceLanguage();

export const createUser = async (inputs) => {
    return await createUserWithEmailAndPassword(auth,inputs.email,inputs.password);
}

export const signInUser = async (inputs) => {
    return await signInWithEmailAndPassword(auth,inputs.email,inputs.password);
}

export const signInWithGoogle = async () => {
    return await signInWithPopup(auth,provider);
}

export const signOutUser = async () => {
    return await signOut(auth);
}




