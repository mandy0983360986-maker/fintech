import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * ============================================================
 * ⚠ 重要提示：請將下方的配置替換為您 Firebase 專案的真實資料 ⚠
 * 前往 Firebase Console > 專案設定 > 一般 > 您的應用程式 即可找到
 * ============================================================
 */
const firebaseConfig = {
  apiKey: "AIzaSyDZ_TcyOJ6CUyvelMw19bPa6OL70LBhd30",
  authDomain: "fintec-66135.firebaseapp.com",
  projectId: "fintec-66135",
  storageBucket: "fintec-66135.firebasestorage.app",
  messagingSenderId: "711637382348",
  appId: "1:711637382348:web:22581526e89e5535837e69",
  measurementId: "G-180MNRRHBD"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let initializationError: Error | null = null;

try {
  // 檢查是否仍在使用佔位符
  if (firebaseConfig.apiKey.includes("在此處貼上")) {
    throw new Error("請先在 services/firebase.ts 中填寫正確的 Firebase API Key。");
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase 服務已成功載入硬編碼配置。");
} catch (error: any) {
  initializationError = error instanceof Error ? error : new Error(String(error));
  console.error("Firebase 初始化失敗:", initializationError.message);
}

// 保持與 DataContext 相容的導出
export { auth, db, initializationError };
export const currentConfig = firebaseConfig;

// 保持與舊代碼相容的空函式
export const updateFirebaseConfig = () => {};
export const clearFirebaseConfig = () => {};
