import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// En GitHub Actions, SITE_URL y BASE_PATH los define el workflow de deploy.
// En local quedan los valores por defecto y el sitio se sirve en la raíz.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  // Comillas rectas en todo el sitio, iguales a las de los prompts.
  markdown: { smartypants: false },
  integrations: [mdx()],
});
