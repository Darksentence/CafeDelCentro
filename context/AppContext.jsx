"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { obtenerProductos } from "@/services/productosService";
import {
  cambiarEstadoPedido as apiCambiarEstado,
  crearPedido as apiCrearPedido,
  obtenerPedidos
} from "@/services/pedidosService";
import {
  calcularPuntos,
  obtenerPedidosDeUsuario
} from "@/services/firestoreService";
import {
  cerrarSesion as cerrarSesionFirebase,
  suscribirseSesion
} from "@/services/authService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [puntosUsuario, setPuntosUsuario] = useState(0);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    let activo = true;
    const unsubscribe = suscribirseSesion(async (datos) => {
      if (!activo) return;
      if (!datos) {
        setUsuario(null);
        setPedidos([]);
        setPuntosUsuario(0);
        setCargandoSesion(false);
        return;
      }

      setUsuario(datos);
      try {
        const historial = datos.rol === "admin"
          ? await obtenerPedidos(datos.id, true)
          : await obtenerPedidosDeUsuario(datos.id);
        if (!activo) return;
        const puntos = calcularPuntos(historial);
        setPedidos(historial);
        setPuntosUsuario(puntos);
        setUsuario((actual) => actual ? { ...actual, puntos } : actual);
      } catch (error) {
        console.error("Error al cargar el historial de Firebase:", error);
      } finally {
        if (activo) setCargandoSesion(false);
      }
    });

    return () => {
      activo = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    obtenerProductos()
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  const cerrarSesion = async () => {
    await cerrarSesionFirebase();
    setUsuario(null);
    setCarrito([]);
    setPedidos([]);
    setPuntosUsuario(0);
  };

  const agregarAlCarrito = (producto, tamano) => {
    const precioFinal = producto.precios[tamano];
    if (typeof precioFinal !== "number") return;

    setCarrito((prev) => {
      const existe = prev.some((item) => item.id === producto.id && item.tamano === tamano);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id && item.tamano === tamano
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, {
        productoId: producto.id,
        id: producto.id,
        nombre: producto.nombre,
        tamano,
        precio: precioFinal,
        cantidad: 1
      }];
    });
  };

  const actualizarCantidad = (id, tamano, delta) => {
    setCarrito((prev) => prev
      .map((item) => {
        if (item.id === id && item.tamano === tamano) {
          const nuevaCantidad = item.cantidad + delta;
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
        }
        return item;
      })
      .filter(Boolean));
  };

  const eliminarDelCarrito = (id, tamano) => {
    setCarrito((prev) => prev.filter((item) => !(item.id === id && item.tamano === tamano)));
  };

  const calcularTotalCarrito = () => {
    return carrito
      .reduce((total, item) => total + item.precio * item.cantidad, 0)
      .toFixed(2);
  };

  const finalizarPedido = async () => {
    if (carrito.length === 0 || !usuario) return false;

    const respuesta = await apiCrearPedido({
      usuarioId: usuario.id,
      items: [...carrito],
      total: Number(calcularTotalCarrito())
    });
    const nuevosPedidos = [respuesta.pedido, ...pedidos];
    const nuevosPuntos = calcularPuntos(nuevosPedidos);
    setPedidos(nuevosPedidos);
    setPuntosUsuario(nuevosPuntos);
    setUsuario((actual) => actual ? { ...actual, puntos: nuevosPuntos } : actual);
    setCarrito([]);
    return true;
  };

  const cambiarEstadoPedido = async (idPedido, nuevoEstado) => {
    const actualizado = await apiCambiarEstado(idPedido, nuevoEstado);
    setPedidos((prev) => prev.map((pedido) =>
      pedido.id === actualizado.id ? actualizado : pedido
    ));
  };

  return (
    <AppContext.Provider value={{
      usuario,
      cargandoSesion,
      esAdmin: usuario?.rol === "admin",
      cerrarSesion,
      productos,
      carrito,
      agregarAlCarrito,
      actualizarCantidad,
      eliminarDelCarrito,
      calcularTotalCarrito,
      pedidos,
      finalizarPedido,
      cambiarEstadoPedido,
      puntosUsuario
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
