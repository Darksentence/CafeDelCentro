# Etapa 3 - Foro 2: Firebase en React Native

## Alcance

Esta entrega integra Firebase Authentication y Cloud Firestore en la aplicación móvil Expo de Café del Centro. El alcance sigue los requisitos de las páginas 13 a 15 de la Ruta de Aprendizaje DPS941 CII 2026:

1. autenticación por correo electrónico y Google;
2. persistencia de información vinculada al usuario autenticado;
3. módulos de menú, carrito, pedidos, puntos y administración;
4. historial de pedidos almacenados;
5. reglas de seguridad;
6. documentación técnica en formato APA 7.

## Arquitectura implementada

La aplicación móvil usa el SDK modular de Firebase directamente desde Expo. Firebase Authentication mantiene la sesión local con @react-native-async-storage/async-storage, mientras que Firestore guarda los perfiles y pedidos.

| Capa | Implementación |
| --- | --- |
| Identidad | Firebase Authentication: correo/contraseña y Google OAuth |
| Sesión | onAuthStateChanged en SessionContext; el árbol de rutas se protege según la sesión |
| Perfil | usuarios/{uid} con nombre, correo, rol y puntos derivados |
| Pedido | pedidos/{id} con uid, items, total, estado y fecha |
| Catálogo | Módulo local de productos para que el menú funcione sin una segunda API |
| Historial | Consulta Firestore filtrada por uid; el administrador puede consultar todos los pedidos |
| Seguridad | firestore.rules: cliente solo accede a sus propios datos; administrador gestiona estados |

La clave de Firebase para una aplicación web no es un secreto. No se incluyen credenciales reales en el repositorio: se deben proporcionar mediante mobile/.env.local, que está excluido por .gitignore.

## Flujo de autenticación

### Correo electrónico

1. El formulario valida nombre, correo, contraseña de mínimo seis caracteres y confirmación.
2. Firebase crea o valida la cuenta.
3. Se crea o completa el documento usuarios/{uid}.
4. El listener de sesión actualiza SessionContext.
5. Expo Router permite las rutas públicas o privadas según exista un usuario autenticado.

### Google

1. expo-auth-session abre el flujo OAuth de Google.
2. Google devuelve un id_token.
3. GoogleAuthProvider.credential(id_token) crea la credencial de Firebase.
4. signInWithCredential autentica al usuario y reutiliza el mismo flujo de perfil y sesión.

## Modelo de datos

### usuarios/{uid}

    {
      uid: string,
      nombre: string,
      email: string,
      rol: "cliente" | "admin",
      puntos: number,
      fotoUrl: string | null,
      createdAt: timestamp,
      updatedAt: timestamp
    }

El rol nuevo siempre se crea como cliente. Para habilitar administración, el propietario del proyecto debe actualizar manualmente el campo rol de una cuenta en Firestore Console. Las reglas impiden que el cliente se eleve a administrador.

### pedidos/{id}

    {
      uid: string,
      usuarioId: string,
      items: ItemCarrito[],
      total: number,
      estado: "pendiente" | "listo" | "entregado",
      fecha: string,
      createdAt: timestamp
    }

Los puntos se calculan a partir del historial persistido: un punto por cada dólar entero del total de cada pedido. Así, el valor se recupera de Firestore después de cerrar y volver a abrir la aplicación, sin permitir que el cliente edite arbitrariamente su saldo.

## Reglas de seguridad

El archivo firestore.rules implementa estas garantías:

- un usuario autenticado solo lee su perfil y sus pedidos;
- un cliente solo crea pedidos cuyo uid coincide con su sesión;
- un cliente no puede cambiar su rol ni sus puntos;
- solo un usuario cuyo perfil tenga rol: "admin" puede consultar todos los pedidos;
- solo un administrador puede cambiar el estado o eliminar pedidos;
- las solicitudes sin sesión se rechazan.

Las reglas deben desplegarse en Firebase antes de la demostración:

    firebase deploy --only firestore:rules

## Configuración externa indispensable

1. Crear o seleccionar un proyecto en Firebase Console.
2. Habilitar Authentication > Sign-in method > Email/Password y Google.
3. Crear una aplicación web en Project settings y copiar su configuración a mobile/.env.local.
4. Crear los clientes OAuth de Google para web, Android e iOS. Usar el esquema cafedelcentro y los identificadores nativos com.cafedelcentro.mobile.
5. Crear la base de datos Cloud Firestore en modo producción y desplegar firestore.rules.
6. Registrar un usuario y, si se quiere demostrar el panel de administración, cambiar su campo rol a admin desde la consola.

## Pruebas verificadas en el repositorio

Se ejecutan localmente:

    Set-Location mobile
    npm run lint
    npm run typecheck
    npx expo-doctor

La autenticación real de correo, Google y Firestore requiere completar la configuración externa indicada arriba. Mientras esas variables no existan, la app muestra un mensaje de configuración y no se presenta como conectada a Firebase.

## Guion de demostración

1. Registrar un usuario por correo.
2. Cerrar y volver a abrir la app para demostrar persistencia de sesión.
3. Cerrar sesión e ingresar con Google.
4. Agregar bebidas al carrito y crear un pedido.
5. Cerrar y abrir la aplicación; verificar el pedido en Pedidos.
6. Ingresar con la cuenta administradora; verificar que puede cambiar pendiente a listo y después a entregado.
7. Intentar usar una cuenta cliente para leer o editar el pedido de otra cuenta; la regla debe rechazar la operación.

## Referencias

Expo. (s. f.). AuthSession. https://docs.expo.dev/versions/v58.0.0/sdk/auth-session/

Expo. (s. f.). Authentication with OAuth or OpenID providers. https://docs.expo.dev/guides/authentication/

Firebase. (s. f.). Authenticate using Google with JavaScript. https://firebase.google.com/docs/auth/web/google-signin

Firebase. (s. f.). Cloud Firestore security rules. https://firebase.google.com/docs/firestore/security/get-started

Firebase. (s. f.). Authentication state persistence. https://firebase.google.com/docs/auth/web/auth-state-persistence

Sigüenza Campos, A. A. (2026). Ruta de aprendizaje DPS941 CII 2026 [Material de curso].
