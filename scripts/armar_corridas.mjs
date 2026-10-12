#!/usr/bin/env node
// Arma el texto que se manda al modelo en cada corrida, con el material, los
// esquemas y las salidas anteriores ya incluidos. Si el prompt continúa una
// conversación (@continua), antepone los mensajes anteriores con sus respuestas.
//
// Uso:
//   npm run corridas                      todos los prompts
//   npm run corridas -- caso-1/p3-patron  uno o varios ids
//
// Escribe corridas/<id>.txt. La carpeta corridas/ no se versiona.

import { writeFile, mkdir, readdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { conversacion } from '../src/lib/prompts.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leer = (ruta) => {
  const abs = path.join(raiz, ruta);
  return existsSync(abs) ? readFileSync(abs, 'utf8').replace(/^﻿/, '') : null;
};

async function todos(dir = 'prompts') {
  const salida = [];
  for (const e of await readdir(path.join(raiz, dir), { withFileTypes: true })) {
    const r = `${dir}/${e.name}`;
    if (e.isDirectory()) salida.push(...(await todos(r)));
    else if (e.name.endsWith('.txt')) salida.push(r.slice('prompts/'.length, -4));
  }
  return salida.sort();
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : await todos();

for (const id of ids) {
  let turnos;
  try {
    turnos = conversacion(id, leer);
  } catch (e) {
    console.error(`x ${id}: ${e.message}`);
    process.exitCode = 1;
    continue;
  }
  let texto;
  if (turnos.length === 1) {
    texto = turnos[0].texto;
  } else {
    const previos = turnos.slice(0, -1).map((t) => `<<${t.rol === 'usuario' ? 'USUARIO' : 'ASISTENTE'}>>\n${t.texto}`);
    texto = [
      'Esta es una conversación ya empezada en el mismo chat. Los mensajes anteriores y tus respuestas anteriores están abajo. Respondé solo el último mensaje del usuario.',
      ...previos,
      `<<USUARIO: MENSAJE NUEVO>>\n${turnos.at(-1).texto}`,
    ].join('\n\n');
  }
  const destino = path.join(raiz, 'corridas', `${id}.txt`);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, texto + '\n', 'utf8');
  console.log(`+ corridas/${id}.txt (${turnos.length} mensaje${turnos.length > 1 ? 's' : ''}, ${texto.split(/\s+/).length} palabras)`);
}
