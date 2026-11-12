// Copia local previa al arranque: el navegador de React NO consulta la API en S14.
import { copyFileSync, mkdirSync } from 'node:fs';
const destino = new URL('../react-estudiante/src/', import.meta.url);
mkdirSync(new URL('core/', destino), { recursive: true });
mkdirSync(new URL('data/', destino), { recursive: true });
for (const archivo of ['validadores.js', 'modelos.js', 'estadisticas.js']) {
  copyFileSync(new URL(`../core-js/${archivo}`, import.meta.url), new URL(`core/${archivo}`, destino));
}
copyFileSync(new URL('../api-mock/db.json', import.meta.url), new URL('data/db.json', destino));
console.log('React: núcleo compartido y copia local de db.json sincronizados.');
