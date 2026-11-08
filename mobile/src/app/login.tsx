import { useCallback, useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, CafeBrand, Field, Notice, Page } from "@/components/ui";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import {
  iniciarSesionConEmail,
  mensajeAuth,
  validateEmail,
  validatePassword,
} from "@/services/firebaseAuth";
import { colors } from "@/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onGoogleSuccess = useCallback(() => router.replace("/(tabs)"), []);
  const google = useGoogleSignIn(onGoogleSuccess);

  async function submit() {
    setError("");
    if (!validateEmail(email)) {
      setError("Escribe un correo electrónico válido.");
      return;
    }
    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await iniciarSesionConEmail(email, password);
      router.replace("/(tabs)");
    } catch (cause) {
      setError(mensajeAuth(cause));
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
          placeholder="Seis caracteres o más"
          secureTextEntry
          inputProps={{ autoComplete: "password", textContentType: "password" }}
        />
        {error ? <Notice>{error}</Notice> : null}
        <AppButton
          title="Continuar con correo"
          onPress={submit}
          loading={loading}
          disabled={!email.trim() || !password}
        />
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>
        {google.error ? <Notice>{google.error}</Notice> : null}
        <AppButton
          title="Continuar con Google"
          variant="secondary"
          onPress={google.signIn}
          loading={google.loading}
          disabled={loading}
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
  divider: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { color: colors.muted, fontSize: 12 },
  bottom: { alignItems: "center", gap: 1, paddingTop: 4 },
  helper: { color: colors.muted, fontSize: 13 },
});
