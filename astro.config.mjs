// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mangwacorpus.com',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-placeholder"],
    },
    ssr: {
      noExternal: ["react-pdf"],
      external: ["pdfjs-dist"],
    },
  }
});
