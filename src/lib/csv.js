// Sin dependencias, para poder usarlo también desde scripts/ con Node.

/** Parser de CSV chico: admite comillas dobles, comas y saltos dentro de un campo. */
export function csv(texto) {
  const filas = [];
  let fila = [];
  let campo = '';
  let enComillas = false;
  const t = texto.replace(/\r/g, '');
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (enComillas) {
      if (c === '"' && t[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') {
        enComillas = false;
      } else {
        campo += c;
      }
    } else if (c === '"') {
      enComillas = true;
    } else if (c === ',') {
      fila.push(campo);
      campo = '';
    } else if (c === '\n') {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = '';
    } else {
      campo += c;
    }
  }
  if (campo !== '' || fila.length) {
    fila.push(campo);
    filas.push(fila);
  }
  const [encabezado, ...resto] = filas.filter((f) => f.some((x) => x.trim() !== ''));
  if (!encabezado) return { columnas: [], filas: [] };
  const columnas = encabezado.map((c) => c.trim());
  return {
    columnas,
    filas: resto.map((f) => Object.fromEntries(columnas.map((c, i) => [c, (f[i] ?? '').trim()]))),
  };
}
