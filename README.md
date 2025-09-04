 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index c18fd8ce49c444d2dd6d8d93157f01212376a501..cef846e550d3c6c37f391b19f4acf49b27cfcdaf 100644
--- a/README.md
+++ b/README.md
@@ -1,24 +1,49 @@
 # 🧠 Habit Tracker Web App (Next.js + Tailwind CSS)
 
-Este es un proyecto web moderno desarrollado con **Next.js** y **Tailwind CSS**.  
+Este es un proyecto web moderno desarrollado con **Next.js** y **Tailwind CSS**.
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
-1. **Clona el repositorio**  
+
+1. **Clona el repositorio**
    ```bash
    git clone https://github.com/tuusuario/tu-repo.git
    cd tu-repo
+   ```
+2. **Instala dependencias**
+   ```bash
+   npm install
+   ```
+3. **Configura las variables de entorno**
+   Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
+
+   ```bash
+   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
+   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
+   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
+   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
+   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
+   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
+   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
+   NEXT_PUBLIC_FIREBASE_AUTH_ACTION_URL=https://tu-app.web.app/auth/action
+   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key
+   ```
+4. **Inicia el servidor de desarrollo**
+   ```bash
+   npm run dev
+   ```
+
 
EOF
)
