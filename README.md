# Prueba técnica — Maquetación Web y Desarrollo Frontend (Accom)

Landing page desarrollada como prueba técnica. El objetivo es trasladar el diseño propuesto a código funcional, cuidando el detalle, la lógica de interacción y la experiencia de usuario, con un resultado totalmente responsive.

## Stack

- [Astro](https://astro.build/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first, foundations en `@theme`)
- TypeScript
- Prettier

## Cómo ejecutar el proyecto

### Requisitos previos

- **Node.js 18+** ([descargar aquí](https://nodejs.org)).

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/Isabellopezmunoz/prueba-accom.git
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Arrancar el servidor de desarrollo**

```bash
npm run dev
```

**4. Abrir el navegador**

Ve a [http://localhost:4321](http://localhost:4321) y verás la landing funcionando.

### Otros comandos útiles

| Comando            | Acción                                                       |
| :----------------- | :----------------------------------------------------------- |
| `npm run build`    | Genera la build de producción optimizada en `./dist/`        |
| `npm run preview`  | Sirve la build de producción para revisar el resultado final |
| `npm run format`   | Formatea todo el código con Prettier                         |

#### Mejoras de UX implementadas

Pequeños extras propuestos como mejora de la experiencia de usuario más allá del Figma original:

1. **Modal de éxito (en la vista de la calculadora)→ redirige al home al cerrar.** No tiene sentido dejar a la persona en el último paso de la calculadora con los datos rellenos después de un envío exitoso. Al cerrar el modal de éxito redirige a `/`.

2. **Persistencia del estado en `sessionStorage`.** Si la persona refresca la página o cierra el navegador antes de terminar la calculadora, recuperamos el paso en el que estaba y los datos ya rellenados (suministro, electrodomésticos, franja horaria, teléfono, CP, checkbox). Limpiamos el storage al confirmar el envío con éxito. Usamos `sessionStorage` (no `localStorage`) por privacidad: la información desaparece al cerrar la pestaña.

3. **Borde unificado en cards "Recomendado".** En el Figma, la card "Luz + Gas" del paso 1 de la calculadora aparece **sin borde** en estado normal, pero la card "Luz + Gas" de la sección "Compara nuestras ofertas en energía" sí lleva un borde brand-soft de 2px. He unificado ambas para que cualquier card marcada como "Recomendado" lleve siempre el mismo borde brand-soft, independientemente del bloque donde aparezca. Razones:
   - **Consistencia visual**: el badge "Recomendado" debe verse y comportarse igual en toda la landing.
   - **Atención del usuario**: el borde refuerza el badge y guía la mirada hacia la opción destacada (objetivo del propio badge).
   - **Mantenibilidad**: una sola regla — "card recomendada → borde brand-soft" — frente a tener que recordar excepciones por bloque.
   - En un caso real lo confirmaría con la persona de diseño antes de aplicar el cambio — puede haber una intención que no veo (jerarquía distinta entre los dos bloques, etc.).

## Simulación de envíos: modal de éxito y modal de error

Como esta prueba no tiene backend ni endpoint real al que enviar los formularios, **el resultado del envío se simula** con `Math.random() < 0.8` (80% éxito / 20% error). Aplica a los tres formularios de la landing: el del Hero, el del modal de contacto y el de la calculadora.

Según el resultado, se muestra una de las dos modales:
- **Éxito** → "¡Solicitud recibida con éxito!"
- **Error** → "¡Ups! Algo ha salido mal"

### Sobre la modal de error

En un proyecto real, la modal de error iría acompañada de lógica que la justifica: comprobar el código de respuesta del backend, distinguir tipos de error (4xx vs 5xx, timeout, sin conexión), permitir reintentar o llamar a soporte, registrar el evento en un sistema de tracking, etc.

Aquí, al no haber backend, la modal de error se mantiene únicamente para que el diseño sea **visible y revisable** durante la prueba. Si forzase siempre éxito, el evaluador no podría ver el estado de error que también está en Figma. La probabilidad del 20% es solo para que ambos estados aparezcan al probar la landing varias veces.

## Notas sobre el diseño

### Cómo he leído el Figma y traducido los espaciados

Antes de listar las inconsistencias detectadas, dos disclaimers sobre cómo se ha trabajado el handoff del diseño:

- **Acceso limitado al Figma**: solo dispongo de cuenta gratuita, sin Dev Mode completo. He inspeccionado los nodos con las herramientas a las que tengo acceso (panel de propiedades, copiar valores manualmente, anotaciones del archivo) y he ajustado tamaños, colores y espaciados al valor más cercano que he podido leer. En un proyecto real con Dev Mode tendría acceso directo a tokens de Figma exportables y podría garantizar 1:1 sin lectura manual.
- **Espaciados con `gap` en lugar de `padding`/`margin`**: en muchos puntos del Figma los espacios entre elementos están resueltos con padding-bottom o margin individual de cada hijo. En el código lo he traducido a `flex` con `gap` (a veces con contenedores anidados para tener dos gaps distintos en el mismo bloque). Es más limpio, menos propenso a desincronizarse cuando cambia el contenido, y se adapta mejor a viewports distintos. El resultado visual es idéntico al Figma — solo cambia la herramienta CSS usada.

### Referente  a las fundations

Creo que sería útil añadir a las foundations una página dedicada a los **estados** de los componentes interactivos (hover, active, focus, disabled). Centralizarlos en un solo sitio haría que el handoff fuese aún más rápido y consistente.

En la maquetación he intentado resolver los estados que no estaban explícitos siguiendo la paleta del propio sistema, buscando coherencia con lo ya definido.

### 1. Checkbox de privacidad: forma y tamaño según el contexto
En el Figma, el checkbox de "acepto política de privacidad" aparece con tratamiento distinto según el formulario, en dos ejes:

**Forma:**
- **Hero (formulario principal)**: cuadrado en mobile y **redondo** en desktop.
- **Modal de contacto** y **calculadora (paso 4)**: cuadrado.

**Tamaño:**
- **Hero y modal de contacto**: 16×16.
- **Calculadora (paso 4)**: 20×20.

**Implementación:**
- He unificado los tres a checkbox **cuadrado** en todos los viewports y formularios. Razones:
  - Conceptualmente es el mismo control ("acepto política de privacidad") en los tres sitios — debería verse igual.
  - El patrón estándar en formularios web para "acepto términos" es cuadrado; el redondo se asocia con radio buttons (selección excluyente), no con un único toggle de aceptación.
  - Tener dos formas para el mismo control crea ruido visual sin aportar nada funcional.
- He **mantenido los dos tamaños** (16 / 20) y los he expuesto como prop `size="sm" | "md"` del componente `Checkbox`. La diferencia de tamaño sí tiene justificación funcional: en la calculadora el checkbox vive aislado al final de un formulario amplio (más target táctil, más jerarquía), mientras que en Hero y modal va dentro de bloques más densos donde el tamaño compacto encaja mejor.
- En un caso real confirmaría la decisión sobre la forma con la persona de diseño antes de aplicar el cambio — puede haber una intención que no veo (jerarquía visual, decisión de marca, etc.).


### 2. Color del enlace de privacidad: distinto según contexto
En el Figma, el enlace a la política de privacidad aparece con tratamiento distinto según el formulario:
- **Calculadora (paso 4)**: en color `brand` (azul) directamente.
- **Hero y modal de contacto**: en color de texto neutro.
- **Implementación**: he unificado los tres en color `brand` porque conceptualmente es el mismo enlace ("acepto política de privacidad") y debería verse igual en cualquier formulario de la landing. Tomo como referencia el tratamiento de la calculadora porque es el más visible y reconocible como enlace.
- En un caso real lo confirmaría con la persona de diseño antes de aplicar el cambio — puede haber una intención detrás (jerarquía visual del Hero, peso del modal, etc.) que no estoy viendo.

### 3. Iconos de los selectores de suministro distintos según viewport
En la sección "Compara nuestras ofertas en energía", los iconos de las tarjetas Solo Luz / Luz+Gas / Solo Gas no coinciden entre mobile y desktop:
- **Mobile**: bombilla / rayo / aspas-ventilador.
- **Desktop**: rayo / rayo+llama / llama.
- **Implementación**: `IntentCard` recibe `mobileIcons` y `desktopIcons` y muestra unos u otros con `md:hidden` / `hidden md:flex`.
- En un caso real propondría un único set para reforzar consistencia de marca y reducir mantenimiento de assets.

### 4. Destino del enlace "Ofertas" del header
La sección con id `#ofertas` (a la que apunta el botón "Ofertas" del header) es la que titula "Compara nuestras ofertas en energía" (selectores), no la de tarjetas de tarifas, porque su copy literal habla de "ofertas". 
- En un caso real validaría con producto a qué espera la persona usuaria que la lleve ese enlace.

### 5. Border-radius de las cards de electrodomésticos
En el paso 2 de la calculadora (`/calcula-tu-tarifa`), las cards de electrodomésticos en el Figma vienen con `border-radius` distintos según la posición: las de la izquierda con sólo las esquinas derechas redondeadas, otras con todas las esquinas, etc. Lo interpreté como un despiste del diseño y unifiqué todas para mantener consistencia con el resto de cards de la landing.
- En un caso real lo confirmaría con la persona de diseño antes de aplicar el cambio.

### 6. URLs en español
Las rutas públicas (`/calcula-tu-tarifa`, `/aviso-legal`, `/politica-de-privacidad`, `/cookies`) están en español aunque el resto del código (componentes, props, archivos) esté en inglés. Decisión consciente porque la landing es de captación: las URLs en idioma nativo mejoran el Quality Score en Google Ads, suben el CTR orgánico, y dan mejor experiencia al compartir el enlace.
- Slugs sin tildes (`politica-de-privacidad`, no `política-de-privacidad`) para evitar problemas de encoding (`%C3%AD` en barras de navegador).
- En un proyecto con alcance internacional desde el inicio, optaría por URLs en inglés.

### 7. Labels de los inputs del paso 4 de la calculadora
En el Figma, los labels "TELÉFONO DE CONTACTO" y "CÓDIGO POSTAL" del paso 4 aparecen en mayúsculas. El resto de inputs de la landing (Hero, Modal de contacto) usan labels capitalizados normales. Decidí mantenerlos en el mismo formato que el resto del proyecto ("Teléfono de contacto" / "Código postal") por consistencia: los labels deberían comportarse igual en todos los formularios de la landing.
- El asterisco de obligatoriedad sí lo mantengo en "Teléfono de contacto" (es campo requerido) y lo retiro de "Código postal" (opcional).
- En un caso real preguntaría a la persona de diseño qué formato prefiere para los labels y lo unificaría.


## SEO

La landing está preparada para indexarse correctamente en buscadores y mostrar previsualizaciones al compartir enlaces. Lo que se ha implementado:

- **Meta tags por página** (`<title>`, `<meta name="description">`) con copys distintos por ruta.
- **Open Graph** y **Twitter Cards** para previsualizaciones en redes sociales.
- **`<link rel="canonical">`** dinámico por página.
- **JSON-LD** con schema `Organization`.
- **`sitemap.xml`** generado automáticamente al hacer build (con `@astrojs/sitemap`).
- **`robots.txt`** apuntando al sitemap.
- **`og-image.svg`** como imagen de previsualización con la marca.

### Aviso sobre la imagen Open Graph

Actualmente se sirve un SVG (/og-image.svg) por simplicidad de la prueba. Aunque en producción habría que exportar a JPG/PNG para que las redes sociales (WhatsApp, X, etc.) muestren la previsualización. 

### Convenciones

- **Foundations primero**: todos los colores, radios, sombras y tipografías están declarados como tokens en `src/styles/global.css` (`@theme`). Los componentes consumen las clases derivadas (`bg-brand`, `rounded-md`, `shadow-hero`, etc.).
- **Mobile-first**: las clases base aplican a mobile y las variantes responsive (`md:`, `lg:`, `xl:`) añaden los cambios para tablet y desktop. Cuando un breakpoint requiere desactivar un estilo previo (por ejemplo, la opacidad de las cards atenuadas del carrusel solo aplica hasta tablet y debe desactivarse en el grid de desktop) uso variantes inversas como `max-xl:` para que el estilo se aplique solo por debajo del breakpoint indicado.
- **Componentes en tres carpetas**: `ui/` para piezas reutilizables (Modal, Input, Button, Select, MobileNav, etc.), `layout/` para estructuras de página (Header, Hero, Footer, ContactModal, ResultModal, secciones, ...) y `wizard/` para el flujo de la calculadora multi-paso (`TariffCalculator`).

