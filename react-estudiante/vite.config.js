// Activa el soporte de React en Vite para ejecutar y compilar el portal.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });
