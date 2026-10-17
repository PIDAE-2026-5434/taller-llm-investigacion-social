# LLMs en investigación social

Material de la Parte 2 del taller PIDAE 2026, "Interactuando con LLMs": organización del trabajo, tipos de tareas, técnicas, armado de prompts, errores frecuentes, dos casos de aplicación y un checklist de validación.

El repositorio tiene dos cosas: el material como archivos (discursos, entrevistas, prompts, esquemas, salidas y registro) y un sitio hecho con [Astro](https://astro.build) que los muestra. El taller no tiene demostraciones en vivo: cada prompt tiene su salida guardada.

## Estructura

| Carpeta o archivo | Qué tiene |
| --- | --- |
| `prompts/` | Un archivo `.txt` por prompt, agrupados por sección |
| `esquemas/` | Esquemas de códigos en CSV, con una fila por categoría |
| `entrevistas/` | Dos entrevistas y un grupo focal del corpus FOUBA (CONICET) para el Caso 2, con `fuentes.csv`. Licencia CC BY-NC-SA 2.5 |
| `discursos/` | Los discursos que usa el taller, como texto numerado, y `fuentes.csv` con su lista |
| `salidas/` | Respuestas guardadas. `salidas/<id>.txt` corresponde a `prompts/<id>.txt`; `salidas/<id>--<variante>.txt` es otra corrida del mismo prompt. También los informes de verificación de citas |
| `registro.csv` | Una fila por corrida, con herramienta, modelo, esfuerzo y fecha |
| `skills/` | La skill `grilla-de-menciones` del Caso 2 |
| `plantilla/` | Una carpeta de proyecto para copiar en cada análisis |
| `scripts/` | `preparar_discursos.mjs`, `armar_corridas.mjs` (Node) y `verificar_citas.py` (Python) |
| `src/pages/guia/` | El texto de las ocho secciones, en MDX |
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
| `<Prompt id="..." tipo="anti" />` | El prompt marcado como antipatrón (`tipo="patron"` para el patrón recomendado) |
| `<Prompt id="..." variantes />` | Suma una pestaña por cada `salidas/<id>--<variante>.txt` |
| `<Archivo archivo="salidas/..." />` | Un informe en Markdown o una planilla CSV de salida |
| `<Seguridad>` | Recuadro de seguridad |
| `<Texto archivo="entrevistas/..." />` | Un archivo de texto cualquiera del repositorio |
| `<Esquema id="responsable" />` | La tabla de `esquemas/responsable.csv` |
| `<Registro />` | La tabla de `registro.csv` |
| `<Ficha>`, `<Eleccion>`, `<Cadena>`, `<Iteracion>` | Bloques visuales. Los datos se pasan en el mismo archivo MDX |

Para sumar una sección hay que crear el archivo en `src/pages/guia/` y agregarla a la lista de `src/lib/sitio.js`.

## Prompts

Cada prompt existe una sola vez, en `prompts/`. Marcas propias, cada una en una línea sola:

- `@esquema responsable` se reemplaza por `esquemas/responsable.csv`, escrito como lista. Las definiciones se corrigen en un solo lugar.
- `@material discursos/apertura-sesiones-2026.txt 112-131` se reemplaza por esos párrafos. Sin rango, por el archivo completo.
- `@salida caso-1/p3-patron` se reemplaza por la salida guardada de ese prompt.
- `@continua caso-1/p1-patron` indica que el mensaje va en la misma conversación que ese prompt.
- Las líneas que empiezan con `#>` rotulan el tramo que sigue. Sirven para la vista anotada y no forman parte del prompt.

En el sitio, el material y las salidas aparecen entre corchetes. El botón Copiar entrega el prompt completo, listo para pegar. La expansión está en `src/lib/prompts.js` y la usan el sitio y los scripts.

## Correr un prompt y guardar la salida

```sh
npm run corridas -- caso-1/p3-patron
```

Arma `corridas/caso-1/p3-patron.txt` con el mensaje completo; si el prompt continúa otra conversación, antepone los mensajes anteriores con sus respuestas. La carpeta `corridas/` no se versiona.

1. Pegar ese texto en una conversación nueva y guardar la respuesta, sin editar, en `salidas/<mismo camino que el prompt>.txt`.
2. Sumar una fila a `registro.csv`, con ese camino en la columna `salida`.
3. Verificar las citas:

```sh
python3 scripts/verificar_citas.py salidas/caso-1/p3-patron.txt discursos/apertura-sesiones-2026.txt
```

Las salidas de este repositorio se generaron el 12 de octubre de 2026 con agentes de Claude sin contexto previo, como aproximación a lo que responde claude.ai.

## Discursos

Los discursos salen del [sitio de Casa Rosada](https://www.casarosada.gob.ar/informacion/discursos), y cada archivo lleva en el encabezado el enlace a su página. `discursos/fuentes.csv` lista los que usa el taller. Para regenerar los textos numerados hace falta un CSV local con las columnas `id,titulo,fecha,url,texto` en `discursos/discursos.csv`, que no se versiona:

```sh
npm run discursos
```

Los discursos de Casa Rosada tienen licencia [Creative Commons Reconocimiento 2.5 Argentina](https://creativecommons.org/licenses/by/2.5/ar/).

## Entrevistas

Los archivos de `entrevistas/` son una adaptación de tres registros de Moran, Lourdes (2026), *Corpus de entrevistas, observaciones de clase y grupos focales sobre usos de inteligencia artificial generativa en la enseñanza de Odontología (FOUBA), 2024–2026*, CONICET, http://hdl.handle.net/11336/294888. Se pasaron de .docx a texto, se numeraron los turnos y se quitaron las notas del equipo de investigación. El corpus y estas adaptaciones tienen licencia [Creative Commons Atribución-NoComercial-CompartirIgual 2.5](https://creativecommons.org/licenses/by-nc-sa/2.5/).

## Publicación

El sitio se publica en GitHub Pages con cada push a `main`, mediante `.github/workflows/deploy.yml`. Queda en `https://<cuenta>.github.io/<repositorio>/`.

La primera vez hay que activar Pages: en el repositorio, **Settings**, **Pages**, y en **Source** elegir **GitHub Actions**.

## Pendientes

- Rechequear las salidas en ChatGPT y anotar las diferencias grandes.
- Definir la licencia del material.
