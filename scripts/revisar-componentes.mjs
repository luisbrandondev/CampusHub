// Comprueba el límite de 120 líneas por archivo JSX, incluyendo comentarios.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const raiz = new URL('../react-estudiante/src/', import.meta.url);
const archivos = readdirSync(raiz, { recursive: true }).filter((archivo) => archivo.endsWith('.jsx'));
const conteos = archivos.map((archivo) => ({
  archivo,
  lineas: readFileSync(new URL(archivo, raiz), 'utf8').trimEnd().split(/\r?\n/).length,
}));
const largos = conteos.filter(({ lineas }) => lineas > 120);
console.table(conteos);
if (largos.length) {
  console.error('Hay archivos JSX que superan las 120 líneas en', fileURLToPath(raiz));
  process.exitCode = 1;
} else {
  console.log(`Cumple: ${archivos.length} archivos JSX tienen como máximo 120 líneas.`);
}
