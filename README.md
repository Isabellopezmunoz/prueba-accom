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

### Bloque 3 — Calculadora
> ⚠️ Pendiente de implementar.

Calculadora paso a paso con la interactividad descrita en el diseño: avanzar, retroceder y mostrar un mensaje final tras dejar los datos. Las tres opciones de la primera pregunta siguen el mismo flujo.

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
│   ├── assets/                   # SVGs (logo, iconos del diseño)
│   ├── components/
│   │   ├── ui/                   # Piezas reutilizables (Button, Input, Select, Checkbox, Logo, Badge, IntentButton, PricingCard, Modal)
│   │   └── layout/               # Estructuras de página (Header, Hero, PricingSection, ContactModal)
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css            # Foundations (colores, tipografía, sombras, radios) en @theme
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

### Convenciones

- **Foundations primero**: todos los colores, radios, sombras y tipografías están declarados como tokens en `src/styles/global.css` (`@theme`). Los componentes consumen las clases derivadas (`bg-brand`, `rounded-md`, `shadow-hero`, etc.) en vez de hardcodear valores.
- **Mobile-first**: las clases base aplican a mobile, las variantes `md:` añaden los cambios para desktop.
- **Componentes en dos carpetas**: `ui/` para piezas reutilizables y `layout/` para estructuras de página (Header, Hero, secciones).
- **Sin punto y coma**: Prettier configurado con `semi: false`.
