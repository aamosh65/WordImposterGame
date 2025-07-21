import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // required to access via mobile
    port: 5173, // Set frontend dev server port to 5173
  },
  preview: {
    host: true, // required to access via mobile
    port: 5173, // Set preview server port to 5173 as well
  },
});
