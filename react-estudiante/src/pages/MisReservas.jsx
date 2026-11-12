// Muestra solo las reservas del estudiante, con filtro por estado y opción de cancelar.
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useTitulo } from '../hooks/useTitulo.js';
import { reservasPorEstado } from '../core/estadisticas.js';
import ContadorReserva from '../components/ContadorReserva.jsx';
import TarjetaReserva from '../components/TarjetaReserva.jsx';
import EstadoVacio from '../components/EstadoVacio.jsx';
import Icono from '../components/Icono.jsx';
export default function MisReservas({ reservas, laboratorios, onCancelarReserva }) {
  useTitulo('Mis reservas');
  const { usuario } = useContext(AuthContext);
  const [estado, setEstado] = useState('');
  const [mensaje, setMensaje] = useState('');
  // Primero separamos las reservas propias; después aplicamos el filtro visible.
  const propias = reservas.filter((r) => r.usuarioId === usuario.id);
  const conteos = reservasPorEstado(propias);
  const visibles = propias
    .filter((r) => !estado || r.estado === estado)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.horaInicio.localeCompare(a.horaInicio));
  // La función del padre devuelve true si pudo quitar la reserva del estado.
  function cancelar(id) {
    setMensaje(
      onCancelarReserva(id)
        ? 'La reserva se canceló. El horario vuelve a quedar libre.'
        : 'No se puede cancelar esta reserva. Solo se cancelan solicitudes activas futuras.',
    );
  }
  return (
    <>
      <header className="page-intro intro-with-action">
        <div>
          <span className="eyebrow">TU AGENDA EN EL CAMPUS</span>
          <h1>Mis reservas.</h1>
          <p>Tus espacios, horarios y proyectos en un solo lugar.</p>
        </div>
        <Link to="/nueva-reserva" className="btn btn-primary">
          Nueva reserva <Icono nombre="arrow" size={18} />
        </Link>
      </header>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="reservation-stats">
            <div>
              <strong>{propias.length}</strong>
              <span>solicitudes</span>
            </div>
            <div>
              <strong>{conteos.pendiente}</strong>
              <span>pendientes</span>
            </div>
            <div>
              <strong>{conteos.aprobada}</strong>
              <span>aprobadas</span>
            </div>
            <div>
              <strong>{conteos.rechazada}</strong>
              <span>rechazadas</span>
            </div>
          </div>
          <div className="reservation-toolbar">
            <h2>Tu historial</h2>
            <div>
              <label className="visually-hidden" htmlFor="estado">
                Filtrar por estado
              </label>
              <select id="estado" className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobada">Aprobadas</option>
                <option value="rechazada">Rechazadas</option>
              </select>
            </div>
          </div>
          {mensaje && (
            <div className="alert alert-info" role="status">
              {mensaje}
            </div>
          )}
          {visibles.length ? (
            <div className="reservation-list">
              {visibles.map((reserva) => (
                <TarjetaReserva
                  key={reserva.id}
                  reserva={reserva}
                  laboratorio={laboratorios.find((l) => l.id === reserva.laboratorioId)}
                  onCancelar={cancelar}
                />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="No tienes reservas en esta vista"
              descripcion="Cambia el filtro o crea tu próxima solicitud."
            >
              <Link className="btn btn-outline-primary" to="/nueva-reserva">
                Crear reserva
              </Link>
            </EstadoVacio>
          )}
        </div>
        <aside className="col-lg-4">
          <ContadorReserva reservas={reservas} usuarioId={usuario.id} laboratorios={laboratorios} />
          <p className="aside-note">
            Una solicitud pendiente aún debe ser aprobada. Puedes cancelar tus reservas futuras activas.
          </p>
        </aside>
      </div>
    </>
  );
}
