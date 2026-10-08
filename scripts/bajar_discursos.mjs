#!/usr/bin/env node
// Baja los discursos listados en discursos/fuentes.csv y guarda cada uno como
// discursos/<id>.txt, con un párrafo por bloque y numerados: [1], [2], ...
//
// Uso:   npm run discursos            baja los que faltan
//        npm run discursos -- --todo  vuelve a bajar todos
//
// El recorte de párrafos es heurístico. Después de bajar un discurso conviene
// abrir el archivo y compararlo con la página original.

import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { csv } from '../src/lib/csv.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MINIMO = 60; // caracteres: descarta fechas, rótulos y textos del sitio

const ENTIDADES = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', uuml: 'ü',
  Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', Uuml: 'Ü',
  iquest: '¿', iexcl: '¡', laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  ndash: '–', mdash: '—', hellip: '…', deg: '°', ordm: 'º', ordf: 'ª',
};

const decodificar = (t) =>
  t
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => ENTIDADES[n] ?? m);

const DESCARTAR = [/^Queremos estar más y mejor comunicados/i, /^Los contenidos de Casa Rosada/i, /^Suscribite/i];

/** Devuelve los párrafos del discurso que hay en el HTML de una página de Casa Rosada. */
export function parrafosDe(html, titulo = '') {
  const sinCodigo = html.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ');
  const parrafos = [];
  for (const m of sinCodigo.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const texto = decodificar(m[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ''))
      .replace(/\s+/g, ' ')
      .trim();
    if (texto.length < MINIMO) continue;
    if (titulo && texto.toLowerCase() === titulo.toLowerCase()) continue;
    if (DESCARTAR.some((r) => r.test(texto))) continue;
    parrafos.push(texto);
  }
  return parrafos;
}

const existe = (ruta) => access(ruta).then(() => true, () => false);

async function principal() {
  const todo = process.argv.includes('--todo');
  const { filas } = csv(await readFile(path.join(raiz, 'discursos/fuentes.csv'), 'utf8'));

  for (const f of filas) {
    const destino = path.join(raiz, 'discursos', `${f.id}.txt`);
    if (!todo && (await existe(destino))) {
      console.log(`= ${f.id}: ya estaba`);
      continue;
    }
    const respuesta = await fetch(f.url, { headers: { 'user-agent': 'taller-llm-investigacion-social' } });
    if (!respuesta.ok) {
      console.error(`x ${f.id}: la página respondió ${respuesta.status}`);
      process.exitCode = 1;
      continue;
    }
    const parrafos = parrafosDe(await respuesta.text(), f.titulo);
    if (parrafos.length === 0) {
      console.error(`x ${f.id}: no se encontraron párrafos`);
      process.exitCode = 1;
      continue;
    }
    const encabezado = [`# ${f.titulo}`, `# Fecha: ${f.fecha}`, `# Fuente: ${f.url}`, '# Casa Rosada, licencia Creative Commons Reconocimiento 2.5 Argentina'];
    const cuerpo = parrafos.map((p, i) => `[${i + 1}] ${p}`);
    await writeFile(destino, [...encabezado, '', cuerpo.join('\n\n'), ''].join('\n'), 'utf8');
    console.log(`+ ${f.id}: ${parrafos.length} párrafos. Empieza con "${parrafos[0].slice(0, 50)}..."`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await principal();
}
