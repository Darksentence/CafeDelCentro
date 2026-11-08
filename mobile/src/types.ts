export type RolUsuario = "cliente" | "admin";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  puntos?: number;
  fotoUrl?: string;
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
  id: string;
  usuarioId: string;
  uid: string;
  items: ItemCarrito[];
  total: number;
  estado: "pendiente" | "listo" | "entregado";
  fecha: string;
};
