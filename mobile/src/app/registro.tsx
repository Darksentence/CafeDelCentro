import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, CafeBrand, Field, Notice, Page } from "@/components/ui";
import { useSession } from "@/context/SessionContext";
import { registrarCliente } from "@/services/api";
import { colors } from "@/theme";

export default function RegisterScreen() {
  const { iniciarSesionLocal } = useSession();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const usuario = await registrarCliente(nombre.trim(), email.trim(), password);
      await iniciarSesionLocal(usuario);
      router.replace("/(tabs)");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos crear tu cuenta. Prueba de nuevo.");
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
        {error ? <Notice>{error}</Notice> : null}
        <AppButton
          title="Listo, crear cuenta"
          onPress={submit}
          loading={loading}
          disabled={!nombre.trim() || !email.trim() || password.length < 6}
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
  helper: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
