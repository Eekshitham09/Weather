import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Only one default export allowed
export default defineConfig({
  plugins: [react()],
});
