import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { publishedRewardsPlugin } from '../shared/rewardsApiPlugin.js';

export default defineConfig({
  plugins: [react(), publishedRewardsPlugin()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
