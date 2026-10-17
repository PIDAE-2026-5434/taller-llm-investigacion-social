// Secciones del bloque Leer (Eje 05). El orden de esta lista es el orden de lectura,
// igual que `secciones` en sitio.js para el Eje 04. La portada del bloque es /leer/
// (src/pages/leer/index.astro); cada sección vive en src/pages/leer/<slug>.astro.
import { ruta } from './sitio.js';

export const eje = 'Eje 05 · Leer con IA: trabajar con papers y fuentes';

export const seccionesLeer = [
  {
    slug: 'skills',
    titulo: 'Qué es una skill',
    corto: 'Qué es una skill',
    bajada: 'Cómo funciona, cómo usarla y las cuatro skills del bloque.',
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
    titulo: 'Sintetizar un paper',
    corto: 'Sintetizar un paper',
    bajada: 'Chat, chat con PDF o cuaderno: misma pregunta, tres respuestas. La Ficha de lectura.',
  },
  {
    slug: 'varios-papers',
    titulo: 'Sintetizar varios papers',
    corto: 'Sintetizar varios papers',
    bajada: 'Un cuaderno con varios papers: falso consenso y falsa brecha.',
  },
  {
    slug: 'como-las-probamos',
    titulo: 'Cómo las probamos',
    corto: 'Cómo las probamos',
    bajada: 'Corridas reales, qué salió bien, qué falló y qué aprendimos.',
  },
].map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }));

export const icono = 'marca/eje05.png';

export const rutaLeer = (slug) => ruta(slug ? `leer/${slug}/` : 'leer/');
