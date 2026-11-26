// Busca un laboratorio mediante el ID de la URL y muestra sus horarios ocupados.
import { Link, useParams } from 'react-router-dom';
import { useTitulo } from '../hooks/useTitulo.js';
import DetalleEspacio from '../components/DetalleEspacio.jsx';
import EstadoVacio from '../components/EstadoVacio.jsx';
import HorariosLaboratorio from '../components/HorariosLaboratorio.jsx';
import Icono from '../components/Icono.jsx';
import { inicioReserva } from '../utils/fechas.js';
import { useConsulta } from '../hooks/useConsulta.js';
import EstadoConsulta from '../components/EstadoConsulta.jsx';

export default function DetalleLaboratorio() {
  // El ID de la URL determina qué objeto pedimos a la API.
  const { id } = useParams();
  const detalle = useConsulta(`/laboratorios/${encodeURIComponent(id)}`);
  const horarios = useConsulta(`/reservas?laboratorioId=${encodeURIComponent(id)}`);
  const laboratorio = detalle.datos;
  const reservas = horarios.datos ?? [];
  useTitulo(laboratorio?.nombre ?? 'Laboratorio no encontrado');
  if (detalle.cargando || detalle.error)
    return <EstadoConsulta {...detalle} onActualizar={detalle.actualizar} />;
  if (!laboratorio)
    return (
      <EstadoVacio
        titulo="Laboratorio no encontrado"
        descripcion="El identificador no corresponde a un espacio del catálogo."
      >
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </EstadoVacio>
    );
  // Incluimos solicitudes activas que todavía no terminan, ordenadas por inicio.
  const ocupadas = reservas
    .filter(
      (r) =>
        r.laboratorioId === laboratorio.id &&
        r.estado !== 'rechazada' &&
        new Date(`${r.fecha}T${r.horaFin}:00-05:00`).getTime() > Date.now(),
    )
    .sort((a, b) => inicioReserva(a) - inicioReserva(b));
  return (
    <>
      <Link to="/catalogo" className="back-link">
        ← Volver al catálogo
      </Link>
      <header className="page-intro">
        <span className="eyebrow">CONOCE TU ESPACIO</span>
        <h1>{laboratorio.nombre}</h1>
        <p>
          <Icono nombre="pin" size={18} /> {laboratorio.sede}
        </p>
      </header>
      <div className="row g-4">
        <div className="col-lg-7">
          <DetalleEspacio laboratorio={laboratorio} />
        </div>
        <div className="col-lg-5">
          <section className="surface booking-side">
            <span className="eyebrow">PLANIFICA TU VISITA</span>
            <h2>Reserva este laboratorio</h2>
            <p>Selecciona la fecha, el horario y el motivo de tu actividad.</p>
            {laboratorio.estado === 'disponible' ? (
              <Link
                className="btn btn-primary w-100"
                to={`/nueva-reserva?laboratorio=${laboratorio.id}`}
              >
                Elegir un horario <Icono nombre="arrow" size={18} />
              </Link>
            ) : (
              <div className="alert alert-warning mb-0" role="status">
                Este espacio está en mantenimiento. Elige otro laboratorio.
              </div>
            )}
            <small>El acceso a la reserva requiere una sesión de estudiante.</small>
          </section>
          <HorariosLaboratorio consulta={horarios} reservas={ocupadas} />
        </div>
      </div>
    </>
  );
}
