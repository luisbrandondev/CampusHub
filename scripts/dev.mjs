// Lanza dos procesos Node sin depender de comandos exclusivos de Windows o Linux.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import './sync-core.mjs';
const raiz = new URL('../', import.meta.url);
const servicios = [
  { cli: 'node_modules/json-server/lib/cli/bin.js', args: ['--watch', 'db.json', '--host', '127.0.0.1', '--port', '3000'], cwd: 'api-mock/' },
  { cli: 'node_modules/@angular/cli/bin/ng.js', args: ['serve', '--host', '127.0.0.1', '--port', '4200'], cwd: 'angular-admin/' }
];
let cerrando = false;
const procesos = servicios.map((servicio) => spawn(process.execPath,
  [fileURLToPath(new URL(servicio.cli, raiz)), ...servicio.args],
  { cwd: new URL(servicio.cwd, raiz), stdio: 'inherit' }));
function cerrar(codigo = 0) {
  if (cerrando) return;
  cerrando = true;
  procesos.forEach((proceso) => { if (proceso.exitCode === null) proceso.kill('SIGTERM'); });
  process.exitCode = codigo;
}
procesos.forEach((proceso) => {
  proceso.on('error', (error) => { console.error(error.message); cerrar(1); });
  proceso.on('exit', (codigo) => { if (!cerrando) cerrar(codigo ?? 1); });
});
process.on('SIGINT', () => cerrar());
process.on('SIGTERM', () => cerrar());
console.log('API: http://localhost:3000 | Panel: http://localhost:4200 | Detener: Ctrl+C');
