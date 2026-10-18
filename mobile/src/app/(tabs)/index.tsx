import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, CafeBrand, Page, Surface } from "@/components/ui";
import { useSession } from "@/context/SessionContext";
import { colors, radius } from "@/theme";

export default function HomeTab() {
  const { usuario, cantidadEnCarrito } = useSession();
  const firstName = usuario?.nombre.trim().split(/\s+/)[0] || "amigo";

  return (
    <Page>
      <CafeBrand />
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>UNA PAUSA PARA TI</Text>
        <Text style={styles.title}>Hola, {firstName}.</Text>
        <Text style={styles.body}>
          El café sabe mejor cuando se comparte. Encuentra algo rico para este momento.
        </Text>
        <View style={styles.illustration}>
          <View style={styles.sun} />
          <Text style={styles.cup}>☕</Text>
          <Text style={styles.artLabel}>ORIGEN · OFICIO · ENCUENTRO</Text>
        </View>
        <AppButton
          title="Explorar el menú"
          onPress={() => router.push("/menu")}
        />
      </View>

      <Surface style={styles.pointsCard}>
        <View>
          <Text style={styles.pointsLabel}>TUS PUNTOS</Text>
          <Text style={styles.points}>{usuario?.puntos ?? 0}</Text>
          <Text style={styles.pointsHelp}>Un punto por cada dólar en tus pedidos.</Text>
        </View>
        <View style={styles.pointsMark}>
          <Text style={styles.pointsCup}>✦</Text>
        </View>
      </Surface>

      <Surface style={styles.shortcut}>
        <View style={styles.shortcutCopy}>
          <Text style={styles.shortcutTitle}>¿Ya elegiste?</Text>
          <Text style={styles.shortcutText}>
            {cantidadEnCarrito === 0
              ? "Tu carrito está listo para una buena idea."
              : "Tienes " + cantidadEnCarrito + " producto(s) en el carrito."}
          </Text>
        </View>
        <AppButton
          title="Ver carrito"
          variant="secondary"
          compact
          onPress={() => router.push("/cart")}
        />
      </Surface>
    </Page>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 14,
    padding: 21,
    borderRadius: 24,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  eyebrow: {
    color: colors.coffee,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    color: colors.ink,
    fontFamily: "serif",
    fontSize: 36,
    lineHeight: 42,
  },
  body: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  illustration: {
    minHeight: 170,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    borderRadius: radius.card,
    backgroundColor: "#F3E9D9",
  },
  sun: {
    width: 136,
    height: 136,
    borderRadius: 68,
    position: "absolute",
    backgroundColor: "#EAD9C0",
  },
  cup: { fontSize: 65 },
  artLabel: {
    position: "absolute",
    bottom: 13,
    color: colors.coffeeDark,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  pointsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EDE3D3",
    borderColor: "#E4D4BE",
  },
  pointsLabel: {
    color: colors.coffeeDark,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  points: { marginTop: 6, color: colors.ink, fontFamily: "serif", fontSize: 30 },
  pointsHelp: { marginTop: 3, color: colors.muted, fontSize: 11 },
  pointsMark: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: "#F8F0E5",
  },
  pointsCup: { color: colors.coffee, fontSize: 23 },
  shortcut: { flexDirection: "row", alignItems: "center", gap: 12 },
  shortcutCopy: { flex: 1, gap: 4 },
  shortcutTitle: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  shortcutText: { color: colors.muted, fontSize: 12, lineHeight: 17 },
});
