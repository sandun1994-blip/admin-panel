
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket:  process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId:  process.env.NEXT_PUBLIC_messagingSenderId, 
  appId:  process.env.NEXT_PUBLIC_appId,
  measurementId:  process.env.NEXT_PUBLIC_measurementId
};

// Initialize Firebase
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();  

// if ( !getApps().length) {
//     const app =initializeApp(firebaseConfig)
// }else{
//     const app =getApp();
// }


 const db = getFirestore(app)

const auth=getAuth(app)

const storage =getStorage(app)

export {app,auth,db,storage}
