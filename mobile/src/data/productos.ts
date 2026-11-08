import type { Producto } from "@/types";

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Espresso",
    descripcion: "Doble shot corto extraído con precisión milimétrica.",
    categoria: "clasicos",
    disponible: true,
    precios: { "16oz": 2.5, "20oz": 3, "24oz": 3.5, "32oz": 4 },
  },
  {
    id: 2,
    nombre: "Americano",
    descripcion: "Doble shot de espresso diluido en agua caliente filtrada.",
    categoria: "clasicos",
    disponible: true,
    precios: { "16oz": 2.75, "20oz": 3.25, "24oz": 3.75, "32oz": 4.25 },
  },
  {
    id: 3,
    nombre: "Cappuccino",
    descripcion: "Espresso clásico con partes iguales de leche y espuma densa.",
    categoria: "clasicos",
    disponible: true,
    precios: { "16oz": 3.5, "20oz": 4, "24oz": 4.5, "32oz": 5 },
  },
  {
    id: 4,
    nombre: "Latte de la casa",
    descripcion: "Textura sedosa de leche coronando nuestro espresso de origen.",
    categoria: "clasicos",
    disponible: true,
    precios: { "16oz": 3.75, "20oz": 4.25, "24oz": 4.75, "32oz": 5.25 },
  },
  {
    id: 5,
    nombre: "Cold Brew de la Casa",
    descripcion: "Extracción en frío durante 18 horas para un sabor suave.",
    categoria: "frios",
    disponible: true,
    precios: { "16oz": 4.5, "20oz": 5, "24oz": 5.5, "32oz": 6 },
  },
  {
    id: 6,
    nombre: "Filtrados de Especialidad",
    descripcion: "Métodos artesanales con granos premium de temporada.",
    categoria: "filtrados",
    disponible: true,
    precios: { "16oz": 4.75, "20oz": 5.25, "24oz": 5.75, "32oz": 6.25 },
  },
];
