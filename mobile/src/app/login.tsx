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
      setError(cause instanceof Error ? cause.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page safeEdges={["top", "right", "bottom", "left"]}>
      <CafeBrand />
      <View style={styles.card}>
        <Text style={styles.eyebrow}>QUÉ GUSTO VERTE</Text>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>
          Entra a tu cuenta para pedir algo rico.
        </Text>
        <Field
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
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
          placeholder="Tu contraseña"
          secureTextEntry
          inputProps={{ autoComplete: "password", textContentType: "password" }}
        />
        {error ? <Notice>{error}</Notice> : null}
        <AppButton
          title="Entrar a mi cuenta"
          onPress={submit}
          loading={loading}
          disabled={!email.trim() || !password}
        />
        <View style={styles.bottom}>
          <Text style={styles.helper}>¿Todavía no tienes una cuenta?</Text>
          <AppButton
            title="Crear cuenta"
            variant="text"
            onPress={() => router.push("/registro")}
          />
        </View>
      </View>
      <AppButton
        title="Volver al inicio"
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
