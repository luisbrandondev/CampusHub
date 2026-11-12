// Restaura la semilla solo si se pasa --confirmar; reemplaza la base del API.
import { copyFileSync } from 'node:fs';
if (!process.argv.includes('--confirmar')) {
  console.error('Este comando reemplaza db.json por los datos de muestra. Detén la API y ejecuta: npm run restaurar-datos -- --confirmar');
  process.exitCode = 1;
} else {
  copyFileSync(new URL('../api-mock/db.inicial.json', import.meta.url), new URL('../api-mock/db.json', import.meta.url));
  console.log('Datos iniciales restaurados: 8 usuarios, 8 laboratorios, 20 reservas.');
}
