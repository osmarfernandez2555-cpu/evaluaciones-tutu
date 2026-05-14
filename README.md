# 📋 Evaluación de Desempeño — Tutu Automotores

App web para evaluación de empleados y jefes con guardado automático en Google Drive.

---

## 🚀 Cómo deployar en GitHub Pages (paso a paso)

### PASO 1 — Crear Google Cloud Client ID

1. Ir a https://console.cloud.google.com
2. Crear un proyecto nuevo (o usar uno existente)
3. Ir a **APIs y Servicios → Biblioteca**
4. Buscar y habilitar **Google Drive API**
5. Ir a **APIs y Servicios → Credenciales**
6. Clic en **Crear Credenciales → ID de cliente OAuth 2.0**
7. Tipo de aplicación: **Aplicación web**
8. Nombre: `Tutu Evaluaciones`
9. En **Orígenes autorizados de JavaScript** agregar:
   - `http://localhost:3000` (para desarrollo)
   - `https://TU_USUARIO.github.io` (para producción)
10. Guardar y **copiar el Client ID** (formato: `xxxx.apps.googleusercontent.com`)

### PASO 2 — Configurar la app

Abrí el archivo `src/App.js` y en la línea 3 reemplazá:

```js
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";
```

Por tu Client ID real:

```js
const GOOGLE_CLIENT_ID = "123456789-abcdefgh.apps.googleusercontent.com";
```

**Opcional — guardar en una carpeta específica de RRHH:**
1. Abrí Google Drive y creá una carpeta llamada `Evaluaciones RRHH`
2. Entrá a la carpeta y copiá el ID de la URL:
   `https://drive.google.com/drive/folders/`**`ESTE_ES_EL_ID`**
3. Pegalo en `src/App.js`:
```js
const DRIVE_FOLDER_ID = "ESTE_ES_EL_ID";
```

### PASO 3 — Subir a GitHub

1. Crear un repositorio nuevo en https://github.com (nombre sugerido: `evaluacion-tutu`)
2. Clic en **"uploading an existing file"** y subir todos los archivos de esta carpeta
   - O si usás Git:
   ```bash
   git init
   git add .
   git commit -m "Evaluación Tutu Automotores"
   git remote add origin https://github.com/TU_USUARIO/evaluacion-tutu.git
   git push -u origin main
   ```

### PASO 4 — Activar GitHub Pages con GitHub Actions

1. En el repo, ir a **Settings → Pages**
2. En **Source** seleccionar **GitHub Actions**
3. GitHub va a detectar que es React y sugerir el workflow automáticamente
4. Hacer clic en **Configure** y luego **Commit changes**

O podés deployar manualmente:
1. En el repo, ir a **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` (se crea automáticamente con `npm run deploy`)

Para deploy manual instalá dependencias y ejecutá:
```bash
npm install
npm run deploy
```

### PASO 5 — Tu URL pública

Una vez deployado, la app estará en:
```
https://TU_USUARIO.github.io/evaluacion-tutu
```

¡Compartí ese link con los vendedores por WhatsApp!

---

## 🔐 Contraseñas

| Rol       | Contraseña   |
|-----------|--------------|
| Empleado  | `ventas2026` |
| Jefe      | `tutu2026`   |

---

## 📁 Cómo ve los resultados RRHH

Cuando alguien completa y envía la evaluación:
1. Se abre una ventana de Google para que el empleado autorice
2. El archivo se sube automáticamente al Google Drive autorizado
3. El nombre del archivo: `Evaluacion_NombreApellido_fecha.txt`

**Recomendación:** compartir la carpeta de Drive `Evaluaciones RRHH` con el mail de RRHH para que tenga acceso directo.

---

## 📞 Soporte

Proyecto desarrollado para Tutu Automotores — Córdoba, Argentina.
