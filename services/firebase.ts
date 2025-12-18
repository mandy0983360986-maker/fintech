import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// 由 Vite 在建置時靜態替換
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let initializationError: Error | null = null;

try {
  const key = firebaseConfig.apiKey;
  
  // 嚴格檢查環境變數是否成功注入且非佔位符
  if (!key || key.trim() === '' || key === 'undefined' || key.includes('YOUR_')) {
    const errorMsg = "FIREBASE_API_KEY 未正確設定。這通常是因為 index.html 中的 importmap 干擾了 Vite 的編譯流程，或是 GitHub Secrets 尚未設定。請確保 Secrets 已加入並重新執行 Action。";
    throw new Error(errorMsg);
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase 服務初始化成功。");
} catch (error: any) {
  initializationError = error instanceof Error ? error : new Error(String(error));
  console.error("Firebase 初始化失敗:", initializationError.message);
  
  auth = undefined;
  db = undefined;
}

export { auth, db, initializationError };