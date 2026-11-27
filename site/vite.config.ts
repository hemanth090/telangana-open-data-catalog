import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The GitHub Pages workflow passes --base=/telangana-open-data-catalog/.
// Local development keeps the default root base.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
