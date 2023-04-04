// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeyg9SVffL0E8lfSNhMwZ-16A-V2eXLTk",
  authDomain: "datn-edunote.firebaseapp.com",
  projectId: "datn-edunote",
  storageBucket: "datn-edunote.appspot.com",
  messagingSenderId: "391603101539",
  appId: "1:391603101539:web:4a3865f65f7412e3833d56",
  measurementId: "G-KXLV22SGK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const firestore  = getFirestore(app)

export {auth, firestore};