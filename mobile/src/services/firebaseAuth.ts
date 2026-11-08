import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, firebaseConfigCompleta } from "@/config/firebase";
import { ensureUserProfile } from "@/services/firestore";

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string) {
  return password.length >= 6;
}

function assertFirebaseConfiguration() {
  if (!firebaseConfigCompleta) {
    throw new Error(
      "Falta configurar Firebase. Copia mobile/.env.example a mobile/.env.local y completa los valores de Firebase."
    );
  }
}

export function mensajeAuth(error: unknown) {
  if (!(error instanceof Error)) {
    return "No pudimos completar la autenticación. Inténtalo otra vez.";
  }

  const code = (error as Error & { code?: string }).code;
  const messages: Record<string, string> = {
    "auth/invalid-email": "Escribe un correo electrónico válido.",
    "auth/missing-password": "Escribe tu contraseña.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "El correo o la contraseña no son correctos.",
    "auth/user-not-found": "El correo o la contraseña no son correctos.",
    "auth/wrong-password": "El correo o la contraseña no son correctos.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
    "auth/network-request-failed":
      "No hay conexión. Revisa internet e inténtalo de nuevo.",
    "auth/popup-closed-by-user": "Cerraste la ventana de Google.",
    "auth/cancelled-popup-request": "La autenticación fue cancelada.",
    "auth/operation-not-allowed":
      "Este método de acceso aún no está habilitado en Firebase.",
    "permission-denied":
      "Firebase rechazó la operación. Revisa que Authentication y las reglas de Firestore estén configuradas.",
  };

  return (code && messages[code]) || error.message;
}

export async function iniciarSesionConEmail(email: string, password: string) {
  assertFirebaseConfiguration();
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );
  await ensureUserProfile(credential.user);
  return credential.user;
}

export async function registrarConEmail(
  nombre: string,
  email: string,
  password: string
) {
  assertFirebaseConfiguration();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );
  await updateProfile(credential.user, { displayName: nombre.trim() });
  await ensureUserProfile(credential.user, nombre.trim());
  return credential.user;
}

export async function iniciarSesionConGoogle(idToken: string) {
  assertFirebaseConfiguration();
  if (!idToken) {
    throw new Error("Google no devolvió un token de acceso.");
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  await ensureUserProfile(result.user);
  return result.user;
}

export async function cerrarSesionFirebase() {
  await signOut(auth);
}

export function nombreInicial(user: User) {
  return user.displayName?.trim() || user.email?.split("@")[0] || "Cliente";
}
