// Lee como texto los archivos de material que viven en la raíz del repositorio.
// Cada prompt, esquema, salida y entrevista existe una sola vez, en su carpeta,
// y las páginas del sitio lo incluyen desde acá.

import { csv } from './csv.js';
import { expandir, esquemaComoTexto as esquemaATexto, limpiar } from './prompts.js';

const crudos = import.meta.glob(
  [
    '/prompts/**/*.txt',
    '/salidas/**/*.txt',
    '/entrevistas/*.{txt,csv}',
    '/salidas/**/*.{csv,md}',
    '/esquemas/*.csv',
    '/discursos/fuentes.csv',
    '/discursos/*.txt',
    '/skills/**/*.md',
    '/plantilla/**/*.{md,csv,txt}',
    '/registro.csv',
  ],
  { query: '?raw', import: 'default', eager: true },
);

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
  return esquemaATexto(leer(`esquemas/${id}.csv`));
}

/**
 * Lee prompts/<id>.txt y devuelve:
 *  - limpio: el prompt como se muestra en la página, con el material entre corchetes
 *  - completo: el prompt listo para pegar, con esquemas, material y salidas incluidos
 *  - tramos: el prompt de la página partido por las líneas "#> Etiqueta"
 *  - continua: el id del prompt anterior, si va en la misma conversación
 * Las marcas están explicadas en src/lib/prompts.js.
 */
export function prompt(id) {
  const crudo = leer(`prompts/${id}.txt`);
  if (crudo === null) throw new Error(`No existe prompts/${id}.txt`);
  const sitio = expandir(crudo, leer, 'sitio');
  // Si falta una salida que el prompt incluye, se copia la versión de la página.
  let completo;
  try {
    completo = expandir(crudo, leer, 'completo').texto;
  } catch {
    completo = sitio.texto;
  }
  return { id, ruta: `prompts/${id}.txt`, limpio: sitio.texto, completo, tramos: sitio.tramos, continua: sitio.continua };
}

/** La salida guardada de un prompt y la fila del registro que la describe. */
export function salidaDe(id) {
  return salidaEn(`salidas/${id}.txt`);
}

function salidaEn(ruta) {
  const texto = leer(ruta);
  if (texto === null) return null;
  const corrida = registro().filas.find((f) => f.salida === ruta) ?? null;
  return { ruta, texto: limpiar(texto), corrida };
}

/** Otras corridas del mismo prompt, guardadas como salidas/<id>--<variante>.txt. */
export function variantesDe(id) {
  const prefijo = `salidas/${id}--`;
  return listar(prefijo)
    .filter((r) => r.endsWith('.txt'))
    .map((r) => ({ variante: r.slice(prefijo.length, -4), ...salidaEn(r) }));
}

/** registro.csv, con una fila por corrida. */
export function registro() {
  const crudo = leer('registro.csv');
  return crudo === null ? { columnas: [], filas: [] } : csv(crudo);
}

export { limpiar, csv };
