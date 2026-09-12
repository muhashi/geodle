import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '/', // https://vitejs.dev/guide/static-deploy.html#github-pages
  plugins: [react()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
  ssgOptions: {
    script: 'async',
    formatting: 'none',
    dirStyle: 'nested',
    // prerender these routes; dynamic random uses same route but picks country client-side
    includedRoutes(paths) {
      const expected = ['/', '/daily', '/random', '/terms', '/privacy', '/updates'];
      // ensure all expected routes are rendered even if not auto-discovered
      const set = new Set([...paths, ...expected]);
      // filter out dynamic patterns if any
      return [...set].filter((p) => !p.includes(':') && !p.includes('*'));
    },
    async onFinished(dir) {
      try {
        // copy CNAME if present at repo root for custom domain
        const cnameSrc = path.resolve('CNAME');
        const cnameDest = path.join(dir, 'CNAME');
        if (fs.existsSync(cnameSrc)) fs.copyFileSync(cnameSrc, cnameDest);
        // ensure .nojekyll exists (also done in workflow)
        fs.writeFileSync(path.join(dir, '.nojekyll'), '');
        // SPA fallback: GitHub Pages serves 404.html for unknown routes
        const indexHtml = path.join(dir, 'index.html');
        const notFoundHtml = path.join(dir, '404.html');
        if (fs.existsSync(indexHtml) && !fs.existsSync(notFoundHtml)) {
          fs.copyFileSync(indexHtml, notFoundHtml);
        }
      } catch (e) {
        console.warn('[ssg] onFinished copy failed', e);
      }
    },
  },
});
