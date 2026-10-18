# Café del Centro — aplicación móvil

Aplicación desarrollada con React Native, Expo y Expo Router para **Etapa 3, Foro 1**. Consume la API Next.js que está en la carpeta principal del repositorio.

Para la descripción general del proyecto, las rutas de API y los comandos de verificación, consulta el [README principal](../README.md). La rúbrica, las decisiones de UX/UI y la lista de pruebas están en [`docs/ETAPA3_FORO1.md`](../docs/ETAPA3_FORO1.md).

## Requisitos

- Node.js y npm instalados.
- Expo Go instalado en el teléfono, o un emulador Android disponible.
- La web/API de Next.js activa en la computadora para iniciar sesión, cargar el menú y trabajar con pedidos.

## Ejecutar en Windows

### Terminal 1: iniciar la web/API

Desde la carpeta principal del repositorio:

```powershell
npm install
npm run dev
```

La API queda disponible en `http://localhost:3000/api`. Mantén esta terminal abierta.

### Terminal 2: iniciar Expo

Desde la carpeta principal, abre una segunda terminal y ejecuta:

```powershell
Set-Location .\mobile
npm install
npm run start
```

Escanea el código QR con Expo Go o abre el proyecto en un emulador. Para mostrar la interfaz en el navegador, usa `npm run web`; el navegador puede bloquear las llamadas al backend porque la API actual no tiene CORS configurado para Expo Web. Para probar autenticación y pedidos, usa Expo Go o un emulador nativo.

## Dirección del servidor según el dispositivo

La app lee la variable `EXPO_PUBLIC_API_BASE_URL`. En Expo Go conectado por la red local, intenta detectar la IP privada del equipo que sirve Expo y usarla también para la API. Si no encuentra una IP local, usa estos valores:

| Entorno | Dirección predeterminada |
| --- | --- |
| Emulador Android | `http://10.0.2.2:3000/api` |
| Simulador iOS | `http://localhost:3000/api` |
| Navegador en la misma computadora | `http://localhost:3000/api` |
| Teléfono físico | Debes indicar la IP local de la computadora |

### Configurar un teléfono físico

1. Conecta el teléfono y la computadora a la misma red Wi-Fi.
2. En PowerShell, ejecuta `ipconfig` y localiza la IPv4 del adaptador Wi-Fi conectado.
3. Crea `mobile/.env.local` y agrega, reemplazando la IP de ejemplo por la que encontraste:

   ```text
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:3000/api
   ```

4. Asegúrate de que el firewall de Windows permita conexiones locales a la computadora.
5. Detén Expo y vuelve a ejecutar `npm run start` para que cargue la nueva configuración.

No publiques ni compartas `.env.local`. Está pensado para la configuración local del dispositivo.

### Si abres la app desde un Codespace

El túnel de Expo solo conecta el teléfono con Metro; no hace que la API de Next.js sea accesible. Inicia Next.js en el Codespace y abre el puerto 3000 desde la pestaña **Ports**. Configura `EXPO_PUBLIC_API_BASE_URL` con la dirección HTTPS reenviada de ese puerto y añade `/api` al final. Si el proyecto ya tiene una URL pública de despliegue, también puedes usarla terminada en `/api`. Después reinicia Expo para que lea la variable. No uses `localhost` ni `10.0.2.2` en un teléfono físico.

## Pantallas

- **Bienvenida:** permite ir al inicio de sesión o al registro.
- **Inicio de sesión y registro:** usan las rutas de autenticación que ya existen en la API.
- **Inicio:** ofrece accesos al menú y al flujo de compra.
- **Menú:** muestra productos y permite filtrar, elegir tamaño y añadir al carrito.
- **Carrito:** permite revisar los artículos y confirmar el pedido.
- **Pedidos:** muestra el historial del cliente; para administración permite revisar pedidos y avanzar su estado.
- **Perfil:** presenta la cuenta y permite cerrar sesión.

## Datos, sesión y límites

No se necesita iniciar una base de datos para este avance. La API maneja usuarios, productos y pedidos en memoria; los registros y pedidos de prueba se pierden cuando se reinicia el servidor Next.js. El perfil de sesión se conserva localmente con AsyncStorage y no se guarda la contraseña.

Esta autenticación y los datos son para demostración académica. No se deben usar para cuentas reales ni para producción. Firebase, Firestore y el inicio de sesión de Google están fuera del alcance de este Foro 1.

## Pruebas

Desde esta carpeta (`mobile`):

```powershell
npm run lint
npm run typecheck
npx expo export --platform android
npx expo export --platform web
```

### Recorrido manual recomendado

1. Confirma que `npm run dev` siga activo en la terminal de la carpeta principal.
2. Abre Expo Go o el emulador y espera a que cargue la app.
3. Registra una cuenta de cliente o inicia sesión.
4. Abre el menú, cambia el filtro y el tamaño, y añade un producto.
5. Cambia la cantidad desde el carrito y confirma el pedido.
6. Revisa que aparezca en pedidos y que se actualicen los puntos.
7. Cierra sesión y verifica que la app vuelva a la pantalla de bienvenida.
8. Para probar las acciones administrativas, inicia sesión con una cuenta de administración y cambia el estado de un pedido.

Antes de entregar, toma capturas de la app ejecutándose en un teléfono o emulador y compáralas con los frames finales de Figma. El repositorio no contiene todavía un enlace o archivo del diseño original de Figma.
