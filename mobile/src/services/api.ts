import { Platform } from "react-native";
import type { ItemCarrito, Pedido, Producto, Usuario } from "@/types";

const defaultHost =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://localhost:3000/api";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL || defaultHost
).replace(/\/+$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(API_BASE_URL + path, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Revisa que la web esté activa y la dirección de la API sea correcta."
    );
  }

  const data = (await response.json().catch(() => ({}))) as {
    mensaje?: string;
  };

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
