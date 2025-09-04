diff --git a/README.md b/README.md
index c18fd8ce49c444d2dd6d8d93157f01212376a501..114ba6f42634567d7691624c86bb5088ee9f833a 100644
--- a/README.md
+++ b/README.md
@@ -1,24 +1,48 @@
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
 
-## 🛠️ Cómo usar este proyecto
-1. **Clona el repositorio**  
+## 🛠️ Uso rápido
+1. **Clona y entra al proyecto**
    ```bash
    git clone https://github.com/tuusuario/tu-repo.git
    cd tu-repo
+   ```
+2. **Instala dependencias**
+   ```bash
+   npm install
+   ```
+3. **Añade tus claves**
+   Crea `.env.local` y agrega tus valores de Firebase y reCAPTCHA:
+   ```bash
+   NEXT_PUBLIC_FIREBASE_API_KEY=...
+   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
+   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
+   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
+   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
+   NEXT_PUBLIC_FIREBASE_APP_ID=...
+   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
+   ```
+4. **Arranca el servidor**
+   ```bash
+   npm run dev
+   ```
+   Abre `http://localhost:9002` en tu navegador.
+
+## 📝 Notas
+- Verifica tus claves en Firebase antes de desplegar.
