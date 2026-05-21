import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

declare const process: { env: Record<string, string | undefined> } | undefined;

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const readEnv = (key: string) => viteEnv?.[key] ?? (typeof process !== 'undefined' ? process.env[key] : undefined);

export const activityFirebaseConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('VITE_FIREBASE_APP_ID'),
};

export const identityFirebaseConfig = {
  apiKey: readEnv('VITE_IDENTITY_FIREBASE_API_KEY') ?? readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_IDENTITY_FIREBASE_AUTH_DOMAIN') ?? readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_IDENTITY_FIREBASE_PROJECT_ID') ?? readEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('VITE_IDENTITY_FIREBASE_STORAGE_BUCKET') ?? readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('VITE_IDENTITY_FIREBASE_MESSAGING_SENDER_ID') ?? readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('VITE_IDENTITY_FIREBASE_APP_ID') ?? readEnv('VITE_FIREBASE_APP_ID'),
};

function getOrInitializeApp(config: typeof activityFirebaseConfig, name?: string): FirebaseApp {
  if (!name) return getApps().length ? getApp() : initializeApp(config);
  return getApps().some((item) => item.name === name) ? getApp(name) : initializeApp(config, name);
}

export const identityApp: FirebaseApp = getOrInitializeApp(identityFirebaseConfig);
export const activityApp: FirebaseApp = getOrInitializeApp(activityFirebaseConfig, 'activity');

export const identityAuth = getAuth(identityApp);
export const identityDb = getFirestore(identityApp);
export const activityAuth = getAuth(activityApp);
export const activityDb = getFirestore(activityApp);

export const app = activityApp;
export const auth = identityAuth;
export const db = activityDb;
