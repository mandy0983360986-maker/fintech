import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Helper to safely get env var (Vite uses import.meta.env, but instructions require process.env)
const getEnv = (key: string) => {
  try {
    return typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
  } catch {
    return undefined;
  }
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let initializationError: Error | null = null;

const getFirebaseConfig = () => {
  // Priority 1: GitHub Secrets / Process Environment Variables
  const envConfig = {
    apiKey: getEnv('FIREBASE_API_KEY'),
    authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('FIREBASE_APP_ID')
  };

  if (envConfig.apiKey && envConfig.projectId) {
    console.debug("Firebase using Environment Variables.");
    return envConfig;
  }

  // Priority 2: Local Storage (Fallback for setup/debugging)
  try {
    const localConfig = localStorage.getItem('firebase_config');
    if (localConfig) {
      console.debug("Firebase using Local Storage Config.");
      return JSON.parse(localConfig);
    }
  } catch (e) {
    console.warn("Local config parse failed", e);
  }

  return null;
};

try {
  const config = getFirebaseConfig();

  if (!config || !config.apiKey) {
    throw new Error("Firebase 配置缺失。請在 GitHub Secrets 設定環境變數，或於登入頁面手動配置。");
  }

  if (getApps().length === 0) {
    app = initializeApp(config);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error: any) {
  initializationError = error instanceof Error ? error : new Error(String(error));
  console.error("Firebase Init Error:", initializationError.message);
}

export { auth, db, initializationError };