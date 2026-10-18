export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: "cliente" | "admin" | string;
  puntos?: number;
};

export type Producto = {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: string;
  imagen?: string;
  disponible?: boolean;
  precios: Record<string, number>;
};

export type ItemCarrito = {
  productoId: number;
  nombre: string;
  tamano: string;
  precio: number;
  cantidad: number;
};

export type Pedido = {
  id: number;
  usuarioId: number;
  items: ItemCarrito[];
  total: number;
  estado: "pendiente" | "listo" | "entregado" | string;
  fecha: string;
};
