// Datos del sitio que usan el layout, la portada y la navegación.

export const sitio = {
  titulo: 'LLMs en investigación social',
  proyecto: 'PIDAE 2026',
  descripcion:
    'Material del taller PIDAE sobre uso de modelos de lenguaje en investigación social: organización del trabajo, tareas, técnicas, armado de prompts, errores frecuentes y dos casos de aplicación.',
  institucion: 'Proyecto PIDAE 2026. Facultad de Ciencias Sociales, Universidad de Buenos Aires.',
  // La define el workflow de deploy. En local queda vacía y los enlaces a GitHub no se muestran.
  repo: (import.meta.env.PUBLIC_REPO_URL || '').replace(/\/$/, ''),
};

// El orden de esta lista es el orden de lectura. Cada entrada tiene su archivo
// en src/pages/guia/<slug>.mdx.
export const secciones = [
  {
    slug: 'organizar-el-trabajo',
    titulo: 'Organizar el trabajo',
    corto: 'Organizar el trabajo',
    bajada:
      'Cómo ordenar pregunta, corpus, documentos y códigos antes de usar un modelo, y cómo llevar esa carpeta a una herramienta.',
  },
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
      'Zero-shot, few-shot, razonamiento paso a paso, descomposición e iteración, probadas sobre párrafos reales.',
  },
  {
    slug: 'componentes-del-prompt',
    titulo: 'Componentes del prompt',
    corto: 'Componentes del prompt',
    bajada: 'Siete componentes, buenas prácticas, elección de modelo y nivel de esfuerzo.',
  },
  {
    slug: 'errores',
    titulo: 'Errores más comunes',
    corto: 'Errores más comunes',
    bajada: 'Diez errores, cómo se ve cada uno en las salidas de este taller y qué hacer.',
  },
  {
    slug: 'caso-1',
    titulo: 'Caso 1: análisis de discurso',
    corto: 'Caso 1: discursos',
    bajada: 'Cinco pasos sobre dos discursos presidenciales de 2026, cada uno con un antipatrón y un patrón recomendado.',
  },
  {
    slug: 'caso-2',
    titulo: 'Caso 2: entrevistas y grupo focal',
    corto: 'Caso 2: entrevistas',
    bajada: 'Descomponer una variable, grillar menciones y ubicar consensos, tensiones y diferencias. Incluye una skill.',
  },
  {
    slug: 'cierre',
    titulo: 'Cierre',
    corto: 'Cierre',
    bajada: 'Checklist de validación, registro de corridas y un ejercicio con el discurso del Día de la Bandera.',
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
