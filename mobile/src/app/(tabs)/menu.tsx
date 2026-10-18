import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppButton, LoadingMessage, Notice, Page, PageHeading } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/context/SessionContext";
import { obtenerProductos } from "@/services/api";
import { colors, radius } from "@/theme";
import type { Producto } from "@/types";

const filters = [
  { key: "todos", label: "Toda la carta" },
  { key: "clasicos", label: "De siempre" },
  { key: "frios", label: "Con hielo" },
  { key: "filtrados", label: "Filtrado" },
];

export default function MenuTab() {
  const { agregarAlCarrito } = useSession();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoria, setCategoria] = useState("todos");
  const [tamanos, setTamanos] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function cargar() {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerProductos();
      setProductos(data.filter((producto) => producto.disponible !== false));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos traer la carta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    obtenerProductos()
      .then((data) => {
        if (active) {
          setProductos(data.filter((producto) => producto.disponible !== false));
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : "No pudimos traer la carta. Inténtalo de nuevo."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibles = useMemo(
    () =>
      categoria === "todos"
        ? productos
        : productos.filter((producto) => producto.categoria === categoria),
    [categoria, productos]
  );

  function seleccionar(productoId: number, size: string) {
    setTamanos((current) => ({ ...current, [productoId]: size }));
  }

  return (
    <Page>
      <PageHeading
        eyebrow="HECHO AL MOMENTO"
        title="¿Qué se te antoja?"
        subtitle="Escoge tu bebida y el tamaño; nosotros nos encargamos del resto."
      />

      <View style={styles.filters}>
        {filters.map((filter) => {
          const selected = filter.key === categoria;
          return (
            <Pressable
              key={filter.key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setCategoria(filter.key)}
              style={[styles.filter, selected && styles.filterSelected]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {notice ? <Notice kind="success">{notice}</Notice> : null}
      {error ? (
        <View style={styles.errorBlock}>
          <Notice>{error}</Notice>
          <AppButton title="Volver a probar" variant="secondary" onPress={cargar} />
        </View>
      ) : null}
      {loading ? <LoadingMessage label="Estamos preparando la carta..." /> : null}
      {!loading && !error && visibles.length === 0 ? (
        <Notice kind="info">Por ahora no hay opciones en esta parte de la carta.</Notice>
      ) : null}

      {!loading &&
        !error &&
        visibles.map((producto) => {
          const size = tamanos[producto.id] || "16oz";
          return (
            <ProductCard
              key={producto.id}
              producto={producto}
              tamano={size}
              onSelectSize={(value) => seleccionar(producto.id, value)}
              onAdd={() => {
                agregarAlCarrito(producto, size);
                setNotice(producto.nombre + " ya está en tu bolsa.");
              }}
            />
          );
        })}
    </Page>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filter: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  filterSelected: { backgroundColor: colors.coffeeDark, borderColor: colors.coffeeDark },
  filterText: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  filterTextSelected: { color: colors.white },
  errorBlock: { gap: 10 },
});
