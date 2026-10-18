"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerProductos } from "@/services/productosService";

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  disponible: boolean;
  precios?: Record<string, number>;
};

type Usuario = { id: number; nombre: string; rol: string };

function CoffeeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Z" /><path d="M17 10h2a3 3 0 0 1 0 6h-2M8 4c0 1 .7 1.3.7 2.2M12 3c0 1 .7 1.3.7 2.2" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function formatPrice(product: Product) {
  const price = product.precios?.["16oz"] ?? 0;
  return `$${price.toFixed(2)}`;
}

export default function CustomerHome() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("usuario");
      if (guardado) setUsuario(JSON.parse(guardado));
    } catch {
      localStorage.removeItem("usuario");
    }
  }, []);

  useEffect(() => {
    obtenerProductos()
      .then((data: Product[]) => {
        setProducts(Array.isArray(data) ? data.filter((product) => product.disponible) : []);
      })
      .catch((e: Error) => setError(e.message || "No pudimos traer la carta. Inténtalo de nuevo."))
      .finally(() => setCargando(false));
  }, []);

  const destacados = products.slice(0, 4);

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  function irAMiZona() {
    router.push(usuario?.rol === "admin" ? "/dashboard" : "/menu");
  }

  return (
    <main className="storefront">
      <header className="store-header">
        <a className="store-brand" href="#inicio" aria-label="Café del Centro, ir al inicio"><span className="brand-cup"><CoffeeIcon /></span><span><strong>Café del Centro</strong><small>Café de barrio · San Salvador</small></span></a>
        <nav className="store-nav" aria-label="Secciones de la cafetería"><a href="#menu">La carta</a><a href="#historia">La casa</a><a href="#contacto">Encuéntranos</a></nav>
        <div className="store-actions">
          {usuario ? (
            <>
              <button className="cart-button" onClick={irAMiZona}>
                {usuario.rol === "admin" ? "Ir al panel" : "Mi cuenta"}
              </button>
              <button className="cart-button" onClick={cerrarSesion}>Salir</button>
            </>
          ) : (
            <>
              <a className="dashboard-link" href="/registro">Únete a la mesa</a>
              <button className="cart-button" onClick={() => router.push("/login")}>Entrar</button>
            </>
          )}
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy"><span className="section-kicker">UN RINCÓN EN EL CENTRO HISTÓRICO</span><h1>Aquí el día<br /><em>va mejor.</em></h1><p>Café recién hecho, algo rico para acompañar y una mesa que siempre tiene espacio para ti.</p><div className="hero-actions"><a className="primary-button" href="/menu">Descubre la carta <ArrowIcon /></a><a className="quiet-link" href="#historia">Así nació este lugar <ArrowIcon /></a></div></div>
        <div className="hero-art" aria-label="Ilustración de una taza de café"><div className="sun-disc" /><div className="steam steam-one" /><div className="steam steam-two" /><div className="cup-illustration"><div className="cup-top"><span /></div><div className="cup-body" /><div className="cup-handle" /></div><span className="art-caption">TU PAUSA<br /><strong>EMPIEZA AQUÍ</strong></span></div>
        <div className="hero-foot"><span>Centro Histórico · San Salvador</span><span className="scroll-hint"><i /> Un poco más abajo</span><span>Lun — Sáb · 7:00 AM — 6:00 PM</span></div>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-intro">
          <div><span className="section-kicker">LO QUE SALE DE NUESTRA BARRA</span><h2>Algo rico<br /><em>te espera.</em></h2></div>
          <p>Espresso, bebidas frías y clásicos de la casa. Elige lo que se te antoja; lo preparamos al momento.</p>
        </div>

        {cargando && <p style={{ color: "var(--muted)", padding: "24px 0" }}>Un momento, estamos armando la carta…</p>}
        {error && <p style={{ color: "#a33", padding: "24px 0" }}>{error}</p>}
        {!cargando && !error && destacados.length === 0 && (
          <p style={{ color: "var(--muted)", padding: "24px 0" }}>Estamos renovando la carta. Vuelve pronto.</p>
        )}

        <div className="menu-grid">
          {destacados.map((product, index) => (
            <article className={`menu-card card-${index + 1}`} key={product.id}>
              <div className="card-number">0{index + 1}</div>
              <div className="card-icon"><CoffeeIcon /></div>
              <span className="product-category">{product.categoria}</span>
              <h3>{product.nombre}</h3>
              <p>{product.descripcion}</p>
              <div className="card-bottom">
                <strong>{formatPrice(product)}</strong>
                <a href="/menu" aria-label={`Pedir ${product.nombre}`}><ArrowIcon /></a>
              </div>
            </article>
          ))}
        </div>

        <a className="outline-button" href="/menu">Ver la carta completa <ArrowIcon /></a>
      </section>

      <section className="story-section" id="historia"><div className="story-visual"><div className="story-stamp">CD<br /><small>2018</small></div><span>UN BUEN LUGAR PARA HACER UNA PAUSA</span></div><div className="story-copy"><span className="section-kicker">UN POCO DE HISTORIA</span><h2>Un lugar para<br /><em>volver.</em></h2><p>Nacimos con una idea sencilla: servir buen café y hacer que cada visita se sienta cercana. Desde entonces, esta esquina es punto de encuentro para quienes viven, trabajan o pasean por el Centro.</p><a className="quiet-link" href="#contacto">Pasa a saludar <ArrowIcon /></a></div></section>

      <section className="contact-section" id="contacto"><div><span className="section-kicker">¿TE GUARDAMOS UN LUGAR?</span><h2>Tu próxima pausa<br /><em>empieza aquí.</em></h2><p>Para grupos, celebraciones o simplemente para saludarnos, escríbenos. Nosotros ponemos el café.</p></div><a className="primary-button" href="mailto:hola@cafedelcentro.com">Escríbenos <ArrowIcon /></a></section>

      <footer className="store-footer"><a className="store-brand" href="#inicio"><span className="brand-cup"><CoffeeIcon /></span><span><strong>Café del Centro</strong><small>Hecho para volver</small></span></a><span>© 2026 · Café del Centro, San Salvador</span><div><a href="/menu">La carta</a><a href="#contacto">Encuéntranos</a><a href="/login">Mi cuenta</a></div></footer>
    </main>
  );
}
