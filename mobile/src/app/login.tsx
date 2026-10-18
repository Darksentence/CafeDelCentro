import { useState } from "react";
import { router } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { AppButton, CafeBrand, Field, Notice, Page } from "@/components/ui";
import { useSession } from "@/context/SessionContext";
import { iniciarSesion as solicitarSesion } from "@/services/api";
import { colors } from "@/theme";

export default function LoginScreen() {
  const { iniciarSesionLocal } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const usuario = await solicitarSesion(email.trim(), password);
      await iniciarSesionLocal(usuario);
      router.replace("/(tabs)");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos entrar a tu cuenta. Inténtalo otra vez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page safeEdges={["top", "right", "bottom", "left"]}>
      <CafeBrand />
      <View style={styles.card}>
        <Text style={styles.eyebrow}>QUÉ BUENO QUE VOLVISTE</Text>
        <Text style={styles.title}>Nos alegra verte</Text>
        <Text style={styles.subtitle}>
          Entra y encuentra algo rico para acompañar tu día.
        </Text>
        <Field
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@correo.com"
          inputProps={{
            autoCapitalize: "none",
            autoComplete: "email",
            keyboardType: "email-address",
            textContentType: "emailAddress",
          }}
        />
        <Field
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Escribe tu contraseña"
          secureTextEntry
          inputProps={{ autoComplete: "password", textContentType: "password" }}
        />
        {error ? <Notice>{error}</Notice> : null}
        <AppButton
          title="Continuar"
          onPress={submit}
          loading={loading}
          disabled={!email.trim() || !password}
        />
        <View style={styles.bottom}>
          <Text style={styles.helper}>¿Aún no tienes tu cuenta?</Text>
          <AppButton
            title="Crear una ahora"
            variant="text"
            onPress={() => router.push("/registro")}
          />
        </View>
      </View>
      <AppButton
        title="Volver a la portada"
        variant="text"
        onPress={() => router.replace("/")}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 17,
    padding: 21,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  eyebrow: {
    color: colors.coffee,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  title: { color: colors.coffeeDark, fontFamily: "serif", fontSize: 34 },
  subtitle: { marginTop: -10, color: colors.muted, fontSize: 14, lineHeight: 20 },
  bottom: { alignItems: "center", gap: 1, paddingTop: 4 },
  helper: { color: colors.muted, fontSize: 13 },
});
