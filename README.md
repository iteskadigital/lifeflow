# 🧠 Habit Tracker Web App (Next.js + Tailwind CSS)

Este es un proyecto web moderno desarrollado con **Next.js** y **Tailwind CSS**.  
Actualmente está siendo optimizado con ayuda de **ChatGPT Codex**, y el despliegue final se realizará en **Lovable**.

---

## 🚀 Tecnologías usadas

- ✅ Next.js 13+ (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ App Directory (`/src/app`)
- ✅ Componentes modularizados (`/src/components`)
- 🧠 Optimización del código con ChatGPT Codex
- ☁️ Despliegue previsto en Lovable

---

## 🛠️ Cómo usar este proyecto
1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tuusuario/tu-repo.git
   cd tu-repo
   ```
2. **Instala las dependencias**
   ```bash
   npm install
   ```
3. **Configura las variables de entorno**
   Crea un archivo `.env.local` en la raíz con las claves necesarias para Firebase y otras integraciones:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key
   ```
   > Estas claves son requeridas para Firebase y Google reCAPTCHA.
4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación se ejecutará en `http://localhost:9002` por defecto.

---

## 📝 Notas adicionales
- Asegúrate de configurar correctamente tus claves en el panel de Firebase.
- Verifica cualquier integración adicional (como APIs externas) antes de desplegar.
