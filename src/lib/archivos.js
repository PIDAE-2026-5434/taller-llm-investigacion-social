// Lee como texto los archivos de material que viven en la raíz del repositorio.
// Cada prompt, esquema, salida y entrevista existe una sola vez, en su carpeta,
// y las páginas del sitio lo incluyen desde acá.

import { csv } from './csv.js';

const crudos = import.meta.glob(
  [
    '/prompts/**/*.txt',
    '/salidas/**/*.txt',
    '/entrevistas/*.txt',
    '/esquemas/*.csv',
    '/discursos/*.csv',
    '/discursos/*.txt',
    '/registro.csv',
  ],
  { query: '?raw', import: 'default', eager: true },
);

const limpiar = (texto) => texto.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();

/** Devuelve el contenido de un archivo del repositorio, o null si no existe. */
export function leer(ruta) {
  const clave = '/' + ruta.replace(/^\//, '');
  return crudos[clave] ?? null;
}

/** Lista las rutas (sin barra inicial) que empiezan con un prefijo. */
export function listar(prefijo) {
  const p = '/' + prefijo.replace(/^\//, '');
  return Object.keys(crudos)
    .filter((k) => k.startsWith(p))
    .map((k) => k.slice(1))
    .sort();
}

/** Filas de esquemas/<id>.csv. Falla el build si el archivo no existe. */
export function esquema(id) {
  const crudo = leer(`esquemas/${id}.csv`);
  if (crudo === null) throw new Error(`No existe esquemas/${id}.csv`);
  return csv(crudo);
}

/** El esquema escrito como lista, que es como entra en un prompt. */
export function esquemaComoTexto(id) {
  return esquema(id)
    .filas.map((f) => {
      let linea = `- "${f.codigo}": ${f.definicion}`;
      if (f.incluye) linea += ` Incluye: ${f.incluye}.`;
      if (f.excluye) linea += ` Excluye: ${f.excluye}.`;
      return linea;
    })
    .join('\n');
}

/**
 * Lee prompts/<id>.txt y devuelve:
 *  - limpio: el prompt listo para copiar, con los esquemas ya incluidos
 *  - tramos: el mismo prompt partido por las líneas "#> Etiqueta"
 *
 * Dos marcas propias dentro de un archivo de prompt:
 *  - "@esquema <id>" en una línea sola se reemplaza por esquemas/<id>.csv
 *  - "#> Etiqueta" anota el tramo que sigue. No forma parte del prompt.
 */
export function prompt(id) {
  const crudo = leer(`prompts/${id}.txt`);
  if (crudo === null) throw new Error(`No existe prompts/${id}.txt`);
  const expandido = crudo
    .replace(/\r/g, '')
    .replace(/^@esquema\s+(\S+)\s*$/gm, (_, e) => esquemaComoTexto(e));

  const tramos = [];
  let actual = { etiqueta: null, lineas: [] };
  const cerrar = () => {
    const texto = limpiar(actual.lineas.join('\n'));
    if (texto) tramos.push({ etiqueta: actual.etiqueta, texto });
  };
  for (const linea of expandido.split('\n')) {
    if (linea.startsWith('#>')) {
      cerrar();
      actual = { etiqueta: linea.slice(2).trim(), lineas: [] };
    } else {
      actual.lineas.push(linea);
    }
  }
  cerrar();

  return { id, ruta: `prompts/${id}.txt`, limpio: tramos.map((t) => t.texto).join('\n\n'), tramos };
}

/** La salida guardada de un prompt y la fila del registro que la describe. */
export function salidaDe(id) {
  const ruta = `salidas/${id}.txt`;
  const texto = leer(ruta);
  if (texto === null) return null;
  const corrida = registro().filas.find((f) => f.salida === ruta) ?? null;
  return { ruta, texto: limpiar(texto), corrida };
}

/** registro.csv, con una fila por corrida. */
export function registro() {
  const crudo = leer('registro.csv');
  return crudo === null ? { columnas: [], filas: [] } : csv(crudo);
}

export { limpiar, csv };
