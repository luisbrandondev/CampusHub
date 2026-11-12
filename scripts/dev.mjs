// Lanza tres procesos Node sin depender de comandos exclusivos de Windows o Linux.
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import './sync-core.mjs';
import './sync-react.mjs';
const raiz = new URL('../', import.meta.url);
// Usa el Vite instalado para React, aunque Angular tenga otra versión interna.
const cargarReact = createRequire(new URL('../react-estudiante/package.json', import.meta.url));
const viteCli = new URL('bin/vite.js', pathToFileURL(cargarReact.resolve('vite/package.json')));
const servicios = [
  { cli: 'node_modules/json-server/lib/cli/bin.js', args: ['--watch', 'db.json', '--host', '127.0.0.1', '--port', '3000'], cwd: 'api-mock/' },
  { cli: 'node_modules/@angular/cli/bin/ng.js', args: ['serve', '--host', '127.0.0.1', '--port', '4200'], cwd: 'angular-admin/' },
  { cli: viteCli, args: ['--host', '127.0.0.1', '--port', '5173', '--strictPort'], cwd: 'react-estudiante/' }
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
console.log('API: http://localhost:3000 | Panel: http://localhost:4200 | Estudiante: http://localhost:5173 | Detener: Ctrl+C');
