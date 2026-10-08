// Datos del sitio que usan el layout, la portada y la navegación.

export const sitio = {
  titulo: 'LLMs en investigación social',
  proyecto: 'PIDAE 2026',
  descripcion:
    'Material del taller PIDAE sobre uso de modelos de lenguaje en investigación social: tareas, técnicas, armado de prompts, errores frecuentes y dos casos de aplicación.',
  institucion: 'Proyecto PIDAE 2026. Facultad de Ciencias Sociales, Universidad de Buenos Aires.',
  // La define el workflow de deploy. En local queda vacía y los enlaces a GitHub no se muestran.
  repo: (import.meta.env.PUBLIC_REPO_URL || '').replace(/\/$/, ''),
};

// El orden de esta lista es el orden de lectura. Cada entrada tiene su archivo
// en src/pages/guia/<slug>.mdx.
export const secciones = [
  {
    slug: 'tipos-de-tareas',
    titulo: 'Tipos de tareas',
    corto: 'Tipos de tareas',
    bajada: 'Siete tareas, de resumir a buscar contraejemplos, y qué revisar en cada una.',
  },
  {
    slug: 'tecnicas',
    titulo: 'Técnicas',
    corto: 'Técnicas',
    bajada:
      'Zero-shot, few-shot, razonamiento paso a paso, descomposición e iteración, cada una con un prompt de muestra.',
  },
  {
    slug: 'componentes-del-prompt',
    titulo: 'Componentes del prompt',
    corto: 'Componentes del prompt',
    bajada:
      'Siete componentes, buenas prácticas, elección de modelo, nivel de esfuerzo y configuración de la herramienta.',
  },
  {
    slug: 'errores',
    titulo: 'Errores más comunes',
    corto: 'Errores más comunes',
    bajada: 'Nueve errores, cómo se ve cada uno y qué hacer.',
  },
  {
    slug: 'caso-1',
    titulo: 'Caso 1: análisis de discurso',
    corto: 'Caso 1: discursos',
    bajada: 'Cinco pasos sobre discursos presidenciales del corpus de Casa Rosada.',
  },
  {
    slug: 'caso-2',
    titulo: 'Caso 2: análisis cualitativo',
    corto: 'Caso 2: entrevista',
    bajada: 'La misma secuencia sobre una entrevista sintética.',
  },
  {
    slug: 'cierre',
    titulo: 'Cierre',
    corto: 'Cierre',
    bajada: 'Checklist de validación, registro de corridas y un ejercicio con un discurso corto.',
  },
].map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }));

/** Antepone la base del sitio, que en GitHub Pages es el nombre del repositorio. */
export function ruta(camino = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${camino.replace(/^\//, '')}`;
}

export const rutaSeccion = (slug) => ruta(`guia/${slug}/`);

/** Enlace al archivo en GitHub, o null si no hay repositorio configurado. */
export const enRepo = (archivo) => (sitio.repo ? `${sitio.repo}/blob/main/${archivo}` : null);
