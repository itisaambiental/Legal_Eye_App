# Legal Eye APP (ISA AMBIENTAL)

**Legal Eye APP** es una aplicación web desarrollada en **React.js** con **Vite.js**. Este documento proporciona una guía rápida para configurar, ejecutar y entender el proyecto.

---

## Requisitos Previos

* [Node.js](https://nodejs.org/) (v16 o superior)
* [npm](https://www.npmjs.com/) (viene incluido con Node.js)
* [Git](https://git-scm.com/) (opcional, para clonar el repositorio)

---

## Instalación

1. **Clonar el repositorio** (si tienes Git instalado):

   ```
   git clone https://github.com/itisaambiental/Legal_Eye_App.git
   cd Legal_Eye_App
   ```
2. **Instalar dependencias** :

   ```
   npm install
   ```

   Esto instalará todas las dependencias necesarias listadas en el archivo `package.json`.

---

## Estructura del Proyecto

A continuación se detalla la estructura del proyecto:

```
.
├── dist/                  # Carpeta de salida de la compilación de producción
├── public/                # Archivos estáticos (imágenes, fuentes, etc.)
├── src/                   # Código fuente del proyecto
│   ├── assets/            # Recursos estáticos como imágenes, iconos, etc.
│   ├── components/        # Componentes reutilizables de la aplicación
│   ├── config/            # Configuraciones globales (API endpoints, etc.)
│   ├── context/           # Contextos de React para manejo de estado global
│   ├── errors/            # Manejo de errores
│   ├── hooks/             # Hooks personalizados
│   ├── middlewares/       # Middlewares para la aplicación
│   ├── services/          # Lógica de negocio y servicios (llamadas a la API, etc.)
│   ├── App.jsx            # Componente principal de la aplicación
│   ├── App.routes.jsx     # Definición de las rutas de la aplicación
│   ├── index.css          # Estilos globales
│   └── main.jsx           # Punto de entrada de la aplicación
├── .env.local             # Variables de entorno locales (crear este archivo)
├── .gitignore             # Archivos y carpetas ignorados por Git
├── eslint.config.js       # Configuración de ESLint para linting
├── package.json           # Dependencias y scripts del proyecto
├── package-lock.json      # Versiones exactas de las dependencias instaladas
├── postcss.config.js      # Configuración de PostCSS para estilos
├── tailwind.config.js     # Configuración de Tailwind CSS
├── vite.config.js         # Configuración de Vite para el proyecto
├── README.md              # Este archivo
```

---

## Configuración

1. **Variables de entorno** :
   Crea un archivo `.env.local` en la raíz del proyecto y agrega las siguientes variables:

   ```
   # Configuración de la API
   VITE_API_URL=URL base de la API backend.

   # Configuración de MSAL (Microsoft Authentication Library)
   VITE_MSAL_ID=ID de la aplicación en Azure AD para autenticación con MSAL.
   VITE_TENANT_ID=ID del tenant en Azure AD para autenticación con MSAL.

   # Configuración de la aplicación
   VITE_APP_URL=URL base de la aplicación frontend.

   # Configuración de la API de TINYMCE para el rich text
   VITE_TINYMCE=Clave API de TINYMCE para el rich text

   # Configuración de la API de COPOMEX
   VITE_COPOMEX_API_KEY=Clave de API para acceder a los servicios de COPOMEX.
   ```

## Ejecución

1. **Iniciar el servidor en desarrollo** :

   ```
   npm run dev
   ```

   Esto iniciará el servidor de desarrollo de Vite, que recargará automáticamente la aplicación cuando detecte cambios en los archivos.
2. **Compilar para producción** :

   ```
   npm run build
   ```

   Esto generará una versión optimizada de la aplicación en la carpeta `dist/`.
3. **Previsualizar la compilación de producción** :

   ```
   npm run preview
   ```

   Esto iniciará un servidor local para previsualizar la aplicación compilada.

---

## Pruebas

Para ejecutar las pruebas:

```
npm test
```

## Licencia

Este proyecto es privado y propiedad de  **ISA AMBIENTAL** . No está disponible bajo ninguna licencia de código abierto.
