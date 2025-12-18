import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// 這些變數由 Vite 在建置時透過 define 功能進行靜態替換
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
  
  // 嚴格校驗：如果 Key 缺失或為字串 "undefined"，代表 Vite 環境變數注入失敗
  if (!key || key.trim() === '' || key === 'undefined' || key.includes('YOUR_')) {
    throw new Error(
      "Firebase 配置無效：FIREBASE_API_KEY 未設定。請確保 GitHub Secrets (Settings > Secrets > Actions) 已正確加入對應變數並重新建置。"
    );
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase 核心服務已啟動。");
} catch (error: any) {
  initializationError = error instanceof Error ? error : new Error(String(error));
  console.error("Firebase 初始化失敗偵測:", initializationError.message);
  
  // 確保即使失敗，後續代碼也不會因為呼叫 undefined 的方法而崩潰
  auth = undefined;
  db = undefined;
}

export { auth, db, initializationError };