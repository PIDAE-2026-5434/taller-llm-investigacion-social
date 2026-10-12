#!/usr/bin/env node
// Toma los discursos listados en discursos/fuentes.csv, los busca por id en
// discursos/discursos.csv y guarda cada uno como discursos/<nombre>.txt, con
// los párrafos numerados: [1], [2], ...
//
// Uso: npm run discursos

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { csv } from '../src/lib/csv.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leer = async (r) => (await readFile(path.join(raiz, r), 'utf8')).replace(/^﻿/, '');

/** Párrafos de un discurso: una línea no vacía por párrafo, sin el título repetido al principio. */
export function parrafos(texto, titulo = '') {
  const lineas = texto
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const normal = (t) => t.toLowerCase().normalize('NFD').replace(/[^\p{L}\p{N}]+/gu, '');
  if (lineas[0] && normal(lineas[0]) === normal(titulo)) lineas.shift();
  // Algunas transcripciones abren con el nombre del orador en mayúsculas: "JAVIER MILEI: ..."
  if (lineas[0]) lineas[0] = lineas[0].replace(/^[A-ZÁÉÍÓÚÑ ]{3,}:\s*/, '');
  return lineas.filter(Boolean);
}

const corpus = new Map(csv(await leer('discursos/discursos.csv')).filas.map((f) => [f.id, f]));
const { filas: fuentes } = csv(await leer('discursos/fuentes.csv'));

for (const fuente of fuentes) {
  const d = corpus.get(fuente.id);
  if (!d) {
    console.error(`x ${fuente.id}: no está en discursos/discursos.csv`);
    process.exitCode = 1;
    continue;
  }
  const ps = parrafos(d.texto, d.titulo);
  const encabezado = [
    `# ${d.titulo}`,
    `# Fecha: ${d.fecha}`,
    `# Fuente: ${d.url}`,
    '# Casa Rosada, licencia Creative Commons Reconocimiento 2.5 Argentina',
  ];
  const cuerpo = ps.map((p, i) => `[${i + 1}] ${p}`).join('\n\n');
  await writeFile(path.join(raiz, 'discursos', `${fuente.nombre}.txt`), `${encabezado.join('\n')}\n\n${cuerpo}\n`, 'utf8');
  console.log(`+ ${fuente.nombre}: ${ps.length} párrafos`);
}
