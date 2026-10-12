// Las salidas de los modelos vienen en Markdown, como las muestra una app de chat.
// En el sitio se ven formateadas; el botón de copiar sigue copiando el texto original.
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export const md = (texto) => marked.parse(texto ?? '');
