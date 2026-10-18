import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import {
  AppButton,
  Notice,
  Page,
  PageHeading,
  Surface,
} from "@/components/ui";
import { useSession } from "@/context/SessionContext";
import { crearPedido } from "@/services/api";
import { colors } from "@/theme";

export default function CartTab() {
  const {
    usuario,
    carrito,
    cambiarCantidad,
    vaciarCarrito,
    actualizarPuntos,
  } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pedidoCreado, setPedidoCreado] = useState<number | null>(null);
  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  async function confirmarPedido() {
    if (!usuario || carrito.length === 0) return;
    setError("");
    setLoading(true);
    try {
      const respuesta = await crearPedido(usuario.id, carrito, total);
      await actualizarPuntos(respuesta.puntosTotales);
      vaciarCarrito();
      setPedidoCreado(respuesta.pedido.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear el pedido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <PageHeading
        eyebrow="ANTES DE DISFRUTAR"
        title="Tu carrito"
        subtitle="Revisa las bebidas y confirma tu pedido."
      />

      {pedidoCreado !== null ? (
        <Surface style={styles.confirmation}>
          <Text style={styles.confirmationMark}>✓</Text>
          <Text style={styles.confirmationTitle}>Pedido recibido</Text>
          <Text style={styles.confirmationText}>
            Tu pedido #{pedidoCreado} ya está en camino a la cafetería.
          </Text>
          <AppButton
            title="Ver mis pedidos"
            onPress={() => {
              setPedidoCreado(null);
              router.push("/orders");
            }}
          />
        </Surface>
      ) : carrito.length === 0 ? (
        <Surface style={styles.empty}>
          <Text style={styles.emptyIcon}>☕</Text>
          <Text style={styles.emptyTitle}>Todavía no hay nada aquí</Text>
          <Text style={styles.emptyText}>
            Cuando encuentres tu bebida favorita, la verás en este espacio.
          </Text>
          <AppButton title="Explorar el menú" onPress={() => router.push("/menu")} />
        </Surface>
      ) : (
        <>
          {carrito.map((item) => (
            <Surface key={item.productoId + "-" + item.tamano} style={styles.item}>
              <View style={styles.itemCopy}>
                <Text style={styles.itemName}>{item.nombre}</Text>
                <Text style={styles.itemDetails}>
                  {item.tamano} · {"$" + item.precio.toFixed(2)} c/u
                </Text>
                <Text style={styles.itemTotal}>
                  {"$" + (item.precio * item.cantidad).toFixed(2)}
                </Text>
              </View>
              <View style={styles.quantity}>
                <AppButton
                  title="−"
                  variant="secondary"
                  compact
                  onPress={() => cambiarCantidad(item.productoId, item.tamano, -1)}
                />
                <Text style={styles.quantityText}>{item.cantidad}</Text>
                <AppButton
                  title="+"
                  variant="secondary"
                  compact
                  onPress={() => cambiarCantidad(item.productoId, item.tamano, 1)}
                />
              </View>
            </Surface>
          ))}

          <Surface style={styles.summary}>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{"$" + total.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryLine, styles.grandTotal]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{"$" + total.toFixed(2)}</Text>
            </View>
            {error ? <Notice>{error}</Notice> : null}
            <AppButton
              title="Confirmar pedido"
              onPress={confirmarPedido}
              loading={loading}
            />
          </Surface>
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemCopy: { flex: 1, gap: 5 },
  itemName: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  itemDetails: { color: colors.muted, fontSize: 12 },
  itemTotal: { marginTop: 2, color: colors.coffeeDark, fontSize: 15, fontWeight: "700" },
  quantity: { flexDirection: "row", alignItems: "center", gap: 7 },
  quantityText: { minWidth: 18, color: colors.ink, fontSize: 14, fontWeight: "700", textAlign: "center" },
  summary: { gap: 13, marginTop: 4 },
  summaryLine: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { color: colors.muted, fontSize: 13 },
  summaryValue: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  grandTotal: { paddingTop: 13, borderTopWidth: 1, borderTopColor: colors.line },
  grandTotalLabel: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  grandTotalValue: { color: colors.coffeeDark, fontSize: 18, fontWeight: "800" },
  empty: { alignItems: "center", gap: 13, paddingVertical: 32 },
  emptyIcon: { fontSize: 42 },
  emptyTitle: { color: colors.ink, fontFamily: "serif", fontSize: 23, textAlign: "center" },
  emptyText: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: "center" },
  confirmation: { alignItems: "center", gap: 14, paddingVertical: 30 },
  confirmationMark: {
    width: 48,
    height: 48,
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#EAF1E7",
    color: colors.success,
    fontSize: 27,
    lineHeight: 48,
    textAlign: "center",
  },
  confirmationTitle: { color: colors.ink, fontFamily: "serif", fontSize: 25 },
  confirmationText: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: "center" },
});
