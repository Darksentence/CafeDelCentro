# Café del Centro

Proyecto académico para una cafetería que incluye una aplicación web con Next.js y una app móvil con React Native y Expo. Este avance se limita a **Etapa 3, Foro 1**.

## Qué contiene

- Sitio web para consultar el menú, iniciar sesión, registrarse y administrar pedidos.
- App móvil con bienvenida, inicio de sesión, registro, inicio, menú, carrito, pedidos y perfil.
- API de Next.js compartida por la web y la app móvil.
- Guía del alcance, decisiones de interfaz, propuesta de frames y pruebas de Foro 1 en [`docs/ETAPA3_FORO1.md`](docs/ETAPA3_FORO1.md).

La app móvil reutiliza la identidad visual de la web. El repositorio no incluye el archivo ni el enlace del diseño original de Figma; por eso, la guía documenta frames propuestos que aún deben cotejarse con el diseño final del equipo.

## Requisitos

- Node.js y npm instalados.
- Expo Go en el teléfono, o un emulador Android configurado, para probar la app de forma nativa.
- El teléfono y la computadora en la misma red Wi-Fi si se usa un teléfono físico.

Comprueba que Node.js y npm estén disponibles:

```powershell
node --version
npm --version
```

## Iniciar el proyecto

La web/API y Expo son dos procesos distintos. Mantén abiertas dos terminales mientras pruebas la app móvil.

### 1. Iniciar la web y la API

Desde la carpeta principal del repositorio:

```powershell
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el sitio. No cierres esta terminal: la app móvil necesita que la API siga activa.

### 2. Iniciar la app móvil

Abre otra terminal en la carpeta principal del repositorio y ejecuta:

```powershell
Set-Location .\mobile
npm install
npm run start
```

Cuando aparezca el código QR, escanéalo con Expo Go o selecciona un emulador disponible. Para abrir una vista en el navegador, ejecuta `npm run web` desde `mobile`; las solicitudes a la API en el navegador pueden verse afectadas porque la API actual no configura CORS para ese origen. Para probar el flujo completo, se recomienda Expo Go o un emulador nativo.

## Conectar un teléfono físico con la API

En un teléfono, `localhost` apunta al propio teléfono, no a la computadora. Configura la IP local de la computadora para que la app pueda acceder a Next.js:

1. En PowerShell, ejecuta `ipconfig` y busca la dirección IPv4 del adaptador Wi-Fi activo.
2. Crea el archivo `mobile/.env.local` con esta línea, sustituyendo la IP de ejemplo por la dirección IPv4 real:

   ```text
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:3000/api
   ```

3. Comprueba que teléfono y computadora estén en la misma red y que el firewall permita la conexión local.
4. Detén y vuelve a iniciar Expo para que lea la variable.

Valores predeterminados si no configuras la variable:

| Entorno | Dirección usada |
| --- | --- |
| Emulador Android | `http://10.0.2.2:3000/api` |
| Simulador iOS o navegador local | `http://localhost:3000/api` |
| Teléfono físico | Configura la IP local en `mobile/.env.local` |

No subas `mobile/.env.local` al repositorio. Si no se conecta, primero comprueba que `npm run dev` siga activo y que la dirección configurada termine en `/api`.

## Funciones móviles incluidas

- Inicio de sesión y registro de clientes.
- Menú con categorías, tamaños y precios.
- Carrito con edición de cantidades y confirmación de pedido.
- Historial de pedidos para clientes.
- Vista administrativa de pedidos y actualización de su estado.
- Perfil, puntos de fidelidad y cierre de sesión.
- Estados de carga, error y contenido vacío en las pantallas correspondientes.

## API utilizada por la app móvil

La app usa las rutas existentes; no agrega un backend paralelo.

| Operación | Ruta |
| --- | --- |
| Iniciar sesión | `POST /api/auth/login` |
| Registrar cliente | `POST /api/auth/registro` |
| Consultar productos | `GET /api/productos` |
| Crear pedido | `POST /api/pedidos` |
| Consultar pedidos | `GET /api/pedidos` |
| Consultar pedidos de un cliente | `GET /api/pedidos?usuarioId={id}` |
| Actualizar estado del pedido | `PUT /api/pedidos/{id}` |

## Datos y persistencia

**No hace falta iniciar una base de datos.** En este avance, usuarios, productos y pedidos se gestionan en arreglos en memoria del servidor. El registro y los pedidos pueden probarse mientras la API está activa, pero los cambios se pierden al reiniciar el servidor. El perfil de sesión móvil se guarda localmente en el dispositivo; no se guarda la contraseña allí.

Este almacenamiento y la autenticación actual son solo para demostración académica, no para manejar información real ni para publicar el sistema como producto de producción.

## Comprobaciones

En la carpeta principal, para revisar la web:

```powershell
npm run lint
npm run build
```

En `mobile`, para revisar la app móvil:

```powershell
npm run lint
npm run typecheck
npx expo export --platform android
npx expo export --platform web
```

La prueba manual recomendada es: iniciar sesión o registrarse, filtrar el menú, elegir tamaño y añadir productos, cambiar cantidades en el carrito, confirmar un pedido, revisar el historial y cerrar sesión. Para validar administración, inicia sesión con una cuenta de ese rol y cambia el estado de un pedido.

## Alcance de esta entrega

Este README describe únicamente el trabajo de **Etapa 3, Foro 1**. Firebase, Firestore, inicio de sesión con Google y el contenido de foros posteriores no forman parte de este avance.
## Requerimiento de entrega
Acontinuacion se presentan los links de la documentacion requerida y de video requerido para Etapa 3, Foro 1, copiar y pegar link en un navegador.
link documentacion : https://1drv.ms/w/c/2c4431c3aec74789/IQBvSHgTzLGnTYhV34YC_ly3AbI1JInwK_kRbpse_uvFmQY?e=o4kfTN
link video : https://youtu.be/oodoMb9COwE?feature=shared
