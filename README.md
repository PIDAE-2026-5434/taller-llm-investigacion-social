# LLMs en investigación social

Material de la Parte 2 del taller PIDAE 2026, "Interactuando con LLMs": tipos de tareas, técnicas, armado de prompts, errores frecuentes, dos casos de aplicación y un checklist de validación.

El repositorio tiene dos cosas: el material como archivos (prompts, esquema de códigos, entrevista, salidas y registro) y un sitio hecho con [Astro](https://astro.build) que los muestra.

## Estructura

| Carpeta o archivo | Qué tiene |
| --- | --- |
| `prompts/` | Un archivo `.txt` por prompt, agrupados por sección |
| `esquemas/` | Esquemas de códigos en CSV, con una fila por categoría |
| `entrevistas/` | La entrevista sintética del Caso 2. Es inventada |
| `discursos/` | `fuentes.csv` con la lista de discursos, y los textos una vez bajados |
| `salidas/` | Respuestas guardadas. `salidas/<id>.txt` corresponde a `prompts/<id>.txt` |
| `registro.csv` | Una fila por corrida, con herramienta, modelo, esfuerzo y fecha |
| `scripts/` | `bajar_discursos.mjs` |
| `src/pages/guia/` | El texto de las siete secciones, en MDX |
| `src/lib/sitio.js` | Título del sitio y lista de secciones, que define orden y navegación |
| `src/components/`, `src/layouts/`, `src/styles/` | Componentes y diseño del sitio |

## Verlo en local

Hace falta Node 22.12 o superior.

```sh
npm install
npm run dev
```

El sitio queda en `http://localhost:4321`. `npm run build` genera la versión estática en `dist/`.

## Editar el contenido

Cada sección es un archivo de `src/pages/guia/`. Es Markdown, con algunos componentes:

| Componente | Qué muestra |
| --- | --- |
| `<Prompt id="tecnicas/few-shot" />` | El archivo `prompts/tecnicas/few-shot.txt`, con botón de copiar. Si existe la salida, suma la pestaña Salida |
| `<Prompt id="..." anotado />` | El mismo prompt, partido en tramos con su rótulo |
| `<Texto archivo="entrevistas/..." />` | Un archivo de texto cualquiera del repositorio |
| `<Esquema id="responsable" />` | La tabla de `esquemas/responsable.csv` |
| `<Registro />` | La tabla de `registro.csv` |
| `<Ficha>`, `<Eleccion>`, `<Cadena>`, `<Iteracion>` | Bloques visuales. Los datos se pasan en el mismo archivo MDX |

Para sumar una sección hay que crear el archivo en `src/pages/guia/` y agregarla a la lista de `src/lib/sitio.js`.

## Prompts

Cada prompt existe una sola vez, en `prompts/`. Dos marcas propias:

- Una línea `@esquema responsable` se reemplaza por el contenido de `esquemas/responsable.csv`, escrito como lista. Así las definiciones se corrigen en un solo lugar.
- Las líneas que empiezan con `#>` rotulan el tramo que sigue. Sirven para la vista anotada del sitio y no forman parte del prompt.

El botón Copiar del sitio entrega el prompt con el esquema ya incluido y sin los rótulos.

## Guardar una salida

1. Correr el prompt y guardar la respuesta, sin editar, en `salidas/<mismo camino que el prompt>.txt`.
2. Sumar una fila a `registro.csv`, con ese camino en la columna `salida`.

El sitio muestra la pestaña Salida en ese prompt y toma del registro la herramienta, el modelo, el esfuerzo y la fecha.

## Discursos

`discursos/fuentes.csv` lista los discursos que usa el taller. Para bajarlos:

```sh
npm run discursos
```

El script guarda cada discurso como `discursos/<id>.txt`, con los párrafos numerados y la fuente en el encabezado. El recorte de párrafos es heurístico y se probó solo con una página de ejemplo, no contra el sitio de Casa Rosada. Después de bajar un discurso conviene abrir el archivo y compararlo con la página original.

Los discursos de Casa Rosada tienen licencia [Creative Commons Reconocimiento 2.5 Argentina](https://creativecommons.org/licenses/by/2.5/ar/).

## Publicación

El sitio se publica en GitHub Pages con cada push a `main`, mediante `.github/workflows/deploy.yml`. Queda en `https://<cuenta>.github.io/<repositorio>/`.

La primera vez hay que activar Pages: en el repositorio, **Settings**, **Pages**, y en **Source** elegir **GitHub Actions**.

## Pendientes

- Elegir los dos discursos del Caso 1, sumarlos a `discursos/fuentes.csv` y bajarlos.
- Reemplazar los párrafos inventados de las secciones 2 y 3 por párrafos reales de esos discursos.
- Correr cada prompt en un chat temporal y guardar las salidas. La única salida guardada es provisoria.
- Revisar el esquema de códigos de `esquemas/responsable.csv`.
- Definir la licencia del material.
- Revisar si las referencias de la sección 3 alcanzan para investigación social o conviene sumar otras.
