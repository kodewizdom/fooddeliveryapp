import {getApp, getApps, initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
// import { FirebaseApp } from "firebase/app";
// import firebase from 'firebase/app';
// import 'firebase/firestore';




const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // spelling of bucket and messaging is wrong
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSEAGING_ID,
    appId: process.env.REACT_APP_FIREBASE_API_ID,
  };


  const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

  const storage = getStorage(app);

  // var db =firebaseConfig.REACT_APP_FIREBASE_STORAGE_BUCCKET();
  // var db =getStorage(app);
  // const db = firebaseConfig.firestore();

  export {app, storage};


