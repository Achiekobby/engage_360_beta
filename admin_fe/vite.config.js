import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { publishedRewardsPlugin } from '../shared/rewardsApiPlugin.js';

export default defineConfig({
  plugins: [react(), publishedRewardsPlugin()],
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
