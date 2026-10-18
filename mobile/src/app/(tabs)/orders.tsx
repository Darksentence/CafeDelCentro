import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import {
  AppButton,
  LoadingMessage,
  Notice,
  Page,
  PageHeading,
  Surface,
} from "@/components/ui";
import { useSession } from "@/context/SessionContext";
import { actualizarEstadoPedido, obtenerPedidos } from "@/services/api";
import { colors } from "@/theme";
import type { Pedido } from "@/types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return date.toLocaleDateString("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusLabel(status: string) {
  if (status === "listo") return "Puedes pasar por él";
  if (status === "entregado") return "Disfrútalo";
  return "Lo estamos preparando";
}

export default function OrdersTab() {
  const { usuario } = useSession();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setLoading(true);
    setError("");
    try {
      setPedidos(
        await obtenerPedidos(usuario.rol === "admin" ? undefined : usuario.id)
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos encontrar tus pedidos. Prueba de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar])
  );

  async function avanzarEstado(pedido: Pedido) {
    const nuevoEstado = pedido.estado === "pendiente" ? "listo" : "entregado";
    setUpdatingId(pedido.id);
    setError("");
    try {
      const actualizado = await actualizarEstadoPedido(pedido.id, nuevoEstado);
      setPedidos((actuales) =>
        actuales.map((actual) =>
          actual.id === actualizado.id ? actualizado : actual
        )
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos actualizar el pedido. Prueba otra vez.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Page>
      <PageHeading
        eyebrow={usuario?.rol === "admin" ? "EN LA BARRA" : "TUS VISITAS"}
        title={usuario?.rol === "admin" ? "Pedidos de hoy" : "Lo que has pedido"}
        subtitle={
          usuario?.rol === "admin"
            ? "Mira qué falta por preparar y avisa cuando esté listo."
            : "Sigue por aquí el estado de tus pedidos recientes."
        }
      />

      {error ? <Notice>{error}</Notice> : null}
      {loading ? <LoadingMessage label="Buscamos tus pedidos..." /> : null}
      {!loading && !error && pedidos.length === 0 ? (
        <Surface style={styles.empty}>
          <Text style={styles.emptyIcon}>▤</Text>
          <Text style={styles.emptyTitle}>Todavía no hay nada por aquí</Text>
          <Text style={styles.emptyText}>
            En cuanto hagas tu primer pedido, podrás seguirlo desde este espacio.
          </Text>
          <AppButton title="Echar un vistazo a la carta" onPress={() => router.push("/menu")} />
        </Surface>
      ) : null}

      {!loading &&
        pedidos.map((pedido) => (
          <Surface key={pedido.id} style={styles.order}>
            <View style={styles.orderTop}>
              <View>
                <Text style={styles.orderNumber}>PEDIDO #{pedido.id}</Text>
                <Text style={styles.date}>{formatDate(pedido.fecha)}</Text>
              </View>
              <View
                style={[
                  styles.status,
                  pedido.estado === "entregado"
                    ? styles.statusDone
                    : pedido.estado === "listo"
                      ? styles.statusReady
                      : styles.statusPending,
                ]}
              >
                <Text style={styles.statusText}>{statusLabel(pedido.estado)}</Text>
              </View>
            </View>

            <View style={styles.items}>
              {pedido.items.map((item, index) => (
                <View key={pedido.id + "-" + index} style={styles.itemLine}>
                  <Text style={styles.itemName}>
                    {item.cantidad} × {item.nombre}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {item.tamano} · {"$" + (item.precio * item.cantidad).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.orderBottom}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>{"$" + pedido.total.toFixed(2)}</Text>
            </View>

            {usuario?.rol === "admin" && pedido.estado !== "entregado" ? (
              <AppButton
                title={pedido.estado === "pendiente" ? "Avisar que está listo" : "Avisar que salió"}
                onPress={() => avanzarEstado(pedido)}
                loading={updatingId === pedido.id}
                compact
              />
            ) : null}
          </Surface>
        ))}
    </Page>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: "center", gap: 13, paddingVertical: 28 },
  emptyIcon: { color: colors.coffee, fontSize: 36 },
  emptyTitle: { color: colors.ink, fontFamily: "serif", fontSize: 23 },
  emptyText: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: "center" },
  order: { gap: 14 },
  orderTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  orderNumber: { color: colors.coffeeDark, fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  date: { marginTop: 5, color: colors.muted, fontSize: 11 },
  status: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 99 },
  statusPending: { backgroundColor: "#F5E9D7" },
  statusReady: { backgroundColor: "#E5EBDE" },
  statusDone: { backgroundColor: "#EAF1E7" },
  statusText: { color: colors.coffeeDark, fontSize: 9, fontWeight: "800" },
  items: { gap: 10 },
  itemLine: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  itemName: { flex: 1, color: colors.ink, fontSize: 12, fontWeight: "600" },
  itemDetails: { color: colors.muted, fontSize: 11 },
  orderBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  totalLabel: { color: colors.muted, fontSize: 12 },
  total: { color: colors.coffeeDark, fontSize: 15, fontWeight: "800" },
});
