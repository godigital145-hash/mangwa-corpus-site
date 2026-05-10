// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],

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
