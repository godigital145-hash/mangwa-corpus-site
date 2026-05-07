// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { cms } from '@geniusofdigital/astro-cms/astro';
import cmsConfig from './cms.config.ts';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  integrations: [react(), cms(cmsConfig)],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["react-pdf"],
      external: ["pdfjs-dist"],
    },
  }
});