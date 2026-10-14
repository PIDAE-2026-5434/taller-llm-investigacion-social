// Expansión de las marcas propias de los archivos de prompts/.
// No depende de Astro: lo usan el sitio (src/lib/archivos.js) y el script
// que arma las corridas (scripts/armar_corridas.mjs). Cada uno le pasa su
// propia función `leer(ruta)`, que devuelve el texto de un archivo del
// repositorio o null.
//
// Marcas, cada una en una línea sola:
//   @continua <id>             El mensaje va en la misma conversación que prompts/<id>.txt.
//   @esquema <id>              Se reemplaza por esquemas/<id>.csv escrito como lista.
//   @material <ruta> [a-b]     Se reemplaza por el archivo completo, o solo por los párrafos o turnos a-b.
//   @salida <id>               Se reemplaza por salidas/<id>.txt.
//   #> Etiqueta                Anota el tramo que sigue. No forma parte del prompt.

import { csv } from './csv.js';

const limpiar = (texto) => texto.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();

const nombreArchivo = (ruta) => ruta.split('/').pop();

/** El esquema escrito como lista, que es como entra en un prompt. */
export function esquemaComoTexto(crudo) {
  return csv(crudo)
    .filas.map((f) => {
      let linea = `- "${f.codigo}": ${f.definicion}`;
      if (f.incluye) linea += ` Incluye: ${f.incluye}.`;
      if (f.excluye) linea += ` Excluye: ${f.excluye}.`;
      return linea;
    })
    .join('\n');
}

/**
 * Bloques numerados de un archivo de material ("[12] texto"), sin las líneas
 * de encabezado que empiezan con "#". Con `desde` y `hasta` devuelve solo ese tramo.
 */
export function bloques(crudo, desde = null, hasta = null) {
  const cuerpo = crudo
    .replace(/\r/g, '')
    .split('\n')
    .filter((l) => !l.startsWith('#'))
    .join('\n');
  const partes = cuerpo.split(/\n(?=\[\d+\] )/).map((p) => p.trim()).filter(Boolean);
  if (desde === null) return partes.join('\n\n');
  return partes
    .filter((p) => {
      const n = Number(p.match(/^\[(\d+)\]/)?.[1]);
      return n >= desde && n <= hasta;
    })
    .join('\n\n');
}

/**
 * Expande un prompt.
 *  - modo "sitio": el material y las salidas quedan como una línea entre corchetes,
 *    para que el prompt se lea entero en la página.
 *  - modo "completo": todo se reemplaza por el texto real. Es lo que se copia
 *    y lo que se manda en una corrida.
 */
export function expandir(crudo, leer, modo = 'completo') {
  const exigir = (ruta) => {
    const t = leer(ruta);
    if (t === null) throw new Error(`No existe ${ruta}`);
    return t;
  };
  const sitio = modo === 'sitio';
  let continua = null;
  let acotado = false;

  const texto = crudo
    .replace(/\r/g, '')
    .replace(/^@continua\s+(\S+)\s*\n?/m, (_, id) => {
      continua = id;
      return '';
    })
    .replace(/^@esquema\s+(\S+)[ \t]*$/gm, (_, id) => esquemaComoTexto(exigir(`esquemas/${id}.csv`)))
    .replace(/^@material\s+(\S+)(?:\s+(\d+)-(\d+))?[ \t]*$/gm, (_, ruta, a, b) => {
      const crudoMaterial = exigir(ruta);
      if (sitio) {
        // En la página: hasta 3 bloques se muestran enteros; si son más, los dos primeros y [...].
        const partes = (a ? bloques(crudoMaterial, Number(a), Number(b)) : bloques(crudoMaterial)).split('\n\n');
        if (partes.length <= 3) return partes.join('\n\n');
        acotado = true;
        return [...partes.slice(0, 2), '[...]'].join('\n\n');
      }
      // El archivo completo va con su encabezado; un tramo, solo con los bloques pedidos.
      return a ? bloques(crudoMaterial, Number(a), Number(b)) : limpiar(crudoMaterial);
    })
    .replace(/^@salida\s+(\S+)[ \t]*$/gm, (_, id) => {
      if (sitio) {
        acotado = true;
        return `[salida de ${id}]`;
      }
      return limpiar(exigir(`salidas/${id}.txt`));
    });

  // Tramos anotados con "#> Etiqueta".
  const tramos = [];
  let actual = { etiqueta: null, lineas: [] };
  const cerrar = () => {
    const t = limpiar(actual.lineas.join('\n'));
    if (t) tramos.push({ etiqueta: actual.etiqueta, texto: t });
  };
  for (const linea of texto.split('\n')) {
    if (linea.startsWith('#>')) {
      cerrar();
      actual = { etiqueta: linea.slice(2).trim(), lineas: [] };
    } else {
      actual.lineas.push(linea);
    }
  }
  cerrar();

  return { texto: tramos.map((t) => t.texto).join('\n\n'), tramos, continua, acotado };
}

/**
 * La conversación completa hasta el prompt <id>: los mensajes anteriores
 * (siguiendo las marcas @continua) con sus salidas, y el mensaje nuevo al final.
 * Devuelve una lista de turnos { rol: 'usuario' | 'asistente', texto }.
 */
export function conversacion(id, leer) {
  const turnos = [];
  let actual = id;
  const vistos = new Set();
  while (actual) {
    if (vistos.has(actual)) throw new Error(`@continua circular en ${actual}`);
    vistos.add(actual);
    const crudo = leer(`prompts/${actual}.txt`);
    if (crudo === null) throw new Error(`No existe prompts/${actual}.txt`);
    const { texto, continua } = expandir(crudo, leer, 'completo');
    if (actual !== id) {
      const salida = leer(`salidas/${actual}.txt`);
      if (salida === null) throw new Error(`Falta salidas/${actual}.txt, que necesita ${id}`);
      turnos.unshift({ rol: 'asistente', texto: limpiar(salida) });
    }
    turnos.unshift({ rol: 'usuario', texto });
    actual = continua;
  }
  return turnos;
}

export { limpiar };
