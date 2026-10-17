// Secciones del bloque Leer (Eje 05). El orden de esta lista es el orden de lectura,
// igual que `secciones` en sitio.js para el Eje 04. La primera sección es la portada
// del bloque (/leer/); las demás viven en src/pages/leer/<slug>.astro.
import { ruta } from './sitio.js';

export const eje = 'Eje 05 · Leer con IA: trabajar con papers y fuentes';

export const seccionesLeer = [
  {
    slug: '',
    titulo: 'Leer con IA',
    corto: 'Leer con IA',
    bajada: 'Qué es una skill, cómo usarla y las cuatro skills del bloque.',
  },
  {
    slug: 'buscar',
    titulo: 'Buscar',
    corto: 'Buscar',
    bajada: 'Formular la búsqueda con IA y hacerla en las bases. El Asistente de búsqueda.',
  },
  {
    slug: 'verificar',
    titulo: 'Verificar',
    corto: 'Verificar',
    bajada: 'Que lo encontrado exista y diga lo que se le atribuye. El Verificador de referencias y Cita vs. fuente.',
  },
  {
    slug: 'sintetizar',
    titulo: 'Sintetizar',
    corto: 'Sintetizar',
    bajada: 'Leer y sintetizar sin perder el alcance de los textos. La Ficha de lectura.',
  },
  {
    slug: 'como-las-probamos',
    titulo: 'Cómo las probamos',
    corto: 'Cómo las probamos',
    bajada: 'Corridas reales, qué salió bien, qué falló y qué aprendimos.',
  },
].map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }));

export const rutaLeer = (slug) => ruta(slug ? `leer/${slug}/` : 'leer/');
