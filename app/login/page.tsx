"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  login,
  loginConGoogle,
  mensajeAuth,
  rutaDeUsuario,
  suscribirseSesion
} from "@/services/authService";

type SessionUser = { id: string; rol?: string };

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);

  useEffect(() => {
    const unsubscribe = suscribirseSesion((datos: SessionUser | null) => {
      if (datos) router.replace(rutaDeUsuario(datos));
    });
    return unsubscribe;
  }, [router]);

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();

    setMensaje("");
    setCargando(true);

    try {
      const datos = await login(email, password);
      router.push(rutaDeUsuario(datos));
    } catch (error: unknown) {
      setMensaje(mensajeAuth(error));
    } finally {
      setCargando(false);
    }
  };

  const iniciarConGoogle = async () => {
    setMensaje("");
    setCargandoGoogle(true);
    try {
      const datos = await loginConGoogle();
      router.push(rutaDeUsuario(datos));
    } catch (error: unknown) {
      setMensaje(mensajeAuth(error));
    } finally {
      setCargandoGoogle(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--paper)",
          padding: "32px",
          borderRadius: "24px",
          border: "1px solid var(--line)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "8px", color: "var(--brown-dark)" }}>
          Café del Centro
        </h1>

        <p style={{ textAlign: "center", marginBottom: "28px", color: "var(--muted)" }}>
          Qué bueno que volviste. Entra para pedir algo rico.
        </p>

        <form onSubmit={iniciarSesion}>
          <label>Correo electrónico</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border: "1px solid var(--line)",
              borderRadius: "14px",
              boxSizing: "border-box",
            }}
          />

          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribe tu contraseña"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border: "1px solid var(--line)",
              borderRadius: "14px",
              boxSizing: "border-box",
            }}
          />

          {mensaje && (
            <p style={{ color: "#a33", marginBottom: "16px", textAlign: "center" }}>
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "999px",
              background: "var(--brown)",
              color: "white",
              cursor: cargando ? "not-allowed" : "pointer",
              fontSize: "16px",
              opacity: cargando ? 0.7 : 1,
            }}
          >
            {cargando ? "Un momento..." : "Continuar"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "18px 0" }}>
          <span style={{ flex: 1, height: "1px", background: "var(--line)" }} />
          <span style={{ color: "var(--muted)", fontSize: "13px" }}>o</span>
          <span style={{ flex: 1, height: "1px", background: "var(--line)" }} />
        </div>

        <button
          type="button"
          onClick={iniciarConGoogle}
          disabled={cargando || cargandoGoogle}
          style={{
            width: "100%",
            padding: "13px",
            border: "1px solid var(--brown)",
            borderRadius: "999px",
            background: "white",
            color: "var(--brown-dark)",
            cursor: cargando || cargandoGoogle ? "not-allowed" : "pointer",
            fontSize: "16px",
            opacity: cargandoGoogle ? 0.7 : 1,
          }}
        >
          {cargandoGoogle ? "Abriendo Google..." : "Continuar con Google"}
        </button>

        <p style={{ textAlign: "center", marginTop: "22px", color: "var(--muted)" }}>
          ¿Aún no tienes tu cuenta?
        </p>

        <button
          type="button"
          onClick={() => router.push("/registro")}
          style={{
            width: "100%",
            padding: "11px",
            border: "1px solid var(--brown)",
            borderRadius: "999px",
            background: "transparent",
            color: "var(--brown-dark)",
            cursor: "pointer",
          }}
        >
          Únete a la mesa
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "11px",
            border: "none",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Ir al inicio
        </button>
      </div>
    </main>
  );
}
