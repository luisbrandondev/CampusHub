import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const destino = new URL('../angular-admin/src/core/', import.meta.url);
mkdirSync(destino, { recursive: true });
for (const archivo of ['validadores.js', 'modelos.js', 'estadisticas.js']) {
  copyFileSync(new URL(`../core-js/${archivo}`, import.meta.url), new URL(archivo, destino));
}
console.log(`Núcleo JS sincronizado en ${fileURLToPath(destino)}`);
