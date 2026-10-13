# Carpeta de proyecto

Copiá esta carpeta para cada análisis. Lo que tiene que durar más que una conversación vive acá, y no en el chat.

| Carpeta o archivo | Qué va |
| --- | --- |
| `proyecto.md` | Pregunta, unidad de análisis, corpus, qué se delega al modelo y cuidados |
| `material/` | Los textos a analizar, ya anonimizados, con párrafos o turnos numerados: `[1]`, `[2]`... |
| `material/fuentes.csv` | Una fila por documento: tipo, fecha, perfil, consentimiento, si está anonimizado |
| `esquemas/` | Las categorías vigentes, en CSV: `codigo,definicion,incluye,excluye,ejemplo,fuente` |
| `prompts/` | Un archivo de texto por prompt. Si cambia, se guarda una versión nueva con otro nombre |
| `salidas/` | La respuesta de cada corrida, sin editar, con el mismo nombre que su prompt |
| `registro.csv` | Una fila por corrida: herramienta, modelo, configuración, quién revisó |
| `decisiones.csv` | Una fila por decisión del equipo sobre el esquema o el procedimiento |
| `notas-de-traspaso.md` | La última nota de traspaso, para abrir una conversación nueva |

## Cómo se usa con un proyecto de la herramienta

1. Crear un proyecto en la herramienta (Claude, ChatGPT), un Gem (Gemini) o un cuaderno (NotebookLM).
2. Pegar como instrucciones el texto de `prompts/instrucciones-proyecto.txt`, adaptado.
3. Subir el esquema vigente y el material que se va a analizar.
4. Abrir una conversación por documento o por paso. Al terminar, guardar la salida en `salidas/` y sumar la fila en `registro.csv`.
5. Si el equipo cambia un criterio, anotarlo en `decisiones.csv`, actualizar el esquema y volver a subirlo al proyecto.

Antes de subir material de campo, revisar la configuración de privacidad de la herramienta y el consentimiento informado.
