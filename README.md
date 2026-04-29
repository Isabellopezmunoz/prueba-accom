# Prueba técnica — Maquetación Web y Desarrollo Frontend (Accom)

Landing page desarrollada como prueba técnica. El objetivo es trasladar el diseño propuesto a código funcional, cuidando el detalle, la lógica de interacción y la experiencia de usuario, con un resultado totalmente responsive.

## Stack

- [Astro](https://astro.build/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- TypeScript

## Bloques

La landing está compuesta por tres bloques principales:

### Bloque 1 — Banner
Banner con el diseño propuesto y un formulario de calculadora visible con su lógica de validaciones (checks). Al enviar los datos se muestra un mensaje de agradecimiento.

### Bloque 2 — Tarifas
Sección de tarifas con un selector para alternar entre las distintas opciones y un carrusel para mejorar la visibilidad en dispositivos móviles.

### Bloque 3 — Calculadora
Calculadora paso a paso con la interactividad descrita en el diseño: avanzar, retroceder y mostrar un mensaje final tras dejar los datos. Las tres opciones de la primera pregunta siguen el mismo flujo.

### Opcional
Popup en los botones del diseño para dejar los datos, con mensaje de gracias al finalizar.

## Cómo ejecutar el proyecto

Desde la raíz del proyecto:

| Comando            | Acción                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Instala las dependencias                     |
| `npm run dev`      | Arranca el servidor local en `localhost:4321`|
| `npm run build`    | Genera la build de producción en `./dist/`   |
| `npm run preview`  | Previsualiza la build de producción          |

## Estructura

```text
/
├── public/
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```
