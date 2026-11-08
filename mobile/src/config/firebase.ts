import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "missing-firebase-api-key",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "missing-firebase-auth-domain",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "missing-firebase-project-id",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "missing-firebase-storage-bucket",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "missing-firebase-messaging-sender-id",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "missing-firebase-app-id",
};

export const firebaseConfigCompleta = Object.values(firebaseConfig).every(
  (value) => !value.startsWith("missing-")
);

export const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);

function createAsyncStoragePersistence() {
  return class AsyncStoragePersistence {
    static type = "LOCAL";
    type = "LOCAL";

    async _isAvailable() {
      try {
        await AsyncStorage.setItem("cafe-del-centro:storage-test", "1");
        await AsyncStorage.removeItem("cafe-del-centro:storage-test");
        return true;
      } catch {
        return false;
      }
    }
    _set(key: string, value: unknown) {
      return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    async _get(key: string) {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }

    _remove(key: string) {
      return AsyncStorage.removeItem(key);
    }

    _addListener() {}
    _removeListener() {}
  };
}

export const auth: Auth = (() => {
  try {
    return initializeAuth(firebaseApp, {
      persistence: createAsyncStoragePersistence() as never,
    });
  } catch {
    return getAuth(firebaseApp);
  }
})();

export const db = getFirestore(firebaseApp);
