import { Platform } from "react-native";
import Constants from "expo-constants";
import type { ItemCarrito, Pedido, Producto, Usuario } from "@/types";

const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
const isPrivateLanHost =
  expoHost &&
  /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(expoHost);
const defaultHost =
  isPrivateLanHost
    ? `http://${expoHost}:3000/api`
    : Platform.OS === "android"
      ? "http://10.0.2.2:3000/api"
      : "http://localhost:3000/api";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL || defaultHost
).replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 12000;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  let data: { mensaje?: string };

  try {
    response = await fetch(API_BASE_URL + path, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    data = (await response.json().catch(() => ({}))) as {
      mensaje?: string;
    };
  } catch {
    if (controller.signal.aborted) {
      throw new Error(
        `La API no respondió en ${REQUEST_TIMEOUT_MS / 1000} segundos. Revisa que el servidor esté activo y que el celular pueda acceder a ${API_BASE_URL}.`
      );
    }
    throw new Error(
      `No se pudo conectar con ${API_BASE_URL}. En un celular físico, configura EXPO_PUBLIC_API_BASE_URL con la IP de tu computadora o la dirección pública de la API; localhost y 10.0.2.2 no apuntan a la computadora desde el teléfono.`
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(data.mensaje || "La solicitud no pudo completarse.");
  }

  return data as T;
}

export function iniciarSesion(email: string, password: string) {
  return request<Usuario>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registrarCliente(
  nombre: string,
  email: string,
  password: string
) {
  return request<Usuario>("/auth/registro", {
    method: "POST",
    body: JSON.stringify({ nombre, email, password }),
  });
}

export function obtenerProductos() {
  return request<Producto[]>("/productos");
}

export function obtenerPedidos(usuarioId?: number) {
  const filtro = usuarioId ? "?usuarioId=" + usuarioId : "";
  return request<Pedido[]>("/pedidos" + filtro);
}

export function crearPedido(
  usuarioId: number,
  items: ItemCarrito[],
  total: number
) {
  return request<{ pedido: Pedido; puntosTotales: number }>("/pedidos", {
    method: "POST",
    body: JSON.stringify({ usuarioId, items, total }),
  });
}

export function actualizarEstadoPedido(
  pedidoId: number,
  estado: Pedido["estado"]
) {
  return request<Pedido>("/pedidos/" + pedidoId, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
}
