# Notas Técnicas y Arquitectura — Café del Centro

## 1. Arquitectura General del Sistema
Solución multiplataforma que integra una aplicación web y una aplicación móvil conectadas a un backend unificado en la nube para sincronización en tiempo real:

* **Cliente Web:** Desarrollado con **React + Next.js** y desplegado en **Vercel**.
* **Cliente Móvil:** Desarrollado con **React Native (Expo)** con integración nativa de **Firebase SDK**.
* **Base de Datos y Persistencia:** **Cloud Firestore** como base de datos NoSQL compartida entre ambas plataformas.
* **Autenticación:** **Firebase Authentication** con inicio de sesión mediante correo/contraseña y redes sociales en web y móvil.

## 2. Flujo de Datos y Módulos
1. El usuario inicia sesión mediante **Firebase Auth**, generando un identificador único (`uid`).
2. Los módulos principales y secundarios (gestión de catálogo, carrito, estado de pedidos y puntos de fidelidad) sincronizan sus lecturas y escrituras en **Firestore**.
3. La interfaz sigue los mockups diseñados en **Figma** en la Etapa 1, manteniendo coherencia visual entre web y móvil.

## 3. Validación de Entrega
- [x] Web desplegada en Vercel y operativa.
- [x] App móvil en React Native conectada a Firebase.
- [x] Autenticación y persistencia compartida en Firestore verificadas.
- [x] Mockups en README y Licencia Creative Commons configurados en el repositorio.
