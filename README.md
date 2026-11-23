# Café del Centro

**Proyecto de cátedra — Entrega Final Multiplataforma**  
**Tecnologías:** React · Next.js · React Native · Expo · Firebase Authentication · Cloud Firestore   

## 1. Descripción del proyecto

**Café del Centro** es una solución académica multiplataforma para digitalizar la consulta del menú, la gestión de pedidos y la atención de clientes de una cafetería. Integra una aplicación web desarrollada con **React y Next.js** y una aplicación móvil construida con **React Native y Expo**. Ambas versiones utilizan **Firebase Authentication** para la identidad de los usuarios y **Cloud Firestore** para compartir perfiles y pedidos.

La propuesta busca facilitar la experiencia de compra del cliente y ofrecer al personal administrativo herramientas para consultar y actualizar pedidos. Se mantiene una identidad visual común entre ambas plataformas.

### Problema identificado y solución

La gestión manual de pedidos y la falta de un historial accesible pueden dificultar el seguimiento de compras y la organización del servicio. Café del Centro propone centralizar los pedidos y sus estados en una base de datos compartida, accesible desde la web y la aplicación móvil. **El equipo debe contrastar esta formulación con el problema y los objetivos aprobados en la Etapa 1.**

## 2. Enlaces de la entrega

| Recurso | Enlace o estado |
| --- | --- |
| Repositorio de GitHub : | https://github.com/Darksentence/CafeDelCentro |
| Aplicación web desplegada en Vercel : | https://cafe-del-centro-pya9.vercel.app/login |
| Prototipo y mockups de Figma (Etapa 1) |https://www.figma.com/proto/WcpCQgZSYKtXfmcroyKasO/vistas-mobil?node-id=22-341&p=f&t=21rn7haXBjiyq7vr-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1 |
| Documentación complementaria | [Documento en OneDrive](https://1drv.ms/w/c/2c4431c3aec74789/IQBvSHgTzLGnTYhV34YC_ly3AbI1JInwK_kRbpse_uvFmQY?e=o4kfTN) |
| Video de demostración | [Ver video en YouTube](https://youtu.be/oodoMb9COwE?feature=shared) |
| Integración Firebase  |https://console.firebase.google.com/project/cafedelcentro/overview|
| Licencia Creative Commons | |

## 3. Arquitectura multiplataforma


Café del Centro
├── Aplicación web: React + Next.js
│   ├── Catálogo y navegación
│   ├── Autenticación de clientes
│   └── Pedidos y administración
├── Aplicación móvil: React Native + Expo (mobile/)
│   ├── Inicio de sesión y registro
│   ├── Menú y carrito
│   ├── Pedidos e historial
│   └── Perfil y administración
└── Servicios compartidos: Firebase
    ├── Authentication: correo y Google
    └── Cloud Firestore: perfiles y pedidos
`

La aplicación web y la móvil comparten datos a través de Firestore. La API de Next.js se conserva para el catálogo heredado y la compatibilidad con etapas anteriores; **no debe confundirse su almacenamiento en memoria con la persistencia compartida de Firebase**.

## 4. Funcionalidades

| Módulo | Descripción |
| --- | --- |
| Autenticación | Registro e inicio de sesión mediante correo electrónico y Google, sujetos a configuración de Firebase y OAuth en cada plataforma. |
| Menú | Consulta de productos, categorías, tamaños y precios. |
| Carrito | Agregar productos, modificar cantidades y confirmar pedidos. |
| Pedidos | Creación y consulta de pedidos vinculados al `uid` del usuario autenticado. |
| Historial | Consulta de pedidos anteriores del cliente. |
| Administración | Visualización de pedidos y actualización de estados mediante cuenta autorizada. |
| Perfil | Consulta de datos del usuario, puntos de fidelidad derivados y cierre de sesión. |
| Experiencia de usuario | Pantallas de carga, error y contenido vacío; identidad visual compartida. |

**Nota de alcance:** Los módulos anteriores corresponden a las funcionalidades descritas en los avances. Su disponibilidad real en ambas plataformas debe validarse con las pruebas de la sección 10.

## 5. Firebase: autenticación y persistencia

- **Firebase Authentication:** inicio de sesión y registro con correo electrónico; acceso mediante Google cuando se han configurado los proveedores y los Client ID correspondientes.
- **Cloud Firestore:** almacenamiento compartido de perfiles y pedidos; cada pedido se relaciona con el `uid` autenticado.
- **Sincronización:** los datos guardados en Firestore pueden ser consultados desde web y móvil conforme a las reglas de seguridad y permisos del usuario.
- **Administración:** los cambios de estado deben reflejarse en los clientes de ambas plataformas al volver a consultar o mediante suscripciones en tiempo real, si están implementadas.
- **Seguridad:** desplegar y verificar las reglas de Firestore para impedir que clientes no autorizados lean o modifiquen pedidos ajenos o se asignen privilegios administrativos.

No se publican contraseñas, secretos, archivos `.env.local` ni credenciales privadas. La configuración pública de Firebase debe acompañarse de reglas y controles de autorización correctos.

## 6. Requisitos para ejecutar el proyecto

- Node.js y npm instalados.
- Proyecto de Firebase configurado con Authentication y Firestore.
- Expo Go o emulador compatible para las funciones que no requieran una compilación nativa; usar un build de desarrollo cuando la autenticación o configuración nativa de Google lo exija.
- Teléfono y computadora en la misma red local si se consume la API de desarrollo mediante una IP privada.

Comprobar las herramientas:

```powershell
node --version
npm --version
```

### 6.1. Configuración web

Desde la raíz del repositorio:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Completar las variables `NEXT_PUBLIC_` de Firebase de acuerdo con `.env.example`. La aplicación se abre normalmente en <http://localhost:3000>.

### 6.2. Configuración móvil

En una segunda terminal:

```powershell
Set-Location .\mobile
Copy-Item .env.example .env.local
npm install
npm run start
```

Completar la configuración de Firebase y los Client ID de Google indicados en `mobile/.env.example`. Reiniciar Expo después de modificar variables de entorno.

Para Android nativo, `mobile/google-services.json` corresponde al paquete `com.cafedelcentro.mobile` y está referenciado desde `mobile/app.json`, según el avance documentado. La configuración nativa se genera durante el prebuild o build; Expo Go no recompila plugins nativos.

### 6.3. Configuración de Firebase

1. Crear o seleccionar el proyecto en Firebase Console.
2. Registrar las aplicaciones necesarias y completar las variables de entorno de cada plataforma.
3. Habilitar los proveedores **Email/Password** y **Google** en Authentication.
4. Configurar los dominios autorizados, URI de redirección y Client ID adecuados para web, Android y, si aplica, iOS.
5. Crear la base de datos Cloud Firestore y revisar sus reglas de seguridad.
6. Desde la raíz, si Firebase CLI y el proyecto están configurados, desplegar las reglas:

```powershell
firebase deploy --only firestore:rules
```

No asumir que la autenticación social funciona en todas las plataformas hasta probar los flujos completos en el entorno correspondiente.

### 6.4. API local desde un teléfono físico

Si alguna pantalla consume la API heredada de Next.js, configurar en `mobile/.env.local` la IP IPv4 de la computadora:

```dotenv
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:3000/api
```

Sustituir la IP de ejemplo por la real obtenida con `ipconfig`. Verificar que la web siga ejecutándose y que el firewall permita la conexión.

| Entorno | Dirección de referencia |
| --- | --- |
| Emulador Android | `http://10.0.2.2:3000/api` |
| Simulador iOS o navegador local | `http://localhost:3000/api` |
| Teléfono físico | IP local de la computadora terminada en `/api` |

Estas direcciones corresponden a **desarrollo local**; no deben utilizarse como configuración de producción.

## 7. API heredada de Next.js

Las siguientes rutas se conservan por compatibilidad con etapas anteriores. La autenticación y los pedidos de la integración Firebase se gestionan mediante los servicios correspondientes y no dependen necesariamente de estas rutas.

| Operación heredada | Ruta |
| --- | --- |
| Iniciar sesión | `POST /api/auth/login` |
| Registrar cliente | `POST /api/auth/registro` |
| Consultar productos | `GET /api/productos` |
| Crear pedido | `POST /api/pedidos` |
| Consultar pedidos | `GET /api/pedidos` |
| Consultar pedidos de un cliente | `GET /api/pedidos?usuarioId={id}` |
| Actualizar estado del pedido | `PUT /api/pedidos/{id}` |

**Limitación heredada:** Los arreglos en memoria usados por rutas anteriores pueden perder datos al reiniciar el servidor. La persistencia de perfiles y pedidos de la solución final debe validarse directamente en Firestore.

## 8. Diseño UX/UI y mockups de Figma

El diseño visual busca mantener coherencia entre la experiencia web y móvil, con navegación comprensible, menú organizado, carrito, seguimiento de pedidos y perfil.

**Mockups de la Etapa 1 

- [ ] Insertar enlace público de Figma en la sección 2.
- [ ] Exportar las pantallas aprobadas y guardarlas en `docs/mockups/`.
- [ ] Mostrar en este README las capturas de bienvenida, autenticación, menú, carrito, pedidos y perfil.
- [ ] Comparar la implementación final con los mockups y documentar las diferencias justificadas.

Ejemplo de inserción una vez añadido el archivo real al repositorio:

```markdown
![Mockup del menú de Café del Centro](docs/mockups/menu.png)
```

## 9. Despliegue web en Vercel

1. Subir el código al repositorio público de GitHub.
2. Importar el repositorio en Vercel y seleccionar la carpeta raíz de la aplicación Next.js.
3. Configurar en Vercel las variables de entorno `NEXT_PUBLIC_` utilizadas por el proyecto.
4. Revisar dominios autorizados y configuración OAuth de Firebase para la URL de producción.
5. Ejecutar el despliegue y comprobar inicio de sesión, catálogo, pedidos, historial y administración.
6. Publicar la URL verificada en la sección 2.

## 10. Pruebas y validación

### 10.1. Comprobaciones automáticas

Desde la raíz (web):

```powershell
npm run lint
npm run build
```

Desde `mobile/`:

```powershell
npm run lint
npm run typecheck
npx expo export --platform android
npx expo export --platform web
```


### 10.2. Lista de pruebas funcionales

- [ ] La web abre correctamente desde su URL pública de Vercel.
- [ ] La app móvil abre en un dispositivo o emulador compatible.
- [ ] Registro e inicio de sesión por correo funcionan en ambas plataformas.
- [ ] Inicio de sesión con Google funciona en ambas plataformas.
- [ ] La sesión se conserva y el cierre de sesión funciona correctamente.
- [ ] Menú, categorías, tamaños y precios se muestran correctamente.
- [ ] El carrito permite modificar cantidades y confirmar pedidos.
- [ ] Los pedidos se guardan en Firestore asociados al `uid` correcto.
- [ ] El historial de pedidos se consulta desde web y móvil.
- [ ] Los cambios administrativos de estado se reflejan correctamente en ambas plataformas.
- [ ] Los clientes no pueden acceder a pedidos ajenos ni a funciones administrativas.
- [ ] Las pantallas muestran estados de carga, error y contenido vacío.
- [ ] El diseño final se corresponde con los mockups de la Etapa 1.


## 11. Integrantes
 

Rebeca Sarai Flores De Tejada - FD253107 

Eduardo Ezequiel Amaya Montano – AM210570 

Henry Beisson Chacon Garcia – CG253400 

Giovanni Manuel Quijano Sosa - QS242538 

Flujo de trabajo recomendado:

1. Crear una rama por integrante a partir de la rama principal.
2. Implementar y probar cambios en la rama individual.
3. Realizar commits atómicos con mensajes descriptivos.
4. Abrir solicitudes de integración (pull requests) y revisar los cambios.
5. Integrar el trabajo aprobado y verificar la aplicación completa.
6. Conservar evidencia del historial de contribuciones y la participación de todos.

## 12. Licencia Creative Commons

**Pendiente de formalización:** El equipo debe seleccionar la licencia Creative Commons aplicable a los materiales propios del proyecto, incorporar el texto correspondiente en un archivo `LICENSE` y documentar su alcance.

Creative Commons está orientada principalmente a obras creativas y documentación. Para el **código fuente**, se recomienda evaluar una licencia de software apropiada (por ejemplo, MIT), separada de la licencia Creative Commons de los recursos gráficos y documentales, siempre que el docente lo permita. No se afirma que exista una licencia hasta que el archivo correspondiente esté publicado.

También deben respetarse las licencias de bibliotecas, imágenes, iconos y otros recursos de terceros.

## 13. Correspondencia con los requisitos de la entrega final

| Requisito | Evidencia / estado documental |
| --- | --- |
| 1. Web React + Next.js desplegada en Vercel | Arquitectura e instrucciones documentadas
| 2. Móvil React Native con Firebase | Configuración y funciones descritas; 
| 3. Autenticación por correo y redes sociales |
| 4. Módulos principales y secundarios 
| 5. Firestore compartido |
| 6. UX/UI coherente con Figma | 
| 7. Mockups publicados en README | 
| 8. Licencia Creative Commons | archivo `LICENSE` y alcance. |
| 9. GitHub público, ramas, colaboradores y commits | 
| 10. Originalidad del proyecto | 
## 14. Defensa del proyecto


## 15. Referencias académicas

Román Gallardo, A., Flores Cortés, C. A., & Herrera Morales, J. R. (s. f.). *Programación de Aplicaciones Móviles con React Native*. Editorial BUK. Capítulos 1–4: introducción a React Native, Expo, conceptos básicos y props.

---

**Café del Centro — Proyecto académico multiplataforma.** 
