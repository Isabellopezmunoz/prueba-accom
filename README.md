# Prueba técnica — Maquetación Web y Desarrollo Frontend (Accom)

Landing page desarrollada como prueba técnica. El objetivo es trasladar el diseño propuesto a código funcional, cuidando el detalle, la lógica de interacción y la experiencia de usuario, con un resultado totalmente responsive.

## Stack

- [Astro](https://astro.build/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first, foundations en `@theme`)
- TypeScript
- Prettier (sin punto y coma, plugin `prettier-plugin-astro`)

## Bloques

La landing está compuesta por tres bloques principales:

### Bloque 1 — Hero (Banner + formulario)
Banner con el título destacado, badge, párrafo descriptivo y un formulario lateral con la lógica de validaciones (campos requeridos, checkbox de privacidad).

- Mobile-first: stack vertical con la card del formulario debajo del texto.
- Desktop: dos columnas (texto izquierda 770px, formulario derecha 446px) sin gap entre ellas, alineadas con el ancho del header.
- Selector de tipo de tarifa (Luz / Gas / Luz+gas) como botones con icono.
- Selector custom "¿Cuándo es tu mayor consumo?" con dropdown propio (no usa el `<select>` nativo del navegador).
- Inputs de teléfono y código postal con autocompletado y validación nativa.
- Checkbox cuadrado en mobile y redondo en desktop.
- Overlay azul difuso (`bg-brand/5` con blur 64px) detrás del formulario.

### Bloque 2 — Tarifas
Cuatro cards de tarifa (3 de luz + 1 dual destacada como "TOP VENTAS"), con kicker, título, lista de bullets con check verde y dos CTAs por card ("Contratar" y "Calcula tu tarifa").

- **Desktop**: grid de 4 columnas, todas las cards visibles, alineadas a la misma altura.
- **Mobile**: tabs (`Tarifas luz` / `Tarifa dual` / `Tarifas gas`) + carrusel horizontal con scroll-snap. Las tabs y el carrusel están sincronizados:
  - Click en una tab → el carrusel hace smooth scroll a la card correspondiente.
  - Swipe manual del carrusel → la tab activa se actualiza al detectar la card centrada.
  - La pill azul activa se desliza con `transform: translateX` y `transition` para evitar el salto.
- Hover sobre cards no destacadas (solo desktop) cambia el borde a azul.
- La card destacada lleva un badge "TOP VENTAS" en la esquina superior derecha (rectángulo naranja con la esquina inferior izquierda redondeada para "morder" la card).

### Bloque 3 — Selectores de oferta + Calculadora
Sección "Compara nuestras ofertas en energía" con tres tarjetas de selección (Solo Luz / Luz+Gas / Solo Gas). La tarjeta dual lleva el badge "Recomendado". Es la sección a la que apunta el botón "Ofertas" del header.

> ⚠️ La calculadora paso a paso está pendiente de implementar.

Calculadora con la interactividad descrita en el diseño: avanzar, retroceder y mostrar un mensaje final tras dejar los datos. Las tres opciones de la primera pregunta siguen el mismo flujo.

### Footer
Footer con logo y enlaces a las páginas legales (`Aviso Legal`, `Política de Privacidad`, `Cookies`).

- Mobile: stack vertical, logo arriba y enlaces debajo en una fila.
- Desktop: `flex` horizontal con `justify-between`, logo a la izquierda y enlaces a la derecha.
- Enlaces con el mismo patrón de hover/active que el header (color `text-text/80` → `text-brand`).

### Páginas legales
Tres páginas estáticas (`/legal-notice`, `/privacy-policy`, `/cookies`) generadas a partir de un componente compartido `LegalPage.astro` que recibe `title`, `intro`, `updatedAt` y un array de `sections`. Reutilizan `Header`, `Footer` y `ContactModal`.

Los copys son inventados pero coherentes con el tono de la landing ("comparador", "sin trucos, sin permanencia", etc.).

### Opcional — Modal de contacto ("Contacta con un experto")
Modal accesible reutilizable que se dispara desde:
- "Contactar" del header (desktop y panel mobile).
- "Contratar" de cada PricingCard.

Tres estados internos:

| Estado | Cuándo se muestra |
| :----- | :---------------- |
| **Form** | Estado inicial. Datos de contacto directo (`tel:900000000`) + formulario "Te llamamos" con teléfono y checkbox de privacidad. |
| **Success** | Tras enviar el formulario con éxito. Mensaje "¡Solicitud recibida con éxito!". |
| **Error** | Tras un fallo simulado de envío. Mensaje "¡Ups! Algo ha salido mal" sobre un modal con borde rojo. Para volver a intentarlo, el usuario cierra el modal y lo abre de nuevo. |

Como no hay backend, el resultado del envío se simula con `Math.random() < 0.8` (80% éxito / 20% error).

Accesibilidad: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apuntando al título del modal.

## Notas sobre el diseño

Durante la maquetación detecté algunas inconsistencias entre el viewport mobile y el desktop del Figma. He optado por **respetar fielmente el diseño en cada viewport**, asumiendo que son decisiones intencionadas. En un proyecto real habría preguntado a la persona de diseño antes de implementarlas, para confirmar si son a propósito o despistes y, en este último caso, unificarlas. Las dejo aquí para dar visibilidad:

### 1. Checkbox de privacidad: forma distinta según el contexto
- **Hero (formulario principal)**: checkbox cuadrado en mobile y redondo en desktop.
- **Modal de contacto**: checkbox cuadrado.
- **Implementación**: el componente `Checkbox` acepta una prop `shape: "round" | "square"` para soportar ambos casos.
- En condiciones normales preguntaría si es deseado tener dos formas distintas para el mismo control conceptual ("acepto política de privacidad").

### 2. Texto del enlace de privacidad: distinto en mobile vs desktop
- **Hero mobile**: "Política de Privacidad".
- **Hero desktop**: "Política de Protección de Datos".
- **Modal de contacto**: "política de privacidad" (en minúsculas).
- **Implementación**: dos `<span>` con `md:hidden` / `hidden md:inline` para alternar el copy según viewport. El `href` apunta siempre a la misma página (`/privacy-policy`).
- En un caso real preguntaría qué término prefiere legal/marca y unificaría — son dos conceptos distintos en RGPD aunque coloquialmente se usen como sinónimos.

### 3. Iconos de los selectores de suministro distintos según viewport
En la sección "Compara nuestras ofertas en energía", los iconos de las tarjetas Solo Luz / Luz+Gas / Solo Gas no coinciden entre mobile y desktop:
- **Mobile**: bombilla / rayo / aspas-ventilador.
- **Desktop**: rayo / rayo+llama / llama.
- **Implementación**: `IntentCard` recibe `mobileIcons` y `desktopIcons` y muestra unos u otros con `md:hidden` / `hidden md:flex`.
- En un caso real propondría un único set para reforzar consistencia de marca y reducir mantenimiento de assets.

### 4. Destino del enlace "Ofertas" del header
La sección con id `#ofertas` (a la que apunta el botón "Ofertas" del header) es la que titula "Compara nuestras ofertas en energía" (selectores), no la de tarjetas de tarifas, porque su copy literal habla de "ofertas". El scroll a esa sección se hace de forma suave (`scroll-behavior: smooth` global) y la sección lleva `scroll-mt-24` para que el header sticky no tape el título al llegar.
- En un caso real validaría con producto a qué espera la persona usuaria que la lleve ese enlace.

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
│   │   ├── legal-notice.astro
│   │   ├── privacy-policy.astro
│   │   └── cookies.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

### Convenciones

- **Foundations primero**: todos los colores, radios, sombras y tipografías están declarados como tokens en `src/styles/global.css` (`@theme`). Los componentes consumen las clases derivadas (`bg-brand`, `rounded-md`, `shadow-hero`, etc.) en vez de hardcodear valores.
- **Mobile-first**: las clases base aplican a mobile, las variantes `md:` añaden los cambios para desktop.
- **Componentes en dos carpetas**: `ui/` para piezas reutilizables y `layout/` para estructuras de página (Header, Hero, secciones).

