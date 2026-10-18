import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { ItemCarrito, Producto, Usuario } from "@/types";

const SESSION_KEY = "cafe-del-centro:usuario";

type SessionValue = {
  usuario: Usuario | null;
  cargandoSesion: boolean;
  carrito: ItemCarrito[];
  cantidadEnCarrito: number;
  iniciarSesionLocal: (usuario: Usuario) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  agregarAlCarrito: (producto: Producto, tamano: string) => void;
  cambiarCantidad: (productoId: number, tamano: string, delta: number) => void;
  vaciarCarrito: () => void;
  actualizarPuntos: (puntos: number) => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(SESSION_KEY)
      .then((stored) => {
        if (stored && mounted) setUsuario(JSON.parse(stored) as Usuario);
      })
      .catch(() => AsyncStorage.removeItem(SESSION_KEY))
      .finally(() => {
        if (mounted) setCargandoSesion(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const iniciarSesionLocal = useCallback(async (nuevoUsuario: Usuario) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUsuario(null);
    setCarrito([]);
  }, []);

  const agregarAlCarrito = useCallback((producto: Producto, tamano: string) => {
    const precio = producto.precios[tamano];
    if (typeof precio !== "number") return;

    setCarrito((actual) => {
      const existente = actual.find(
        (item) => item.productoId === producto.id && item.tamano === tamano
      );
      if (existente) {
        return actual.map((item) =>
          item.productoId === producto.id && item.tamano === tamano
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [
        ...actual,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          tamano,
          precio,
          cantidad: 1,
        },
      ];
    });
  }, []);

  const cambiarCantidad = useCallback(
    (productoId: number, tamano: string, delta: number) => {
      setCarrito((actual) =>
        actual
          .map((item) =>
            item.productoId === productoId && item.tamano === tamano
              ? { ...item, cantidad: item.cantidad + delta }
              : item
          )
          .filter((item) => item.cantidad > 0)
      );
    },
    []
  );

  const vaciarCarrito = useCallback(() => setCarrito([]), []);

  const actualizarPuntos = useCallback(
    async (puntos: number) => {
      if (!usuario) return;
      const actualizado = { ...usuario, puntos };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(actualizado));
      setUsuario(actualizado);
    },
    [usuario]
  );

  const cantidadEnCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const value = useMemo(
    () => ({
      usuario,
      cargandoSesion,
      carrito,
      cantidadEnCarrito,
      iniciarSesionLocal,
      cerrarSesion,
      agregarAlCarrito,
      cambiarCantidad,
      vaciarCarrito,
      actualizarPuntos,
    }),
    [
      usuario,
      cargandoSesion,
      carrito,
      cantidadEnCarrito,
      iniciarSesionLocal,
      cerrarSesion,
      agregarAlCarrito,
      cambiarCantidad,
      vaciarCarrito,
      actualizarPuntos,
    ]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de SessionProvider.");
  }
  return context;
}
