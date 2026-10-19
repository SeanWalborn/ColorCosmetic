import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub project sites are hosted under the repository name.
  base: '/ColorCosmetic/',
});
