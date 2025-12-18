import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

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
  // 嚴格檢查 API Key 是否存在，避免執行時崩潰
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === '') {
    throw new Error("Missing Firebase API Key. Please configure GitHub Secrets.");
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized in cloud mode.");
} catch (error: any) {
  initializationError = error instanceof Error ? error : new Error(String(error));
  console.warn("Firebase running in offline/demo mode:", initializationError.message);
  
  // 保持為 undefined，UI 層會據此判斷是否顯示警報
  auth = undefined;
  db = undefined;
}

export { auth, db, initializationError };