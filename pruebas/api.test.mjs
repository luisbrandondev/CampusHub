import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, copyFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

// Usa un archivo temporal y un puerto libre: NO modifica api-mock/db.json.
test('contrato HTTP del avance 1 con json-server 0.17.4', async (t) => {
  const directorio = await mkdtemp(join(tmpdir(), 'campushub-api-'));
  const archivo = join(directorio, 'db.json');
  await copyFile(new URL('../api-mock/db.inicial.json', import.meta.url), archivo);
  const app = jsonServer.create();
  app.use(jsonServer.defaults({ logger: false }));
  app.use(jsonServer.bodyParser);
  app.use(jsonServer.router(archivo));
  const servidor = app.listen(0, '127.0.0.1');
  await new Promise((resolver) => servidor.once('listening', resolver));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const pedir = (ruta, method = 'GET', body) => fetch(`${base}${ruta}`, { method,
    headers: { 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  let laboratorioId; let reservaId;
  const laboratorio = { nombre: 'Lab Prueba API', sede: 'Lima Centro', capacidad: 12, equipos: ['PC'], estado: 'disponible' };
  try {
    await t.test('GET catálogo devuelve 8 registros y JSON', async () => {
      const respuesta = await pedir('/laboratorios'); assert.equal(respuesta.status, 200);
      assert.match(respuesta.headers.get('content-type'), /json/); assert.equal((await respuesta.json()).length, 8);
    });
    await t.test('GET admite filtro por sede', async () => {
      const lista = await (await pedir('/laboratorios?sede=Lima%20Centro')).json(); assert.equal(lista.length, 2); assert.ok(lista.every((l) => l.sede === 'Lima Centro'));
    });
    await t.test('GET admite búsqueda q', async () => {
      const lista = await (await pedir('/laboratorios?q=Arduino')).json(); assert.equal(lista.length, 1); assert.equal(lista[0].id, 3);
    });
    await t.test('GET detalle conserva campos del contrato', async () => {
      const respuesta = await pedir('/laboratorios/1'); assert.equal(respuesta.status, 200); assert.equal((await respuesta.json()).nombre, 'Lab A-301');
    });
    await t.test('GET id inexistente responde 404', async () => assert.equal((await pedir('/laboratorios/999999')).status, 404));
    await t.test('POST catálogo crea y genera id', async () => {
      const respuesta = await pedir('/laboratorios', 'POST', laboratorio); assert.equal(respuesta.status, 201);
      const creado = await respuesta.json(); laboratorioId = creado.id; assert.ok(Number.isInteger(laboratorioId)); assert.equal(creado.capacidad, 12);
    });
    await t.test('PUT catálogo reemplaza los datos', async () => {
      const respuesta = await pedir(`/laboratorios/${laboratorioId}`, 'PUT', { ...laboratorio, capacidad: 40 });
      assert.equal(respuesta.status, 200); assert.equal((await respuesta.json()).capacidad, 40);
    });
    await t.test('PATCH funciona como quinto método de la rúbrica', async () => {
      const respuesta = await pedir(`/laboratorios/${laboratorioId}`, 'PATCH', { estado: 'mantenimiento' });
      assert.equal(respuesta.status, 200); const lab = await respuesta.json(); assert.equal(lab.estado, 'mantenimiento'); assert.equal(lab.capacidad, 40);
    });
    await t.test('POST y PUT persisten físicamente en el JSON', async () => {
      const db = JSON.parse(await readFile(archivo)); assert.equal(db.laboratorios.find((l) => l.id === laboratorioId).capacidad, 40);
    });
    await t.test('GET reservas filtra por usuarioId', async () => {
      const lista = await (await pedir('/reservas?usuarioId=3')).json(); assert.equal(lista.length, 4); assert.ok(lista.every((r) => r.usuarioId === 3));
    });
    await t.test('GET usuarios permite el login simulado del contrato', async () => {
      const lista = await (await pedir('/usuarios?correo=admin1%40utp.edu.pe')).json(); assert.equal(lista.length, 1); assert.equal(lista[0].rol, 'admin');
    });
    await t.test('POST reserva crea una transacción', async () => {
      const respuesta = await pedir('/reservas', 'POST', { codigo: 'RES-TEST', laboratorioId: 1, usuarioId: 3, fecha: '2026-11-20', horaInicio: '18:00', horaFin: '19:00', motivo: 'Prueba API', estado: 'pendiente', creadoEn: '2026-11-02T12:00:00Z' });
      assert.equal(respuesta.status, 201); reservaId = (await respuesta.json()).id; assert.ok(reservaId);
    });
    await t.test('DELETE reserva cancela y GET posterior da 404', async () => {
      assert.equal((await pedir(`/reservas/${reservaId}`, 'DELETE')).status, 200);
      assert.equal((await pedir(`/reservas/${reservaId}`)).status, 404);
    });
    await t.test('DELETE catálogo elimina y GET posterior da 404', async () => {
      assert.equal((await pedir(`/laboratorios/${laboratorioId}`, 'DELETE')).status, 200);
      assert.equal((await pedir(`/laboratorios/${laboratorioId}`)).status, 404);
    });
    await t.test('la secuencia deja intactos los datos iniciales', async () => {
      const db = JSON.parse(await readFile(archivo)); assert.equal(db.laboratorios.length, 8); assert.equal(db.reservas.length, 20);
    });
  } finally {
    servidor.closeAllConnections();
    await new Promise((resolver) => servidor.close(resolver));
    await rm(directorio, { recursive: true, force: true });
  }
});
