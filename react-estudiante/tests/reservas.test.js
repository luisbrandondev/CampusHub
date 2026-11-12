// Comprueba reglas del formulario, sesión local y cálculos del contador con datos fijos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validarFormularioReserva, construirReserva } from '../src/utils/reservas.js';
import { autenticarLocal } from '../src/utils/auth.js';
import { buscarProxima, fechaCampus, inicioReserva, tiempoRestante } from '../src/utils/fechas.js';

const db = JSON.parse(readFileSync(new URL('../src/data/db.json', import.meta.url)));
const ahora = Date.parse('2030-01-10T14:00:00Z'); // 09:00 en Perú.
const labs = [
  { id: 1, estado: 'disponible' },
  { id: 2, estado: 'mantenimiento' },
  { id: 3, estado: 'disponible' },
];
const valores = {
  laboratorioId: '1',
  fecha: '2030-01-10',
  horaInicio: '10:00',
  horaFin: '11:00',
  motivo: 'Práctica de React',
};
const existente = { ...valores, laboratorioId: 1, usuarioId: 4, estado: 'aprobada', id: 41, codigo: 'RES-0041' };
const validar = (cambios = {}, reservas = []) =>
  validarFormularioReserva({ ...valores, ...cambios }, 3, labs, reservas, ahora);

test('una solicitud futura válida no produce errores', () => assert.deepEqual(validar(), {}));
test('los vacíos devuelven errores asociados a cada campo', () => {
  const errores = validar({ laboratorioId: '', fecha: '', horaInicio: '', horaFin: '', motivo: '' });
  assert.deepEqual(Object.keys(errores).sort(), ['fecha', 'horaFin', 'horaInicio', 'laboratorioId', 'motivo']);
});
test('bloquea laboratorios inexistentes y en mantenimiento', () => {
  assert.match(validar({ laboratorioId: '999' }).laboratorioId, /catálogo/);
  assert.match(validar({ laboratorioId: '2' }).laboratorioId, /mantenimiento/);
});
test('reutiliza la validación de fechas reales y horas', () => {
  assert.ok(validar({ fecha: '2030-02-30' }).fecha);
  assert.ok(validar({ horaInicio: '24:00' }).horaInicio);
});
test('bloquea duración cero y horario invertido', () => {
  assert.ok(validar({ horaFin: '10:00' }).horaFin);
  assert.ok(validar({ horaFin: '09:59' }).horaFin);
});
test('el inicio debe ser posterior al reloj del campus', () => {
  assert.ok(validar({ horaInicio: '09:00' }).fecha);
  assert.ok(validar({ fecha: '2030-01-09' }).fecha);
});
test('controla la longitud del motivo sin contar espacios exteriores', () => {
  assert.ok(validar({ motivo: '  ab  ' }).motivo);
  assert.ok(validar({ motivo: 'x'.repeat(201) }).motivo);
  assert.deepEqual(validar({ motivo: '  Práctica  ' }), {});
});
test('un cruce con otro estudiante bloquea la solicitud', () => {
  assert.match(validar({ horaInicio: '10:30', horaFin: '11:30' }, [existente]).horaInicio, /RES-0041/);
});
test('también bloquea una franja que contiene completamente a otra', () => {
  assert.ok(validar({ horaInicio: '09:30', horaFin: '12:00' }, [existente]).horaInicio);
});
test('una solicitud pendiente también ocupa el horario', () => {
  assert.ok(validar({}, [{ ...existente, estado: 'pendiente' }]).horaInicio);
});
test('los horarios contiguos sí se permiten', () => {
  assert.deepEqual(validar({ horaInicio: '11:00', horaFin: '12:00' }, [existente]), {});
  assert.deepEqual(validar({ horaInicio: '09:30', horaFin: '10:00' }, [existente]), {});
});
test('una solicitud rechazada no bloquea disponibilidad', () => {
  assert.deepEqual(validar({}, [{ ...existente, estado: 'rechazada' }]), {});
});
test('otro laboratorio u otra fecha no se consideran cruces', () => {
  assert.deepEqual(validar({ laboratorioId: '3' }, [existente]), {});
  assert.deepEqual(validar({ fecha: '2030-01-11' }, [existente]), {});
});
test('la construcción continúa los identificadores y no modifica la semilla', () => {
  const originales = structuredClone(db.reservas);
  const nueva = construirReserva({ ...valores, motivo: '  Práctica de React  ' }, 3, db.reservas, new Date(ahora));
  assert.equal(nueva.id, 21);
  assert.equal(nueva.codigo, 'RES-0021');
  assert.equal(nueva.estado, 'pendiente');
  assert.equal(nueva.usuarioId, 3);
  assert.equal(nueva.laboratorioId, 1);
  assert.equal(nueva.motivo, 'Práctica de React');
  assert.deepEqual(db.reservas, originales);
});
test('continúa el código aunque no coincida con el identificador', () => {
  const nueva = construirReserva(valores, 3, [{ ...existente, id: 8, codigo: 'RES-0099' }]);
  assert.equal(nueva.id, 9);
  assert.equal(nueva.codigo, 'RES-0100');
});
test('el login normaliza correo y omite la contraseña del contexto', () => {
  const { usuario } = autenticarLocal('  U20260001@UTP.EDU.PE  ', 'est123', db.usuarios);
  assert.equal(usuario.id, 3);
  assert.equal(Object.hasOwn(usuario, 'password'), false);
});
test('el login rechaza dominio ajeno, contraseña errónea y administradores', () => {
  assert.match(autenticarLocal('u20260001@gmail.com', 'est123', db.usuarios).error, /institucional/);
  assert.match(autenticarLocal('u20260001@utp.edu.pe', 'no-es', db.usuarios).error, /no coinciden/);
  assert.match(autenticarLocal('admin1@utp.edu.pe', 'admin123', db.usuarios).error, /estudiantes/);
});
test('el reloj fija Perú aunque la computadora use otra zona horaria', () => {
  assert.equal(fechaCampus(new Date('2030-01-10T03:00:00Z')), '2030-01-09');
  assert.equal(inicioReserva(valores), Date.parse('2030-01-10T15:00:00Z'));
});
test('la próxima reserva es propia, futura y activa; no reordena la lista', () => {
  const lista = [
    { ...existente, id: 1, usuarioId: 3, horaInicio: '12:00' },
    { ...existente, id: 2, usuarioId: 4 },
    { ...existente, id: 3, usuarioId: 3, estado: 'rechazada' },
    { ...existente, id: 4, usuarioId: 3, horaInicio: '08:00' },
    { ...existente, id: 5, usuarioId: 3, horaInicio: '11:00', estado: 'pendiente' },
  ];
  assert.equal(buscarProxima(lista, 3, ahora).id, 5);
  assert.deepEqual(
    lista.map((r) => r.id),
    [1, 2, 3, 4, 5],
  );
  assert.equal(buscarProxima(lista, 3, Date.parse('2030-01-10T18:00:00Z')), null);
});
test('el contador separa días, horas, minutos y segundos, sin negativos', () => {
  assert.deepEqual(tiempoRestante(90061000), { dias: 1, horas: 1, minutos: 1, segundos: 1 });
  assert.deepEqual(tiempoRestante(-1000), { dias: 0, horas: 0, minutos: 0, segundos: 0 });
});
