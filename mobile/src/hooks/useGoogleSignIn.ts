import * as WebBrowser from "expo-web-browser";
import { ResponseType, type AuthSessionResult } from "expo-auth-session";
import { useIdTokenAuthRequest } from "expo-auth-session/providers/google";
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";
import { iniciarSesionConGoogle, mensajeAuth } from "@/services/firebaseAuth";

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export function useGoogleSignIn(onSuccess?: () => void) {
  const activeClientId =
    Platform.OS === "android"
      ? androidClientId
      : Platform.OS === "ios"
        ? iosClientId
        : webClientId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [request, , promptAsync] = useIdTokenAuthRequest(
    {
      clientId: activeClientId || "missing-google-client-id",
      webClientId,
      androidClientId,
      iosClientId,
      responseType: ResponseType.IdToken,
      selectAccount: true,
    },
    { scheme: "cafedelcentro" }
  );

  const configured = Boolean(webClientId && androidClientId && iosClientId);

  const signIn = useCallback(async () => {
    setError("");
    if (!configured) {
      setError(
        "Faltan los Client ID de Google en mobile/.env.local. Revisa la guía de configuración."
      );
      return;
    }
    if (!request) {
      setError("Google todavía está preparando el inicio de sesión.");
      return;
    }

    setLoading(true);
    try {
      const response: AuthSessionResult = await promptAsync();
      if (response.type !== "success") {
        if (response.type !== "dismiss" && response.type !== "cancel") {
          setError("Google no pudo completar el inicio de sesión.");
        }
        return;
      }
      const idToken = response.params?.id_token;
      if (!idToken) throw new Error("Google no devolvió un token de identidad.");
      await iniciarSesionConGoogle(idToken);
      onSuccess?.();
    } catch (cause) {
      setError(mensajeAuth(cause));
    } finally {
      setLoading(false);
    }
  }, [configured, onSuccess, promptAsync, request]);

  return useMemo(
    () => ({ signIn, loading, error, clearError: () => setError("") }),
    [error, loading, signIn]
  );
}
