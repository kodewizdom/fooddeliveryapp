import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBZBuF3kGHKP1My7noj08g4TBS025Z7HOg",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "fullstack-food-app02.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "fullstack-food-app02",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCCKET || "fullstack-food-app02.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSEAGING_ID || "309865229129",
  appId: process.env.REACT_APP_FIREBASE_API_ID || "1:309865229129:web:546b1fa1bfda7a25188898",
};

let app = null;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn("Firebase optional initialization notice:", e.message);
}

export { app };
