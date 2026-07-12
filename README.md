# Menu Calculate — Landing

Landing page oficial de **Menu Calculate**, la app iOS para restaurantes que calcula el coste, el food cost y el beneficio de cada plato en segundos — dictándole el plato con la voz.

**100 % estática** (HTML + CSS + JS vanilla, sin dependencias ni build). Se sube a cualquier hosting tal cual.

## Características

- 🎨 **Mismo sistema de diseño que la app** — paleta cálida (azafrán `#D9762F` sobre piedra `#F4F2EE`), tipografía redondeada (SF Pro Rounded / ui-rounded), tarjetas con radios de 28 px.
- 🌗 **Modo claro y oscuro** automático (`prefers-color-scheme`), con la paleta dark de la app.
- 🌍 **5 idiomas** (ES · DE · EN · FR · IT) con selector en la barra. Detecta el idioma del navegador; si no es uno de los 5, cae a **español**. La elección se recuerda en `localStorage`.
- 🎬 **Vídeo del hero subtitulado por idioma** — 5 versiones (`assets/hero-{lang}.mp4`) con subtítulos quemados; cambia automáticamente al cambiar de idioma.
- ✨ Animaciones: reveals al hacer scroll, marquee infinito de platos, donut de food cost animado, barras de rentabilidad, contadores, chips flotantes. Respeta `prefers-reduced-motion`.
- 🍪 **Aviso de cookies** en la primera visita (informativo: la web no usa cookies de rastreo, solo guarda el idioma).
- ⚖️ **Páginas legales independientes** en inglés con URL propia: [`privacy.html`](privacy.html) y [`terms.html`](terms.html) — las URLs que piden App Store Connect y la app.
- 📱 Badges oficiales de App Store y Google Play (enlaces pendientes de publicación).

## Estructura

```
index.html      Página principal (secciones: hero, marquee, funciones,
                cómo funciona, rentabilidad, cifras, CTA, footer)
styles.css      Todo el estilo (variables de tema claro/oscuro arriba)
app.js          Idiomas, animaciones, banner de cookies
i18n.js         Traducciones (5 idiomas, claves planas)
privacy.html    Privacy Policy (EN)
terms.html      Terms of Use (EN)
assets/         Icono, wordmark, ilustraciones, vídeos del hero, badges
```

## Desarrollo

No hay build: abre `index.html` en el navegador y listo.

## Despliegue

Subir la carpeta completa al hosting (FTP/SFTP). No requiere Node ni servidor dinámico.

## Al publicar la app (pendientes)

1. **Enlaces de descarga** — sustituir los `href="#"` de los badges (4 sitios: 2 en el hero, 2 en el CTA final, marcados con comentario) por:
   - App Store: `https://apps.apple.com/app/id…`
   - Google Play: `https://play.google.com/store/apps/details?id=ch.lweb.mise`
2. **App Store Connect** — usar como Privacy Policy URL: `https://<dominio>/privacy.html`.
3. La app (pantalla Información y paywall) enlaza a `privacy.html` / `terms.html` desde `src/config/enlaces.ts`.

## Editar contenido

- **Textos:** todos en `i18n.js` (una clave = 5 idiomas). El HTML solo tiene el texto español como fallback (`data-i18n`).
- **Vídeos del hero:** regenerar con ffmpeg (subtítulos `drawtext` quemados) a partir del vídeo original de Sora; una versión por idioma en `assets/hero-{lang}.mp4`.
- **Colores/tema:** variables CSS al inicio de `styles.css` (bloques `:root` claro y `@media dark`).

---

© 2026 [lweb.ch](https://lweb.ch) — Suiza
