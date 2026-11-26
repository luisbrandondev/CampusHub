// Copia solo las reglas compartidas. Los datos se consultan en la API desde el avance 3.
import { copyFileSync, mkdirSync } from 'node:fs';
const destino = new URL('../react-estudiante/src/', import.meta.url);
mkdirSync(new URL('core/', destino), { recursive: true });
for (const archivo of ['validadores.js', 'modelos.js', 'estadisticas.js']) {
  copyFileSync(
    new URL(`../core-js/${archivo}`, import.meta.url),
    new URL(`core/${archivo}`, destino),
  );
}
console.log('React: reglas del núcleo compartido sincronizadas.');
