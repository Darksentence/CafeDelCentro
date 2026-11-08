import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "missing-firebase-api-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "missing-firebase-auth-domain",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "missing-firebase-project-id",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "missing-firebase-storage-bucket",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "missing-firebase-messaging-sender-id",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "missing-firebase-app-id"
};

export const firebaseConfigCompleta = Object.values(firebaseConfig).every(
    (value) => !value.startsWith("missing-")
);

export const firebaseApp = getApps()[0] || initializeApp(firebaseConfig);
const isBrowser = typeof window !== "undefined";

export const auth = isBrowser ? getAuth(firebaseApp) : null;
export const db = isBrowser ? getFirestore(firebaseApp) : null;
