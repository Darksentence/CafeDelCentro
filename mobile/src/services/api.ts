import { productos } from "@/data/productos";

export function obtenerProductos() {
  return Promise.resolve(productos);
}
