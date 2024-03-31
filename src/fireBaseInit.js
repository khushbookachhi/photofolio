// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc2EF763WHZogNCTCwybT-hHDdKmOU9dc",
  authDomain: "photofolio-95f2a.firebaseapp.com",
  projectId: "photofolio-95f2a",
  storageBucket: "photofolio-95f2a.appspot.com",
  messagingSenderId: "133883967568",
  appId: "1:133883967568:web:d47e707f60d25044fe7955"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);