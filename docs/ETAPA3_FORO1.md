# Etapa 3 · Foro 1 — Avance móvil con React Native

Este avance cubre únicamente el Foro 1 de la Etapa 3. La rúbrica evaluada solicita pantallas React Native coherentes con UX/UI en Figma, funcionamiento de autenticación y del módulo principal, y documentación que explique cómo React Native y Figma se aplican al proyecto (Ruta de aprendizaje DPS941 CII 2026, pp. 11–12).

## Alcance de este avance

- Aplicación móvil independiente en mobile/, construida con React Native y Expo.
- Inicio de sesión y registro conectados a las rutas existentes de la aplicación.
- Menú de bebidas con filtros, tamaños y precios.
- Carrito, confirmación de pedidos, historial y puntos de fidelidad.
- Vista de pedidos administrativos con avance de estado.
- Perfil y cierre de sesión.
- Navegación inferior y controles reutilizables.

Firebase, Firestore, autenticación con Google y cualquier contenido del Foro 2 quedan fuera de este avance.

## Decisiones de UX/UI y su relación con Figma

El repositorio no contiene un archivo ni un enlace a los mockups originales de Figma. Por eso, esta implementación mantiene la identidad que ya existe en la web y documenta los frames móviles para que puedan trasladarse a Figma y cotejarse con el equipo.

### Sistema visual compartido

| Token | Valor | Aplicación |
| --- | --- | --- |
| Crema | #F8F3E9 | Fondo general |
| Papel | #FFFDF8 | Tarjetas, formularios y superficies |
| Tinta | #2E2923 | Texto principal |
| Café | #B77945 | Acciones primarias y acentos |
| Café oscuro | #6B452C | Navegación activa y títulos destacados |
| Salvia | #9AA580 | Acentos secundarios |
| Línea | #E9DFD1 | Bordes y divisores |

Los colores de origen están definidos en app/globals.css y se centralizan para React Native en mobile/src/theme.ts.

### Frames propuestos para Figma

Usar frames móviles de 390 × 844 px, auto layout vertical, margen lateral de 22 px, espaciado base de 8 px y radios amplios en tarjetas y botones. Crear variantes para carga, error, estado vacío y éxito donde correspondan.

| Frame | Pantalla | Contenido y transición |
| --- | --- | --- |
| 01 | Bienvenida | Marca, propuesta de valor, ilustración de taza, acceso y registro |
| 02 | Inicio de sesión | Correo, contraseña, error de validación y acceso al registro |
| 03 | Registro | Nombre, correo, contraseña y confirmación de cuenta |
| 04 | Inicio | Saludo, puntos, acceso al menú y resumen del carrito |
| 05 | Menú | Categorías, tarjeta de bebida, selector de tamaño, precio y añadir |
| 06 | Carrito | Cantidades, subtotal, total, confirmación y pedido recibido |
| 07 | Pedidos | Fecha, productos, total y estado; acciones administrativas según rol |
| 08 | Perfil | Datos de cuenta, puntos y cierre de sesión |

### Relación entre diseño y componentes

- View, Text, Pressable, TextInput, ScrollView y ActivityIndicator construyen la interfaz con componentes nativos.
- Page, AppButton, Field, Surface y ProductCard se reutilizan entre pantallas para mantener consistencia.
- Expo Router separa acceso/registro de las pestañas autenticadas; las cinco pestañas siguen el recorrido de compra.
- Las tarjetas del menú exponen tamaño y precio antes de añadir, evitando sorpresas en el total.
- Los estados de carga, error y vacío se muestran cerca del contenido afectado; el pedido confirmado ofrece un siguiente paso visible.

## Integración con el proyecto existente

La app consume el backend Next.js que ya existe en la raíz. No duplica entidades ni inventa endpoints:

| Función móvil | Ruta existente |
| --- | --- |
| Inicio de sesión | POST /api/auth/login |
| Registro de cliente | POST /api/auth/registro |
| Catálogo | GET /api/productos |
| Crear pedido | POST /api/pedidos |
| Historial del cliente | GET /api/pedidos?usuarioId={id} |
| Pedidos administrativos | GET /api/pedidos |
| Cambiar estado | PUT /api/pedidos/{id} |

El perfil de sesión se guarda en AsyncStorage; no se guarda la contraseña. El backend actual mantiene usuarios, productos y pedidos en arreglos en memoria, por lo que los cambios se reinician al detener el servidor. La persistencia remota no forma parte del Foro 1.

## Prueba manual de aceptación

1. Ejecutar el backend Next.js y abrir la app Expo en un dispositivo o emulador.
2. Registrar una cuenta de cliente o iniciar sesión.
3. Abrir el menú, cambiar categoría y tamaño, y añadir bebidas.
4. Modificar cantidades, confirmar un pedido y comprobar el mensaje de éxito.
5. Revisar que el pedido aparezca en el historial y que los puntos se actualicen.
6. Iniciar sesión como administración y comprobar que los pedidos pueden avanzar de pendiente a listo y de listo a entregado.
7. Cerrar sesión y verificar el retorno a bienvenida.

Antes de entregar, completar esta evidencia con capturas reales de bienvenida, menú, carrito y pedidos ejecutándose en dispositivo o emulador, y cotejar cada una con los frames finales de Figma.
