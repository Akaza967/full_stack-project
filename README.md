# 🏆 Proyecto Full Stack: Plataforma de Gestión de Torneos Deportivos

## 1. Descripción General
Este proyecto es una plataforma integral orientada a la **gestión de competiciones deportivas, equipos y jugadores**. Permite administrar desde la creación de torneos (con diferentes formatos y temporadas) hasta el registro de equipos, gestión de perfiles de usuarios y seguimiento de partidos. 

El proyecto consta de dos partes completamente desacopladas: un **Backend (API REST)** robusto y seguro que centraliza la lógica de negocio, y un **Frontend** moderno y rápido centrado en la experiencia del usuario (UI/UX).

---

## 2. Arquitectura y Stack Tecnológico

El proyecto está diseñado bajo una arquitectura de microservicios o sistemas divididos (Cliente/Servidor) mediante peticiones HTTP.

### ⚙️ Backend (API REST)
*   **Framework:** NestJS (v11). Basado en la inyección de dependencias y modularidad.
*   **Lenguaje:** TypeScript.
*   **Base de Datos:** PostgreSQL (Relacional) administrada mediante el ORM **TypeORM**.
*   **Seguridad y Autenticación:** 
    *   JSON Web Tokens (JWT) con `@nestjs/jwt`.
    *   Estrategias de autenticación mediante `Passport`.
    *   Encriptación de contraseñas con `bcrypt`.
    *   Protección global de DTOs utilizando `class-validator` y `class-transformer` (Rechaza propiedades no válidas automáticamente).
*   **Gestión Multimedia:** Integración nativa con **Cloudinary** para subir, recortar y almacenar imágenes en la nube (ej. logos de equipos, fotos de jugadores y banners de torneos).

### 🎨 Frontend (Cliente)
*   **Framework:** Astro 6 (con modo SSR o SSG, plantilla `minimal`). Destaca por su rendimiento extremo enviando cero o mínimo JavaScript innecesario al cliente.
*   **Lenguaje:** TypeScript estricto.
*   **Estilos:** Tailwind CSS v4 (mediante `@tailwindcss/vite`). Todo el diseño se administra de forma global sin necesidad del obsoleto `tailwind.config.js`.
*   **Iconografía:** `@lucide/astro` para iconos SVG en línea.
*   **Conexión HTTP:** Cliente API personalizado basado en la API nativa `fetch` (en `src/lib/api.ts`) que captura los códigos de estado del backend, comparte la tipificación exacta desde NestJS y administra el JWT almacenándolo en el `localStorage`.

---

## 3. Estructura del Proyecto

### 📁 `backend/`
El backend sigue el patrón SOLID de responsabilidad única con módulos aislados:
*   `/src/auth` & `/src/users` & `/src/profiles`: Separan la autenticación, las credenciales del usuario y la información pública del perfil en entidades distintas para máxima seguridad.
*   `/src/teams` & `/src/players`: Administran la información de los equipos y la base de datos de jugadores disponibles (fichas técnicas, posiciones, etc).
*   `/src/tournaments`: Gestión de campeonatos. Contiene la entidad principal, DTOs y lógica.
*   `/src/media`: Conexión encapsulada con Cloudinary.
*   `/src/common`: DTOs, filtros, interfaces e interceptores compartidos globalmente.

### 📁 `front/`
El frontend emplea el ruteo basado en archivos de Astro (`pages/`):
*   `/src/pages/index.astro`: Landing page de bienvenida.
*   `/src/pages/login.astro` y `/register.astro`: Flujos de autenticación.
*   `/src/pages/me.astro`: Vista protegida del perfil de usuario actual.
*   `/src/pages/torneos`, `equipos`, `jugadores`, `partidos`, `admin`: Páginas que consumen y renderizan la información deportiva traída de la API.
*   `/src/layouts`: Componentes envolventes base (`Layout.astro`, `AuthLayout.astro`).
*   `/src/components`: Componentes reutilizables (`Alert.astro`, `Field.astro`, `Select.astro`).

---

## 4. Guía de Uso Rápida

**Pre-requisitos:** Node.js v22+ y PostgreSQL instalado y ejecutándose.

1. **Configurar Variables de Entorno:**
   *   **Backend:** Dentro de la carpeta `/backend`, crear el archivo `.env` tomando como base `.env.example` y asegurar que `DB_PASSWORD`, `DB_HOST` y las claves de Cloudinary estén correctas.
   *   **Frontend:** Dentro de la carpeta `/front`, crear el `.env` asignando `PUBLIC_API_URL=http://localhost:3000`.

2. **Levantar el Backend:**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   *El servidor correrá en `http://localhost:3000` y sincronizará las tablas en tu base de datos automáticamente si `DB_SYNCHRONIZE=true`.*

3. **Levantar el Frontend:**
   ```bash
   cd front
   npm install
   npm run dev
   ```
   *La web app se abrirá en `http://localhost:4321`.*

---

## 5. 🆕 Changelog: Nuevas Funcionalidades Implementadas (Paginación Dinámica)

Se implementó con éxito una solución de paginación y filtrado desde el motor de la base de datos hasta la interfaz del usuario para optimizar los tiempos de respuesta y evitar cuellos de botella con altos volúmenes de registros.

**En el Backend (NestJS):**
*   **DTOs Universales:** Se crearon `PaginationDto` y la interfaz `PaginatedResult` dentro de `src/common/` permitiendo reutilizar esta estructura de paginación en cualquier otro módulo futuro (equipos, jugadores, etc).
*   **Mejora en Tournaments Service:** Se actualizó `TournamentsService.findAll`. Dejó de devolver un array plano y ahora utiliza `createQueryBuilder` para aplicar filtros SQL reales: 
    *   `ILIKE` para búsqueda parcial y no sensible a mayúsculas en nombre y descripción.
    *   Validaciones exactas para formato, estado y temporada del torneo.
    *   Métodos `.skip()` y `.take()` ejecutando la paginación a nivel de base de datos.
*   **Controlador:** `TournamentsController` fue modificado para extraer y parsear automáticamente estos parámetros desde la URL usando `@Query()`.

**En el Frontend (Astro):**
*   **Cliente API Inteligente:** Se actualizó `src/lib/api.ts` para que la función `listTournaments` envíe dinámicamente todos los parámetros requeridos (`page`, `limit`, `search`, `format`, `status`, `season`) mediante `URLSearchParams` y procese correctamente la interfaz envuelta en `PaginatedResult<Tournament>`.
*   **UI/UX en Vista de Torneos (`torneos/index.astro`):**
    *   Se inyectó en el HTML la nueva interfaz de controles de paginación (botones "Anterior" y "Siguiente") junto con la visualización de la página actual.
    *   **Filtrado Asíncrono (Server-Side):** Se reconstruyó el script de la página. Ya no filtra arreglos inmensos en la memoria del navegador. Ahora, al escribir en la barra de búsqueda (con una optimización *debounce* de 500ms para no saturar al servidor) o al cambiar de página, hace peticiones asíncronas trayendo exclusivamente 9 torneos por página, brindando una experiencia impecable.
