import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { auth, db } from "./firebaseClient";

const USERS_COLLECTION = "usuarios";
const ORDERS_COLLECTION = "pedidos";

function requireDb() {
    if (!db) throw new Error("Firestore solo puede usarse desde el navegador.");
    return db;
}

function requireCurrentUser() {
    if (!auth?.currentUser) {
        throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
    }
    return auth.currentUser;
}

function nombreInicial(user) {
    return user?.displayName?.trim() || user?.email?.split("@")[0] || "Cliente";
}

function toUsuario(uid, data, user) {
    return {
        id: uid,
        nombre: typeof data.nombre === "string" ? data.nombre : nombreInicial(user),
        email: typeof data.email === "string" ? data.email : user?.email || "",
        rol: data.rol === "admin" ? "admin" : "cliente",
        puntos: typeof data.puntos === "number" ? data.puntos : 0,
        fotoUrl: typeof data.fotoUrl === "string" ? data.fotoUrl : user?.photoURL || undefined
    };
}

export async function ensureUserProfile(user, nombre) {
    const firestore = requireDb();
    const userRef = doc(firestore, USERS_COLLECTION, user.uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
        const profile = {
            uid: user.uid,
            nombre: nombre?.trim() || nombreInicial(user),
            email: user.email || "",
            rol: "cliente",
            puntos: 0,
            fotoUrl: user.photoURL || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        await setDoc(userRef, profile);
        return toUsuario(user.uid, profile, user);
    }

    const existingData = existing.data();
    const currentName = typeof existingData.nombre === "string" ? existingData.nombre : "";
    const nextName = nombre?.trim() || currentName || nombreInicial(user);
    if (
        nextName !== currentName ||
        existingData.email !== user.email ||
        existingData.fotoUrl !== (user.photoURL || null)
    ) {
        await setDoc(
            userRef,
            {
                nombre: nextName,
                email: user.email || "",
                fotoUrl: user.photoURL || null,
                updatedAt: serverTimestamp()
            },
            { merge: true }
        );
    }

    return toUsuario(user.uid, { ...existingData, nombre: nextName }, user);
}

function pedidoDesdeDocumento(id, data) {
    const fecha = typeof data.fecha === "string"
        ? data.fecha
        : data.createdAt?.toDate instanceof Function
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString();

    return {
        id,
        usuarioId: String(data.usuarioId || data.uid || ""),
        uid: String(data.uid || data.usuarioId || ""),
        items: Array.isArray(data.items) ? data.items : [],
        total: typeof data.total === "number" ? data.total : 0,
        estado: ["pendiente", "listo", "entregado"].includes(data.estado)
            ? data.estado
            : "pendiente",
        fecha
    };
}

export async function obtenerPedidos(usuarioId, esAdmin = false) {
    const firestore = requireDb();
    const currentUser = requireCurrentUser();
    const pedidosRef = collection(firestore, ORDERS_COLLECTION);
    const uid = usuarioId || currentUser.uid;
    const snapshot = esAdmin
        ? await getDocs(pedidosRef)
        : await getDocs(query(pedidosRef, where("uid", "==", uid)));

    return snapshot.docs
        .map((item) => pedidoDesdeDocumento(item.id, item.data()))
        .sort((left, right) => right.fecha.localeCompare(left.fecha));
}

export function obtenerPedidosDeUsuario(usuarioId) {
    return obtenerPedidos(usuarioId, false);
}

export function calcularPuntos(pedidos) {
    return pedidos.reduce((total, pedido) => total + Math.floor(pedido.total || 0), 0);
}

export async function crearPedido(pedido) {
    const firestore = requireDb();
    const currentUser = requireCurrentUser();
    if (pedido.usuarioId !== currentUser.uid) {
        throw new Error("El pedido no pertenece a la sesión actual.");
    }
    if (!Array.isArray(pedido.items) || pedido.items.length === 0 || pedido.total <= 0) {
        throw new Error("Agrega al menos un producto antes de enviar el pedido.");
    }

    const totalCalculado = pedido.items.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
    );
    if (Math.abs(totalCalculado - pedido.total) > 0.01) {
        throw new Error("El total del pedido no es válido.");
    }

    const created = await addDoc(collection(firestore, ORDERS_COLLECTION), {
        uid: currentUser.uid,
        usuarioId: currentUser.uid,
        items: pedido.items,
        total: Number(pedido.total.toFixed(2)),
        estado: "pendiente",
        fecha: new Date().toISOString(),
        createdAt: serverTimestamp()
    });
    const snapshot = await getDoc(created);
    const nuevoPedido = pedidoDesdeDocumento(created.id, snapshot.data() || {});
    return {
        pedido: nuevoPedido,
        puntosGanados: Math.floor(nuevoPedido.total)
    };
}

export async function cambiarEstadoPedido(idPedido, estado) {
    if (!["pendiente", "listo", "entregado"].includes(estado)) {
        throw new Error("El estado del pedido no es válido.");
    }
    const firestore = requireDb();
    const pedidoRef = doc(firestore, ORDERS_COLLECTION, idPedido);
    await updateDoc(pedidoRef, { estado, updatedAt: serverTimestamp() });
    const snapshot = await getDoc(pedidoRef);
    if (!snapshot.exists()) throw new Error("No encontramos ese pedido.");
    return pedidoDesdeDocumento(snapshot.id, snapshot.data());
}
