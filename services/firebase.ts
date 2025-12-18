import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// 這些變數由 Vite 的 define 功能在建置時注入
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let initializationError: Error | null = null;

try {
  // 檢查 API Key 是否為無效的佔位符或空字串
  const key = firebaseConfig.apiKey;
  if (!key || key === '' || key === 'undefined' || key.includes('YOUR_')) {
    throw new Error("Firebase API Key 無效或未設定。請確保您已在 GitHub Secrets 或環境變數中設定 FIREBASE_API_KEY。");
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase 雲端模式初始化成功。");
} catch (error: any) {
  initializationError = error instanceof Error ? error : new Error(String(error));
  console.error("Firebase 初始化失敗:", initializationError.message);
  
  auth = undefined;
  db = undefined;
}

export { auth, db, initializationError };