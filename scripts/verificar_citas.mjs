#!/usr/bin/env node
// Busca en el material original cada cita entre comillas de una salida del modelo.
// Informa si aparece textual y en qué párrafo o turno. Las citas de menos de
// cinco palabras se saltean, porque suelen ser nombres de códigos.
//
// Uso:
//   node scripts/verificar_citas.mjs <salida.txt> <material.txt> [más materiales...]
//   npm run citas -- salidas/caso-1/p3-patron.txt discursos/apertura-sesiones-2026.txt
//
// Escribe el informe en la salida estándar, en Markdown.

import { readFileSync } from 'node:fs';
import path from 'node:path';

const [salidaRuta, ...materiales] = process.argv.slice(2);
if (!salidaRuta || !materiales.length) {
  console.error('Uso: node scripts/verificar_citas.mjs <salida.txt> <material.txt> [...]');
  process.exit(2);
}

// Comparación tolerante a mayúsculas, comillas tipográficas y espacios.
const normal = (t) =>
  t
    .toLowerCase()
    .replace(/[“”«»"]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

// Bloques numerados de cada material: "[12] texto" o "[12] P3: texto".
const bloques = materiales.flatMap((ruta) => {
  const texto = readFileSync(ruta, 'utf8').replace(/\r/g, '');
  return texto
    .split('\n')
    .filter((l) => !l.startsWith('#'))
    .join('\n')
    .split(/\n(?=\[\d+\] )/)
    .map((b) => {
      const m = b.match(/^\[(\d+)\]\s*(?:([A-Z][A-Z0-9]{0,3}):\s*)?([\s\S]*)$/);
      return m ? { archivo: path.basename(ruta), n: m[1], hablante: m[2] ?? null, texto: normal(m[3]) } : null;
    })
    .filter(Boolean);
});

const salida = readFileSync(salidaRuta, 'utf8');
// Las comillas rectas se aparean de a dos dentro de cada línea; las tipográficas, por su forma.
const citas = salida
  .split('\n')
  .flatMap((linea) => [
    ...linea.split('"').filter((_, i) => i % 2 === 1),
    ...[...linea.matchAll(/[“«]([^”»]+)[”»]/g)].map((m) => m[1]),
  ])
  .map((c) => c.trim())
  .filter((c) => c.split(/\s+/).length >= 5);
const unicas = [...new Set(citas)];

const filas = unicas.map((cita) => {
  // Una cita con elipsis se busca por partes, en orden, dentro del mismo bloque.
  const partes = normal(cita)
    .split(/\s*(?:\[(?:\.\.\.|…)\]|\.\.\.|…)\s*/)
    .filter((p) => p.length > 0);
  const hallado = bloques.find((b) => {
    let desde = 0;
    for (const p of partes) {
      const i = b.texto.indexOf(p, desde);
      if (i < 0) return false;
      desde = i + p.length;
    }
    return true;
  });
  return { cita, hallado };
});

const ok = filas.filter((f) => f.hallado).length;
const corta = (t) => (t.length > 90 ? t.slice(0, 87) + '...' : t);
const lineas = [
  `# Verificación de citas`,
  ``,
  `Salida: ${salidaRuta}`,
  `Material: ${materiales.join(', ')}`,
  ``,
  `Citas de cinco palabras o más: ${filas.length}. Encontradas textuales: ${ok}. No encontradas: ${filas.length - ok}.`,
  ``,
  `| Cita | Resultado | Dónde |`,
  `| --- | --- | --- |`,
  ...filas.map(({ cita, hallado }) => {
    const donde = hallado ? `${materiales.length > 1 ? hallado.archivo + ' ' : ''}[${hallado.n}]${hallado.hablante ? ' ' + hallado.hablante : ''}` : '';
    return `| ${corta(cita).replace(/\|/g, '/')} | ${hallado ? 'textual' : 'NO ENCONTRADA'} | ${donde} |`;
  }),
];
console.log(lineas.join('\n'));
