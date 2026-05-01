# Prueba técnica — Maquetación Web y Desarrollo Frontend (Accom)

Landing page desarrollada como prueba técnica. El objetivo es trasladar el diseño propuesto a código funcional, cuidando el detalle, la lógica de interacción y la experiencia de usuario, con un resultado totalmente responsive.

## Stack

- [Astro](https://astro.build/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first, foundations en `@theme`)
- TypeScript
- Prettier

## Bloques

La landing está compuesta por tres bloques principales:

### Bloque 1 — Hero (Banner + formulario)
Banner con el título destacado, badge, párrafo descriptivo y un formulario lateral con la lógica de validaciones (campos requeridos, checkbox de privacidad).


### Bloque 2 — Tarifas
Cuatro cards de tarifa (3 de luz + 1 dual destacada como "TOP VENTAS"), con kicker, título, lista de bullets con check verde y dos CTAs por card ("Contratar" y "Calcula tu tarifa").

- **Desktop**: grid de 4 columnas.
- **Mobile**: tabs (`Tarifas luz` / `Tarifa dual` / `Tarifas gas`) + carrusel horizontal con scroll-snap. Las tabs y el carrusel están sincronizados:
  - Click en una tab → el carrusel hace smooth scroll a la card correspondiente.
  - Swipe manual del carrusel → la tab activa se actualiza al detectar la card centrada.

### Bloque 3 — Selectores de oferta + Calculadora
Sección "Compara nuestras ofertas en energía" con tres tarjetas de selección (Solo Luz / Luz+Gas / Solo Gas).

La calculadora vive en su propia página `/calcula-tu-tarifa`, accesible desde:
- "Calcula tu tarifa" del Header (desktop y panel mobile).
- "Calcula tu tarifa" de cada PricingCard.
- Cualquiera de las tres cards de la sección de selectores.


Al pulsar "Calcular" simulamos el envío con `Math.random() < 0.8` (80% éxito / 20% error). El mismo modal y los mismos copys de éxito/error que el formulario "Te llamamos" del modal de contacto, para no duplicar pantallas de confirmación.


#### Mejoras de UX implementadas

Pequeños extras propuestos como mejora de la experiencia de usuario más allá del Figma original:

1. **Modal de éxito (en la vista de la calculadora)→ redirige al home al cerrar.** No tiene sentido dejar a la persona en el último paso de la calculadora con los datos rellenos después de un envío exitoso. Al cerrar el modal de éxito redirige a `/`.

2. **Modal de error  (en la vista de la calculadora)→ permite reintentar sin perder datos.** En caso de error, al cerrar la persona se queda en el paso 4 con el formulario tal cual lo tenía. Para reducir la fricción, el propio modal de error muestra un botón **"Reintentar"** que cierra y reenvía el formulario automáticamente, y un teléfono de soporte (`900 000 000`) como fallback comercial. *Estos extras del modal de error aparecen en los flujos de la calculadora y del Hero* (donde la persona ya rellenó varios campos), pero **no** en el modal de contacto del header / PricingCard (donde el form tiene un único campo y reintentar es trivial).

3. **Persistencia del estado en `sessionStorage`.** Si la persona refresca la página o cierra el navegador antes de terminar la calculadora, recuperamos el paso en el que estaba y los datos ya rellenados (suministro, electrodomésticos, franja horaria, teléfono, CP, checkbox). Limpiamos el storage al confirmar el envío con éxito. Usamos `sessionStorage` (no `localStorage`) por privacidad: la información desaparece al cerrar la pestaña.

4. **Dos formas de entrar a la calculadora, dos comportamientos distintos.** La calculadora se puede abrir desde un CTA contextual (una card que ya implica un tipo de suministro) o desde un enlace neutro. Detectamos uno u otro caso con la query `?intent=<luz|luz-gas|gas>` y ajustamos el flujo para no hacer repetir a la persona una decisión que ya tomó.

   **Caso A — Entrada desde una card con intent ya elegido** (`/calcula-tu-tarifa?intent=luz`, etc.)

   Disparado desde:
   - Cualquiera de las tres cards de la sección "Compara nuestras ofertas en energía" (Solo Luz, Luz+Gas, Solo Gas).
   - El CTA "Calcula tu tarifa" de cada `PricingCard` del bloque de tarifas (mapeo directo: card de luz → `intent=luz`, dual → `intent=luz-gas`, gas → `intent=gas`).

   Al cargar la calculadora con ese parámetro:
   - Limpiamos cualquier estado anterior en `sessionStorage` (la persona ha decidido empezar un nuevo intento desde una card concreta; lo que tuviera a medias ya no aplica).
   - Marcamos automáticamente el intent en el paso 1.
   - **Saltamos directamente al paso 2** — la persona ya tomó esa decisión visualmente, no necesita repetirla.
   - Limpiamos la query string para que un refresh no vuelva a disparar el reset.

   **Caso B — Entrada en limpio** (`/calcula-tu-tarifa` sin query)

   Disparado desde:
   - Enlace "Calcula tu tarifa" del Header (desktop y panel móvil).
   - Acceso directo a la URL, vuelta atrás del navegador, etc.

   Al cargar:
   - **Arrancamos en el paso 1** (selección de suministro), con todos los pasos vacíos por defecto.
   - Si hay un estado guardado en `sessionStorage` de un intento anterior sin terminar, **rehidratamos** todos los campos y reposicionamos a la persona en el paso donde lo dejó (ver punto 3).

### Footer
Footer con logo y enlaces a las páginas legales (`Aviso Legal`, `Política de Privacidad`, `Cookies`).

### Páginas legales
Tres páginas estáticas (`/aviso-legal`, `/politica-de-privacidad`, `/cookies`) generadas a partir de un componente compartido `LegalPage.astro` que recibe `title`, `intro`, `updatedAt` y un array de `sections`. Reutilizan `Header`, `Footer` y `ContactModal`.

Los copys son inventados pero coherentes con el tono de la landing ("comparador", "sin trucos, sin permanencia", etc.).

### Modal de contacto ("Contacta con un experto")
Modal accesible reutilizable que se dispara desde "Contactar" del header, "Contratar" de cada PricingCard.

Como no hay backend, **el resultado del envío se simula con `Math.random() < 0.8`** (80% éxito / 20% error). Según el resultado, el modal muestra:
- **Éxito** → "¡Solicitud recibida con éxito!"
- **Error** → "¡Ups! Algo ha salido mal"


## Notas sobre el diseño

### 1. Checkbox de privacidad: forma distinta según el contexto
En el Figma, el checkbox de "acepto política de privacidad" aparece con tratamiento distinto según el formulario:
- **Hero (formulario principal)**: cuadrado en mobile y **redondo** en desktop.
- **Modal de contacto** y **calculadora (paso 4)**: cuadrado.
- **Implementación**: he unificado los tres a checkbox cuadrado en todos los viewports y formularios. Razones:
  - Conceptualmente es el mismo control ("acepto política de privacidad") en los tres sitios — debería verse igual.
  - El patrón estándar en formularios web para "acepto términos" es cuadrado; el redondo se asocia con radio buttons (selección excluyente), no con un único toggle de aceptación.
  - Tener dos formas para el mismo control crea ruido visual sin aportar nada funcional.
- En un caso real lo confirmaría con la persona de diseño antes de aplicar el cambio — puede haber una intención que no veo (jerarquía visual, decisión de marca, etc.).

### 2. Texto del enlace de privacidad: distinto en mobile vs desktop
- **Hero mobile**: "Política de Privacidad".
- **Hero desktop**: "Política de Protección de Datos".
- **Modal de contacto**: "política de privacidad" (en minúsculas).
- **Implementación**: dos `<span>` con `md:hidden` / `hidden md:inline` para alternar el copy según viewport. El `href` apunta siempre a la misma página (`/politica-de-privacidad`).
- En un caso real preguntaría qué término prefiere legal/marca y unificaría — son dos conceptos distintos en RGPD aunque coloquialmente se usen como sinónimos.

### 3. Color del enlace de privacidad: distinto según contexto
En el Figma, el enlace a la política de privacidad aparece con tratamiento distinto según el formulario:
- **Calculadora (paso 4)**: en color `brand` (azul) directamente.
- **Hero y modal de contacto**: en color de texto neutro.
- **Implementación**: he unificado los tres en color `brand` porque conceptualmente es el mismo enlace ("acepto política de privacidad") y debería verse igual en cualquier formulario de la landing. Tomo como referencia el tratamiento de la calculadora porque es el más visible y reconocible como enlace.
- En un caso real lo confirmaría con la persona de diseño antes de aplicar el cambio — puede haber una intención detrás (jerarquía visual del Hero, peso del modal, etc.) que no estoy viendo.

### 4. Iconos de los selectores de suministro distintos según viewport
En la sección "Compara nuestras ofertas en energía", los iconos de las tarjetas Solo Luz / Luz+Gas / Solo Gas no coinciden entre mobile y desktop:
- **Mobile**: bombilla / rayo / aspas-ventilador.
- **Desktop**: rayo / rayo+llama / llama.
- **Implementación**: `IntentCard` recibe `mobileIcons` y `desktopIcons` y muestra unos u otros con `md:hidden` / `hidden md:flex`.
- En un caso real propondría un único set para reforzar consistencia de marca y reducir mantenimiento de assets.

### 5. Destino del enlace "Ofertas" del header
La sección con id `#ofertas` (a la que apunta el botón "Ofertas" del header) es la que titula "Compara nuestras ofertas en energía" (selectores), no la de tarjetas de tarifas, porque su copy literal habla de "ofertas". El scroll a esa sección se hace de forma suave (`scroll-behavior: smooth` global) y la sección lleva `scroll-mt-24` para que el header sticky no tape el título al llegar.
- En un caso real validaría con producto a qué espera la persona usuaria que la lleve ese enlace.

### 6. Border-radius de las cards de electrodomésticos
En el paso 2 de la calculadora (`/calcula-tu-tarifa`), las cards de electrodomésticos en el Figma vienen con `border-radius` distintos según la posición: las de la izquierda con sólo las esquinas derechas redondeadas, otras con todas las esquinas, etc. Lo interpreté como un despiste del diseño (no hay un patrón visual que justifique esa diferencia: no son cards "agrupadas" por una hoja contínua) y unifiqué todas para mantener consistencia con el resto de cards de la landing.
- En un caso real lo confirmaría con la persona de diseño antes de aplicar el cambio.

### 7. URLs en español
Las rutas públicas (`/calcula-tu-tarifa`, `/aviso-legal`, `/politica-de-privacidad`, `/cookies`) están en español aunque el resto del código (componentes, props, archivos) esté en inglés. Decisión consciente porque la landing es de captación: las URLs en idioma nativo mejoran el Quality Score en Google Ads / Meta (mejor match anuncio↔landing → CPC más bajo), suben el CTR orgánico (URL legible en SERP), y dan mejor experiencia al compartir el enlace en WhatsApp o redes.
- Slugs sin tildes (`politica-de-privacidad`, no `política-de-privacidad`) para evitar problemas de encoding (`%C3%AD` en barras de navegador).
- En un proyecto con alcance internacional desde el inicio, optaría por URLs en inglés.

### 8. Labels de los inputs del paso 4 de la calculadora
En el Figma, los labels "TELÉFONO DE CONTACTO" y "CÓDIGO POSTAL" del paso 4 aparecen en mayúsculas. El resto de inputs de la landing (Hero, Modal de contacto) usan labels capitalizados normales. Decidí mantenerlos en el mismo formato que el resto del proyecto ("Teléfono de contacto" / "Código postal") por consistencia: los labels deberían comportarse igual en todos los formularios de la landing.
- El asterisco de obligatoriedad sí lo mantengo en "Teléfono de contacto" (es campo requerido) y lo retiro de "Código postal" (opcional).
- En un caso real preguntaría a la persona de diseño qué formato prefiere para los labels y lo unificaría.

## Cómo ejecutar el proyecto

Desde la raíz del proyecto:

| Comando            | Acción                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Instala las dependencias                     |
| `npm run dev`      | Arranca el servidor local en `localhost:4321`|
| `npm run build`    | Genera la build de producción en `./dist/`   |
| `npm run preview`  | Previsualiza la build de producción          |
| `npm run format`   | Formatea el código con Prettier              |

## Estructura

```text
/
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── calcula-tu-tarifa.astro
│   │   ├── aviso-legal.astro
│   │   ├── politica-de-privacidad.astro
│   │   └── cookies.astro
│   ├── scripts/
│   │   └── inline-validation.ts
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

### Convenciones

- **Foundations primero**: todos los colores, radios, sombras y tipografías están declarados como tokens en `src/styles/global.css` (`@theme`). Los componentes consumen las clases derivadas (`bg-brand`, `rounded-md`, `shadow-hero`, etc.) en vez de hardcodear valores.
- **Mobile-first**: las clases base aplican a mobile, las variantes `md:` añaden los cambios para desktop.
- **Componentes en dos carpetas**: `ui/` para piezas reutilizables y `layout/` para estructuras de página (Header, Hero, secciones, ...).

