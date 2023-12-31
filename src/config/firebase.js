// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "manadopost-f4a67.firebaseapp.com",
  databaseURL: "https://manadopost-f4a67.firebaseio.com",
  projectId: "manadopost-f4a67",
  storageBucket: "manadopost-f4a67.appspot.com",
  messagingSenderId: "782626479856",
  appId: "1:782626479856:web:e38b84e24ab7aad37fec35",
  measurementId: "G-00DGQB5Q8N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
