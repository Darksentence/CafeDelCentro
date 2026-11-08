import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import {
    auth,
    firebaseConfigCompleta
} from "./firebaseClient";
import { ensureUserProfile } from "./firestoreService";

function requireAuth() {
    if (!auth) throw new Error("Firebase Authentication solo puede usarse desde el navegador.");
    return auth;
}

function requireFirebaseConfiguration() {
    if (!firebaseConfigCompleta) {
        throw new Error(
            "Falta configurar Firebase. Copia .env.example a .env.local y completa los valores del proyecto."
        );
    }
}

async function preparePersistence() {
    await setPersistence(requireAuth(), browserLocalPersistence);
}

export function mensajeAuth(error) {
    const code = error?.code;
    const messages = {
        "auth/invalid-email": "Escribe un correo electrónico válido.",
        "auth/invalid-credential": "El correo o la contraseña no son correctos.",
        "auth/user-not-found": "El correo o la contraseña no son correctos.",
        "auth/wrong-password": "El correo o la contraseña no son correctos.",
        "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
        "auth/network-request-failed": "No hay conexión. Revisa internet e inténtalo de nuevo.",
        "auth/popup-blocked": "El navegador bloqueó la ventana de Google. Permite ventanas emergentes.",
        "auth/popup-closed-by-user": "Cerraste la ventana de Google.",
        "auth/operation-not-allowed": "Este método de acceso aún no está habilitado en Firebase.",
        "permission-denied": "Firebase rechazó la operación. Revisa las reglas de Firestore."
    };
    return messages[code] || error?.message || "No pudimos completar la autenticación.";
}

export async function login(email, password) {
    requireFirebaseConfiguration();
    await preparePersistence();
    const result = await signInWithEmailAndPassword(
        requireAuth(),
        email.trim().toLowerCase(),
        password
    );
    return ensureUserProfile(result.user);
}

export async function registrar(nombre, email, password) {
    requireFirebaseConfiguration();
    await preparePersistence();
    const result = await createUserWithEmailAndPassword(
        requireAuth(),
        email.trim().toLowerCase(),
        password
    );
    await updateProfile(result.user, { displayName: nombre.trim() });
    return ensureUserProfile(result.user, nombre.trim());
}

export async function loginConGoogle() {
    requireFirebaseConfiguration();
    await preparePersistence();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(requireAuth(), provider);
    return ensureUserProfile(result.user);
}

export function suscribirseSesion(callback) {
    const webAuth = requireAuth();
    return onAuthStateChanged(webAuth, async (user) => {
        if (!user) {
            callback(null);
            return;
        }
        try {
            callback(await ensureUserProfile(user));
        } catch (error) {
            callback(null, error);
        }
    });
}

export function rutaDeUsuario(usuario) {
    return usuario?.rol === "admin" ? "/dashboard" : "/menu";
}

export function cerrarSesion() {
    return signOut(requireAuth());
}

export function obtenerUsuario(id) {
    return ensureUserProfile({ uid: id, email: "", displayName: "" });
}
