import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for deployment
  server: {
    host: true, // required to access via mobile
  },
});
