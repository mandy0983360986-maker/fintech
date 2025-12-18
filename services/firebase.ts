import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyDZ_TcyOJ6CUyvelMw19bPa6OL70LBhd30".trim(),
  authDomain: "fintec-66135.firebaseapp.com".trim(),
  projectId: "fintec-66135".trim(),
  storageBucket: "fintec-66135.firebasestorage.app".trim(),
  messagingSenderId: "711637382348".trim(),
  appId: "1:711637382348:web:22581526e89e5535837e69".trim(),
  measurementId: "G-180MNRRHBD".trim()
};

let auth: any;
let db: any;
let initializationError: Error | null = null;

try {
  // 初始化 Firebase
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log("Firebase 核心組件載入成功:", app.name);
} catch (error: any) {
  console.error("Firebase 初始化失敗:", error);
  initializationError = error;
}

export { auth, db, initializationError };
export const currentConfig = firebaseConfig;
export const updateFirebaseConfig = () => {};
export const clearFirebaseConfig = () => {};
