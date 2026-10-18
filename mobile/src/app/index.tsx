import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, CafeBrand, Page } from "@/components/ui";
import { colors } from "@/theme";

export default function WelcomeScreen() {
  return (
    <Page safeEdges={["top", "right", "bottom", "left"]} contentStyle={styles.page}>
      <CafeBrand />

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>UN CAFÉ QUE CAE BIEN</Text>
        <Text style={styles.title}>
          Baja el ritmo.{"\n"}
          <Text style={styles.titleAccent}>Pide algo rico.</Text>
        </Text>
        <Text style={styles.description}>
          Tu café de siempre o algo nuevo por probar. Aquí te esperamos con algo rico y recién hecho.
        </Text>

        <View style={styles.art}>
          <View style={styles.sun} />
          <View style={styles.cup}>
            <Text style={styles.cupEmoji}>☕</Text>
          </View>
          <Text style={styles.caption}>RECIÉN HECHO{"\n"}PARA DISFRUTAR</Text>
        </View>

        <AppButton
          title="Entrar a mi cuenta"
          onPress={() => router.push("/login")}
        />
        <AppButton
          title="Soy nuevo por aquí"
          variant="secondary"
          onPress={() => router.push("/registro")}
        />
      </View>

      <Text style={styles.footer}>SAN SALVADOR · CENTRO HISTÓRICO</Text>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: "space-between" },
  hero: { gap: 17, paddingTop: 18 },
  eyebrow: {
    color: colors.coffee,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: colors.ink,
    fontFamily: "serif",
    fontSize: 45,
    lineHeight: 49,
    letterSpacing: -1.2,
  },
  titleAccent: { color: colors.coffee, fontStyle: "italic" },
  description: { maxWidth: 320, color: colors.muted, fontSize: 15, lineHeight: 23 },
  art: {
    minHeight: 205,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 4,
  },
  sun: {
    width: 190,
    height: 190,
    borderRadius: 95,
    position: "absolute",
    backgroundColor: "#EFE1CA",
  },
  cup: {
    width: 112,
    height: 112,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C98B53",
    transform: [{ rotate: "-7deg" }],
  },
  cupEmoji: { fontSize: 52 },
  caption: {
    position: "absolute",
    right: 4,
    bottom: 18,
    color: colors.coffeeDark,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.2,
    lineHeight: 14,
    textAlign: "right",
  },
  footer: {
    alignSelf: "center",
    color: colors.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    paddingTop: 16,
  },
});
