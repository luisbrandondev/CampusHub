import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { esCorreoUTP, esCodigoAlumno, esHora, esFecha, validarLaboratorio, validarReserva, validarUsuario } from './validadores.js';
import { Usuario, Laboratorio, Reserva } from './modelos.js';
import { reservasPorEstado, ocupacionPorLaboratorio, sedesUnicas, rankingLaboratorios, crearGeneradorCodigos } from './estadisticas.js';

// Cada prueba compara el resultado real con una expectativa independiente.
const datos = { laboratorioId: 1, usuarioId: 3, fecha: '2026-11-09', horaInicio: '08:00', horaFin: '10:00', estado: 'aprobada' };
const crearReserva = (cambios = {}) => new Reserva({ ...datos, ...cambios });
const lab = { id: 1, nombre: 'Lab A-301', sede: 'Lima Centro', capacidad: 30, equipos: ['PC i7'], estado: 'disponible' };

test('correo UTP acepta mayúsculas y puntos', () => assert.equal(esCorreoUTP('Alumno.1@UTP.EDU.PE'), true));
test('correo rechaza dominios externos y un sufijo engañoso', () => {
  assert.equal(esCorreoUTP('alumno@gmail.com'), false);
  assert.equal(esCorreoUTP('a@utp.edu.pe.otro.com'), false);
});
test('código exige U mayúscula y exactamente ocho dígitos', () => {
  assert.equal(esCodigoAlumno('U18311719'), true);
  for (const codigo of ['u18311719', 'U123', 'A12345678', 'U123456789']) assert.equal(esCodigoAlumno(codigo), false);
});
test('hora acepta los extremos de un día', () => { assert.ok(esHora('00:00')); assert.ok(esHora('23:59')); });
test('hora rechaza 24:00, 12:60 y números sin cero inicial', () => {
  for (const hora of ['24:00', '12:60', '8:00']) assert.equal(esHora(hora), false);
});
test('fecha reconoce un día bisiesto válido', () => assert.ok(esFecha('2028-02-29')));
test('fecha rechaza formato incorrecto y días imposibles', () => {
  for (const fecha of ['09/11/2026', '2026-02-29', '2026-04-31', '0000-01-01']) assert.equal(esFecha(fecha), false);
});
test('mensajes incorporan el valor inválido con template literals', () => {
  assert.ok(validarUsuario({ nombre: 'Ana', correo: 'ana@gmail.com', codigo: 'U12345678', rol: 'estudiante' }).some((texto) => texto.includes('ana@gmail.com')));
});
test('Usuario expone getter y método sin publicar su contraseña', () => {
  const usuario = new Usuario({ id: 1, nombre: 'Ana', correo: 'ana@utp.edu.pe', codigo: 'A00000001', rol: 'admin', password: 'demo' });
  assert.equal(usuario.etiqueta, 'Ana (A00000001)');
  assert.ok(usuario.esAdministrador());
  assert.equal(Object.hasOwn(usuario.perfilPublico(), 'password'), false);
});
test('Laboratorio admite exactamente su capacidad y elimina equipos repetidos', () => {
  const laboratorio = new Laboratorio({ ...lab, equipos: ['PC i7', 'PC i7'] });
  assert.ok(laboratorio.admitePersonas(30));
  assert.equal(laboratorio.admitePersonas(31), false);
  assert.equal(laboratorio.etiqueta, 'Lab A-301 - Lima Centro');
  assert.deepEqual(laboratorio.equipos, ['PC i7']);
});
test('capacidad admite 1 y 60, rechaza 0, 61 y decimales', () => {
  for (const capacidad of [1, 60]) assert.deepEqual(validarLaboratorio({ ...lab, capacidad }), []);
  for (const capacidad of [0, 61, 1.5]) assert.ok(validarLaboratorio({ ...lab, capacidad }).length);
});
test('Reserva calcula horas completas y fracciones', () => assert.equal(crearReserva({ horaFin: '09:30' }).duracionHoras(), 1.5));
test('Reserva expone horario legible', () => assert.equal(crearReserva().horario, '08:00 - 10:00'));
test('reservas solapadas se cruzan en ambos sentidos', () => {
  const a = crearReserva(); const b = crearReserva({ horaInicio: '09:00', horaFin: '11:00' });
  assert.ok(a.seCruzaCon(b)); assert.ok(b.seCruzaCon(a));
});
test('reservas contiguas NO se cruzan', () => assert.equal(crearReserva().seCruzaCon(crearReserva({ horaInicio: '10:00', horaFin: '11:00' })), false));
test('una reserva contenida en otra se cruza', () => assert.ok(crearReserva().seCruzaCon(crearReserva({ horaInicio: '08:30', horaFin: '09:00' }))));
test('distinto laboratorio permite el mismo horario', () => assert.equal(crearReserva().seCruzaCon(crearReserva({ laboratorioId: 2 })), false));
test('distinta fecha permite el mismo horario', () => assert.equal(crearReserva().seCruzaCon(crearReserva({ fecha: '2026-11-10' })), false));
test('una reserva rechazada no bloquea el horario', () => assert.equal(crearReserva().seCruzaCon(crearReserva({ estado: 'rechazada' })), false));
test('hora final igual o anterior a la inicial se rechaza', () => {
  assert.throws(() => crearReserva({ horaFin: '08:00' }), TypeError);
  assert.ok(validarReserva({ ...datos, horaFin: '07:00' }).length);
});
test('reduce cuenta los tres estados', () => assert.deepEqual(reservasPorEstado([{ estado: 'pendiente' }, { estado: 'pendiente' }, { estado: 'aprobada' }]), { pendiente: 2, aprobada: 1, rechazada: 0 }));
test('reduce de una lista vacía conserva contadores cero', () => assert.deepEqual(reservasPorEstado([]), { pendiente: 0, aprobada: 0, rechazada: 0 }));
test('Map suma solo horas aprobadas por laboratorio', () => {
  const mapa = ocupacionPorLaboratorio([datos, { ...datos, horaFin: '09:30' }, { ...datos, laboratorioId: 2 }, { ...datos, estado: 'pendiente' }]);
  assert.ok(mapa instanceof Map); assert.equal(mapa.get(1), 3.5); assert.equal(mapa.get(2), 2);
});
test('Set produce sedes únicas', () => assert.deepEqual(sedesUnicas([{ sede: 'Lima Sur' }, { sede: 'Lima Centro' }, { sede: 'Lima Sur' }]), ['Lima Centro', 'Lima Sur']));
test('ranking ordena por solicitudes activas sin mutar el catálogo', () => {
  const catalogo = [{ ...lab }, { ...lab, id: 2, nombre: 'Lab B-201' }];
  const copia = structuredClone(catalogo);
  const resultado = rankingLaboratorios(catalogo, [{ ...datos, laboratorioId: 2 }, { ...datos, laboratorioId: 2 }, { ...datos, estado: 'rechazada' }]);
  assert.equal(resultado[0].id, 2); assert.equal(resultado[0].totalReservas, 2); assert.deepEqual(catalogo, copia);
});
test('closure genera secuencia con ceros a la izquierda', () => { const siguiente = crearGeneradorCodigos(); assert.equal(siguiente(), 'RES-0001'); assert.equal(siguiente(), 'RES-0002'); });
test('closures independientes y reinicio desde el mayor código', () => {
  const a = crearGeneradorCodigos(21); const b = crearGeneradorCodigos();
  assert.equal(a(), 'RES-0021'); assert.equal(b(), 'RES-0001'); assert.equal(a(), 'RES-0022');
});
test('el generador no trunca después de 9999 y exige inicio válido', () => {
  assert.equal(crearGeneradorCodigos(10000)(), 'RES-10000'); assert.throws(() => crearGeneradorCodigos(0), RangeError);
});
test('los datos iniciales cumplen cantidades, modelos y referencias', () => {
  const db = JSON.parse(readFileSync(new URL('../api-mock/db.inicial.json', import.meta.url)));
  assert.equal(db.usuarios.filter((u) => u.rol === 'admin').length, 2);
  assert.equal(db.usuarios.filter((u) => u.rol === 'estudiante').length, 6);
  assert.equal(db.laboratorios.length, 8); assert.equal(db.reservas.length, 20);
  assert.equal(new Set(db.reservas.map((r) => r.codigo)).size, 20);
  db.usuarios.forEach((u) => assert.doesNotThrow(() => new Usuario(u)));
  db.laboratorios.forEach((l) => assert.doesNotThrow(() => new Laboratorio(l)));
  db.reservas.forEach((r) => {
    assert.doesNotThrow(() => new Reserva(r));
    assert.ok(db.laboratorios.some((l) => l.id === r.laboratorioId));
    assert.ok(db.usuarios.some((u) => u.id === r.usuarioId));
  });
  assert.deepEqual(reservasPorEstado(db.reservas), { pendiente: 7, aprobada: 7, rechazada: 6 });
});
test('las reservas activas de la semilla no se cruzan', () => {
  const db = JSON.parse(readFileSync(new URL('../api-mock/db.inicial.json', import.meta.url)));
  const reservas = db.reservas.map((r) => new Reserva(r));
  for (let i = 0; i < reservas.length; i++) for (let j = i + 1; j < reservas.length; j++) assert.equal(reservas[i].seCruzaCon(reservas[j]), false);
});
