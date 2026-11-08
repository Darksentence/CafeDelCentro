import { useCallback, useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, CafeBrand, Field, Notice, Page } from "@/components/ui";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import {
  mensajeAuth,
  registrarConEmail,
  validateEmail,
  validatePassword,
} from "@/services/firebaseAuth";
import { colors } from "@/theme";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onGoogleSuccess = useCallback(() => router.replace("/(tabs)"), []);
  const google = useGoogleSignIn(onGoogleSuccess);

  async function submit() {
    setError("");
    if (nombre.trim().length < 2) {
      setError("Escribe tu nombre para crear la cuenta.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Escribe un correo electrónico válido.");
      return;
    }
    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await registrarConEmail(nombre, email, password);
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
        <Text style={styles.eyebrow}>HAY SITIO PARA TI</Text>
        <Text style={styles.title}>Únete a la mesa</Text>
        <Text style={styles.subtitle}>
          Guarda tus puntos y ten tus pedidos a la mano.
        </Text>
        <Field
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          placeholder="¿Cómo te llamas?"
          inputProps={{ autoCapitalize: "words", textContentType: "name" }}
        />
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
          inputProps={{ autoComplete: "new-password", textContentType: "newPassword" }}
        />
        <Field
          label="Repite la contraseña"
          value={confirmacion}
          onChangeText={setConfirmacion}
          placeholder="Vuelve a escribirla"
          secureTextEntry
          inputProps={{ autoComplete: "new-password", textContentType: "newPassword" }}
        />
        {error ? <Notice>{error}</Notice> : null}
        <AppButton
          title="Listo, crear cuenta"
          onPress={submit}
          loading={loading}
          disabled={
            nombre.trim().length < 2 ||
            !email.trim() ||
            password.length < 6 ||
            !confirmacion
          }
        />
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>
        {google.error ? <Notice>{google.error}</Notice> : null}
        <AppButton
          title="Registrarme con Google"
          variant="secondary"
          onPress={google.signIn}
          loading={google.loading}
          disabled={loading}
        />
        <Text style={styles.helper}>
          Con tu cuenta podrás pedir y revisar cómo va todo.
        </Text>
      </View>
      <AppButton
        title="Ya tengo una cuenta"
        variant="text"
        onPress={() => router.replace("/login")}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
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
  subtitle: { marginTop: -9, color: colors.muted, fontSize: 14, lineHeight: 20 },
  divider: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { color: colors.muted, fontSize: 12 },
  helper: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
