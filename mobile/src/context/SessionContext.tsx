import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { auth } from "@/config/firebase";
import {
  calcularPuntos,
  ensureUserProfile,
  obtenerPedidos,
} from "@/services/firestore";
import { cerrarSesionFirebase } from "@/services/firebaseAuth";
import type { ItemCarrito, Producto, Usuario } from "@/types";

type SessionValue = {
  usuario: Usuario | null;
  cargandoSesion: boolean;
  carrito: ItemCarrito[];
  cantidadEnCarrito: number;
  refrescarUsuario: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
  agregarAlCarrito: (producto: Producto, tamano: string) => void;
  cambiarCantidad: (productoId: number, tamano: string, delta: number) => void;
  vaciarCarrito: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const sincronizarUsuario = useCallback(async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      setUsuario(null);
      return;
    }

    const profile = await ensureUserProfile(firebaseUser);
    const pedidos = await obtenerPedidos(firebaseUser.uid, profile.rol === "admin");
    setUsuario({ ...profile, puntos: calcularPuntos(pedidos) });
  }, []);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      void (async () => {
        try {
          if (!firebaseUser) {
            if (mounted) setUsuario(null);
            return;
          }
          const profile = await ensureUserProfile(firebaseUser);
          const pedidos = await obtenerPedidos(
            firebaseUser.uid,
            profile.rol === "admin"
          );
          if (mounted) setUsuario({ ...profile, puntos: calcularPuntos(pedidos) });
        } catch {
          await cerrarSesionFirebase().catch(() => undefined);
          if (mounted) setUsuario(null);
        } finally {
          if (mounted) setCargandoSesion(false);
        }
      })();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const cerrarSesion = useCallback(async () => {
    await cerrarSesionFirebase();
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
      refrescarUsuario: sincronizarUsuario,
      cerrarSesion,
      agregarAlCarrito,
      cambiarCantidad,
      vaciarCarrito,
    }),
    [
      usuario,
      cargandoSesion,
      carrito,
      cantidadEnCarrito,
      sincronizarUsuario,
      cerrarSesion,
      agregarAlCarrito,
      cambiarCantidad,
      vaciarCarrito,
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
