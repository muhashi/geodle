import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from 'vite';

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '/', // https://vitejs.dev/guide/static-deploy.html#github-pages
  plugins: [reactRouter()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
});
