"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerPedidos } from "@/services/pedidosService";

type OrderItem = { nombre?: string; nombreProducto?: string; cantidad?: number; precio?: number };
type Order = { id: number; usuarioId?: number; items?: OrderItem[]; total?: number; estado?: string; fecha?: string };
type RankingItem = { name: string; units: number; amount: number; color: string };

const COLORS = ["#E45736", "#F2C14E", "#9AB6A5", "#88AEB5", "#D9826B"];

function CoffeeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Z" /><path d="M17 10h2a3 3 0 0 1 0 6h-2M8 4c0 1 .7 1.3.7 2.2M12 3c0 1 .7 1.3.7 2.2" /></svg>;
}

function DashboardIcon({ type }: { type: "overview" | "orders" | "products" | "customers" | "chart" | "settings" }) {
  const content = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    orders: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    products: <><path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Z" /><path d="M17 10h2a3 3 0 0 1 0 6h-2" /></>,
    customers: <><path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20" /><circle cx="10" cy="7" r="3.5" /><path d="M16 5a3.5 3.5 0 0 1 0 6.4M19.5 20v-1.4a4.5 4.5 0 0 0-3-4.2" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 5v2M12 17v2M5 12h2M17 12h2" /></>,
  }[type];

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{content}</svg>;
}

function money(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function shortProductName(name: string) {
  return name.replace(" de la Casa", "").replace(" de Especialidad", "");
}

export default function DashboardPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<{ nombre?: string; rol?: string } | null>(null);
  const [active, setActive] = useState("La casa");
  const [orders, setOrders] = useState<Order[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      router.push("/login");
      return;
    }

    const datos = JSON.parse(usuarioGuardado);

    if (datos.rol !== "admin") {
      router.push("/menu");
      return;
    }

    setUsuario(datos);
  }, [router]);

  useEffect(() => {
    obtenerPedidos()
      .then((data: Order[]) => setOrders(Array.isArray(data) ? data : []))
      .catch((e: Error) => setError(e.message || "No pudimos cargar los pedidos. Inténtalo de nuevo."))
      .finally(() => setCargando(false));
  }, []);

  const ranking = useMemo(() => {
    const totals = new Map<string, { units: number; amount: number }>();
    orders.forEach((order) => order.items?.forEach((item) => {
      const name = item.nombre ?? item.nombreProducto ?? "Producto";
      const current = totals.get(name) ?? { units: 0, amount: 0 };
      current.units += item.cantidad ?? 1;
      current.amount += (item.cantidad ?? 1) * (item.precio ?? 0);
      totals.set(name, current);
    }));
    return Array.from(totals.entries())
      .sort((a, b) => b[1].units - a[1].units)
      .slice(0, 5)
      .map(([name, values], index) => ({ ...values, name, color: COLORS[index] ?? "#b77945" })) as RankingItem[];
  }, [orders]);

  const totalSales = orders.reduce((sum, order) => sum + (order.total ?? 0), 0);
  const totalOrders = orders.length;
  const averageTicket = totalOrders ? totalSales / totalOrders : 0;
  const pendientes = orders.filter((order) => order.estado === "pendiente").length;
  const listos = orders.filter((order) => order.estado === "listo").length;
  const entregados = orders.filter((order) => order.estado === "entregado").length;
  const clientesUnicos = new Set(orders.map((order) => order.usuarioId)).size;
  const totalUnidades = ranking.reduce((sum, item) => sum + item.units, 0);
  const lider = ranking[0];
  const porcentajeLider = totalUnidades ? Math.round((lider?.units ?? 0) / totalUnidades * 100) : 0;
  const maxUnidades = ranking.length ? Math.max(...ranking.map((item) => item.units)) : 1;

  const ultimosDias = useMemo(() => {
    const dias = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const clave = fecha.toISOString().slice(0, 10);
      const cantidad = orders.filter((order) => (order.fecha ?? "").slice(0, 10) === clave).length;
      dias.push({
        etiqueta: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][fecha.getDay()],
        cantidad,
        esHoy: i === 0,
      });
    }
    return dias;
  }, [orders]);

  const maxDia = Math.max(1, ...ultimosDias.map((dia) => dia.cantidad));
  const pedidosSemana = ultimosDias.reduce((sum, dia) => sum + dia.cantidad, 0);

  const iniciales = (usuario?.nombre ?? "")
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fechaHoy = new Date().toLocaleDateString("es-SV", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    router.push("/login");
  }

  if (!usuario) {
    return null;
  }

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="/"><span><CoffeeIcon /></span><strong>Café del Centro</strong><small>Gestión de la casa</small></a>
        <div className="dashboard-menu-label">EL DÍA A DÍA</div>
        <nav className="dashboard-nav" aria-label="Navegación del panel">
          <button className={active === "La casa" ? "active" : ""} onClick={() => setActive("La casa")}><DashboardIcon type="overview" /><span>La casa</span></button>
          <button onClick={() => router.push("/menu")}><DashboardIcon type="orders" /><span>Pedidos</span>{pendientes > 0 && <b>{pendientes}</b>}</button>
          <button onClick={() => showNotice("La carta de productos estará disponible más adelante.")}><DashboardIcon type="products" /><span>La carta</span></button>
        </nav>
        <div className="dashboard-menu-label dashboard-report-label">NÚMEROS</div>
        <button className={`dashboard-nav-single ${active === "Tendencias" ? "active" : ""}`} onClick={() => setActive("Tendencias")}><DashboardIcon type="chart" /><span>Tendencias</span></button>
        <div className="dashboard-sidebar-bottom">
          <button className="dashboard-nav-single" onClick={cerrarSesion}><DashboardIcon type="settings" /><span>Salir de mi cuenta</span></button>
          <div className="dashboard-user"><span>{iniciales}</span><div><strong>{usuario.nombre}</strong><small>Administrador</small></div></div>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
            <div className="dashboard-breadcrumb"><span>La cafetería</span><i>/</i><strong>{active}</strong></div>
          <div className="dashboard-top-actions">
            <span className="dashboard-updated"><i /> {cargando ? "Ponemos todo en su sitio..." : `${totalOrders} pedidos en la casa`}</span>
            <span className="dashboard-top-avatar">{iniciales}</span>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-heading">
            <div>
              <span className="dashboard-kicker">{fechaHoy}</span>
              <h1>Así va la casa</h1>
              <p>Un vistazo a los pedidos y a lo que más se está disfrutando.</p>
            </div>
          </div>

          {error && <p style={{ color: "#a33", marginBottom: "16px" }}>{error}</p>}

          <div className="dashboard-metrics">
            <article><span className="metric-badge metric-brown"><DashboardIcon type="chart" /></span><div><small>VENTAS REGISTRADAS</small><strong>{money(totalSales)}</strong></div></article>
            <article><span className="metric-badge metric-peach"><DashboardIcon type="orders" /></span><div><small>PEDIDOS RECIBIDOS</small><strong>{totalOrders}</strong></div></article>
            <article><span className="metric-badge metric-sage"><DashboardIcon type="products" /></span><div><small>PROMEDIO POR PEDIDO</small><strong>{money(averageTicket)}</strong></div></article>
            <article><span className="metric-badge metric-sand"><DashboardIcon type="customers" /></span><div><small>CLIENTES ATENDIDOS</small><strong>{clientesUnicos}</strong></div></article>
          </div>

          <div className="dashboard-panels">
            <section className="dashboard-panel dashboard-ranking">
              <div className="dashboard-panel-heading">
                <div><h2>Lo que más sale</h2><p>Las bebidas que nuestros clientes eligen una y otra vez.</p></div>
              </div>
              <div className="ranking-legend"><span><i className="legend-brown" /> Bebidas servidas</span></div>
              {ranking.length === 0 ? (
                <p style={{ padding: "24px 0", color: "var(--muted)" }}>Aún no llegan pedidos. Cuando llegue el primero, lo verás aquí.</p>
              ) : (
                <>
                  <div className="ranking-chart">
                    {ranking.map((product, index) => (
                      <div className="ranking-column" key={product.name}>
                        <strong>{product.units}</strong>
                        <div className="ranking-bar-track">
                          <i style={{ height: `${Math.max(14, (product.units / maxUnidades) * 100)}%`, backgroundColor: product.color }} />
                        </div>
                        <span>{shortProductName(product.name)}</span>
                        <small>{index + 1}º lugar</small>
                      </div>
                    ))}
                  </div>
                  <div className="ranking-foot">
                    <span>La bebida favorita representa el <strong>{porcentajeLider}%</strong> de lo servido</span>
                  </div>
                </>
              )}
            </section>

            <section className="dashboard-panel dashboard-sales">
              <div className="dashboard-panel-heading">
                <div><h2>Cómo van los pedidos</h2><p>Un vistazo rápido a lo que está pasando en la barra.</p></div>
              </div>
              <div className="ranking-chart">
                <div className="ranking-column"><strong>{pendientes}</strong><div className="ranking-bar-track"><i style={{ height: `${Math.max(14, (pendientes / Math.max(1, totalOrders)) * 100)}%`, backgroundColor: "#F2C14E" }} /></div><span>Por preparar</span></div>
                <div className="ranking-column"><strong>{listos}</strong><div className="ranking-bar-track"><i style={{ height: `${Math.max(14, (listos / Math.max(1, totalOrders)) * 100)}%`, backgroundColor: "#88AEB5" }} /></div><span>Listo</span></div>
                <div className="ranking-column"><strong>{entregados}</strong><div className="ranking-bar-track"><i style={{ height: `${Math.max(14, (entregados / Math.max(1, totalOrders)) * 100)}%`, backgroundColor: "#9AB6A5" }} /></div><span>Entregado</span></div>
              </div>
              <div className="ranking-foot">
                <span>Hasta ahora: <strong>{money(totalSales)}</strong></span>
              </div>
            </section>

            <section className="dashboard-panel dashboard-week">
              <div className="dashboard-panel-heading">
                <div><h2>El pulso de la semana</h2><p>Pedidos que llegaron en los últimos siete días.</p></div>
              </div>
              <div className="week-visual">
                <div className="week-bars">
                  {ultimosDias.map((dia, index) => (
                    <div key={index} className={dia.esHoy ? "today" : ""}>
                      <span style={{ height: `${Math.max(6, (dia.cantidad / maxDia) * 100)}%` }} />
                      <small>{dia.etiqueta}</small>
                    </div>
                  ))}
                </div>
                <div className="week-result">
                  <span>Últimos siete días</span>
                  <strong>{pedidosSemana} <small>pedidos</small></strong>
                </div>
              </div>
            </section>

            <section className="dashboard-panel dashboard-insight">
              <span className="insight-symbol">✦</span>
              <div>
                    <small>LO MÁS QUERIDO</small>
                {lider ? (
                  <>
                    <h2>{lider.name} va ganando</h2>
                    <p>Ya suma {lider.units} unidades: el <strong>{porcentajeLider}%</strong> de lo servido y {money(lider.amount)} en ventas.</p>
                  </>
                ) : (
                  <>
                    <h2>La historia recién empieza</h2>
                    <p>Cuando lleguen los primeros pedidos, aquí veremos cuál se convierte en el favorito de la casa.</p>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
        {notice && <div className="dashboard-toast">✓ {notice}</div>}
      </section>
    </main>
  );
}
