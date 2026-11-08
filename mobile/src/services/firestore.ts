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
  where,
  type DocumentData,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import type { ItemCarrito, Pedido, RolUsuario, Usuario } from "@/types";

const USERS_COLLECTION = "usuarios";
const ORDERS_COLLECTION = "pedidos";

function normalizeRole(value: unknown): RolUsuario {
  return value === "admin" ? "admin" : "cliente";
}

function nombreInicial(user?: User) {
  return user?.displayName?.trim() || user?.email?.split("@")[0] || "Cliente";
}

function toUsuario(uid: string, data: DocumentData, user?: User): Usuario {
  return {
    id: uid,
    nombre: typeof data.nombre === "string" ? data.nombre : nombreInicial(user),
    email: typeof data.email === "string" ? data.email : user?.email || "",
    rol: normalizeRole(data.rol),
    puntos: typeof data.puntos === "number" ? data.puntos : 0,
    fotoUrl: typeof data.fotoUrl === "string" ? data.fotoUrl : user?.photoURL || undefined,
  };
}

export async function ensureUserProfile(
  user: User,
  nombre?: string
): Promise<Usuario> {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    const profile = {
      uid: user.uid,
      nombre: nombre?.trim() || nombreInicial(user),
      email: user.email || "",
      rol: "cliente" as const,
      puntos: 0,
      fotoUrl: user.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return toUsuario(user.uid, { ...existingData, nombre: nextName }, user);
}

function fechaPedido(data: DocumentData) {
  if (typeof data.fecha === "string") return data.fecha;
  if (data.createdAt?.toDate instanceof Function) {
    return data.createdAt.toDate().toISOString();
  }
  return new Date().toISOString();
}

function toPedido(id: string, data: DocumentData): Pedido {
  return {
    id,
    usuarioId: String(data.usuarioId || data.uid || ""),
    uid: String(data.uid || data.usuarioId || ""),
    items: Array.isArray(data.items) ? (data.items as ItemCarrito[]) : [],
    total: typeof data.total === "number" ? data.total : 0,
    estado:
      data.estado === "listo" || data.estado === "entregado"
        ? data.estado
        : "pendiente",
    fecha: fechaPedido(data),
  };
}

export async function obtenerPedidos(uid: string, esAdmin = false) {
  const pedidosRef = collection(db, ORDERS_COLLECTION);
  const snapshot = esAdmin
    ? await getDocs(pedidosRef)
    : await getDocs(query(pedidosRef, where("uid", "==", uid)));

  return snapshot.docs
    .map((item) => toPedido(item.id, item.data()))
    .sort((left, right) => right.fecha.localeCompare(left.fecha));
}

export function calcularPuntos(pedidos: Pedido[]) {
  return pedidos.reduce((total, pedido) => total + Math.floor(pedido.total), 0);
}

export async function crearPedido(
  usuarioId: string,
  items: ItemCarrito[],
  total: number
) {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== usuarioId) {
    throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
  }
  if (!items.length || total <= 0) {
    throw new Error("Agrega al menos un producto antes de enviar el pedido.");
  }

  const calculatedTotal = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  if (Math.abs(calculatedTotal - total) > 0.01) {
    throw new Error("El total del pedido no es válido.");
  }

  const created = await addDoc(collection(db, ORDERS_COLLECTION), {
    uid: usuarioId,
    usuarioId,
    items,
    total: Number(total.toFixed(2)),
    estado: "pendiente",
    fecha: new Date().toISOString(),
    createdAt: serverTimestamp(),
  });
  const snapshot = await getDoc(created);
  return {
    pedido: toPedido(created.id, snapshot.data() || {}),
    puntosGanados: Math.floor(total),
  };
}

export async function actualizarEstadoPedido(
  pedidoId: string,
  estado: Pedido["estado"]
) {
  if (!["pendiente", "listo", "entregado"].includes(estado)) {
    throw new Error("El estado del pedido no es válido.");
  }

  const pedidoRef = doc(db, ORDERS_COLLECTION, pedidoId);
  await updateDoc(pedidoRef, { estado, updatedAt: serverTimestamp() });
  const snapshot = await getDoc(pedidoRef);
  if (!snapshot.exists()) throw new Error("No encontramos ese pedido.");
  return toPedido(snapshot.id, snapshot.data());
}
