# 👑 29 Capítulos — Experiencia Interactiva de 30 Días

Una plataforma web **de lujo, privada y en tiempo real** diseñada para regalarle 30 días de expectativa, dinámicas interactivas, cartas, fotos, videos, notas de voz y una película final por sus 29 años.

---

## 🔒 Regla de Oro (Cero Spoilers)
1. **Todas las cápsulas nacen selladas (`🔒`)**. Ninguna se abre automáticamente por calendario ni permite ver su contenido hasta que **tú** pulses **`🔓 Autorizar Apertura Ahora`** en tu panel secreto (`admin.html`).
2. **La vista de ella (`index.html`) está 100% aislada**: no muestra botones de administración, no muestra pistas ocultas ni recibe el contenido de los días sellados.

---

## ⚡ 1. Probar Ahora Mismo en tu PC
1. Haz doble clic en **`INICIAR_LOCAL.bat`**.
2. Se abrirán dos pestañas:
   - **`index.html`** → La plataforma que verá ella.
   - **`admin.html`** → Tu **Centro de Mando** (PIN inicial por defecto: **`2929`**).
3. En `admin.html` selecciona el **Día 01**, personalízalo o carga una foto/nota de voz, pulsa **`🔓 Autorizar Apertura Ahora`** y recarga `index.html` para vivir la experiencia completa.

---

## ☁️ 2. Conectar a la Nube Gratis (Supabase + GitHub Pages)
Para que tú manejes todo desde tu celular y ella lo reciba en tiempo real en el suyo al escanear el QR:

### Paso A: Crear Base de Datos y Storage en Supabase (Gratis)
1. Entra a [supabase.com](https://supabase.com) y crea un proyecto nuevo.
2. Ve a **SQL Editor → New query**, copia todo el contenido de `supabase_schema.sql` y pulsa **Run**.
3. Ve a **Authentication → Users → Add user → Create new user** y crea tu usuario Admin (correo + contraseña). *(Desactiva o confirma el email desde ese mismo panel).*
4. Ve a **Project Settings → API** y copia:
   - **Project URL** (`https://xxxxx.supabase.co`)
   - **anon public key**

### Paso B: Vincular y Descargar `config.js`
1. Abre `admin.html` → pestaña **☁️ Nube, GitHub & Ajustes**.
2. Pega tu `Supabase URL` y `Anon Key` y pulsa **Conectar Supabase Aquí**.
3. Inicia sesión con tu correo/contraseña de Admin.
4. Personaliza su nombre, la fecha exacta del cumpleaños y pulsa **📦 Descargar `js/config.js` para GitHub**.
5. Reemplaza el archivo `js/config.js` de esta carpeta por el que descargaste.

### Paso C: Subir a GitHub y Activar GitHub Pages
1. Crea un repositorio nuevo en [github.com](https://github.com/new) (por ejemplo `29-capitulos`).
2. Sube los archivos de esta carpeta `cap29-sorpresa` a ese repositorio (`git init`, `git add .`, `git commit -m "Inicio 29 Capitulos"`, `git push`).
3. En GitHub ve a **Settings → Pages → Build and deployment → Branch: `main` / `/ (root)` → Save**.
4. En ~1 minuto tendrás tu enlace definitivo `https://tuusuario.github.io/29-capitulos/`.
5. Entra a `https://tuusuario.github.io/29-capitulos/admin.html`, ve a **📱 Tarjeta QR & Alertas**, pega el enlace público de ella y descarga tu **Tarjeta QR de Lujo (PNG)** lista para imprimir o enviar mañana.

