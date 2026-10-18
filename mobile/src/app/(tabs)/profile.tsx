import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, Page, PageHeading, Surface } from "@/components/ui";
import { useSession } from "@/context/SessionContext";
import { colors } from "@/theme";

export default function ProfileTab() {
  const { usuario, cerrarSesion } = useSession();
  const initials = (usuario?.nombre || "CD")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  async function logout() {
    await cerrarSesion();
    router.replace("/");
  }

  return (
    <Page>
      <PageHeading
        eyebrow="TU ESPACIO"
        title="Mi perfil"
        subtitle="Tu cuenta y los detalles de tu visita."
      />

      <Surface style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{usuario?.nombre}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>
            {usuario?.rol === "admin" ? "Administración" : "Cliente"}
          </Text>
        </View>
      </Surface>

      <Surface style={styles.points}>
        <View>
          <Text style={styles.pointsLabel}>PUNTOS DE FIDELIDAD</Text>
          <Text style={styles.pointsValue}>{usuario?.puntos ?? 0}</Text>
          <Text style={styles.pointsHint}>Suma un punto por cada dólar que disfrutas.</Text>
        </View>
        <Text style={styles.star}>✦</Text>
      </Surface>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Un café, un buen momento.</Text>
        <Text style={styles.noteText}>
          Gracias por ser parte de Café del Centro.
        </Text>
      </View>

      <AppButton
        title="Cerrar sesión"
        variant="secondary"
        onPress={logout}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: "center", gap: 9, paddingVertical: 24 },
  avatar: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderRadius: 34,
    backgroundColor: "#EFE1CA",
  },
  avatarText: { color: colors.coffeeDark, fontFamily: "serif", fontSize: 25 },
  name: { color: colors.ink, fontSize: 18, fontWeight: "700" },
  email: { color: colors.muted, fontSize: 13 },
  rolePill: { marginTop: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: "#F3E9D9" },
  roleText: { color: colors.coffeeDark, fontSize: 10, fontWeight: "800", textTransform: "capitalize" },
  points: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#EDE3D3", borderColor: "#E4D4BE" },
  pointsLabel: { color: colors.coffeeDark, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  pointsValue: { marginTop: 6, color: colors.ink, fontFamily: "serif", fontSize: 30 },
  pointsHint: { marginTop: 3, color: colors.muted, fontSize: 11 },
  star: { color: colors.coffee, fontSize: 28 },
  note: { gap: 5, paddingVertical: 5 },
  noteTitle: { color: colors.ink, fontFamily: "serif", fontSize: 20 },
  noteText: { color: colors.muted, fontSize: 13 },
});
