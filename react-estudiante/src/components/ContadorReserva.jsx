// Muestra la próxima reserva y actualiza cada segundo el tiempo que falta.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buscarProxima, inicioReserva, tiempoRestante, fechaLegible } from '../utils/fechas.js';
import BadgeEstado from './BadgeEstado.jsx';
import Icono from './Icono.jsx';
export default function ContadorReserva({ reservas, usuarioId, laboratorios }) {
  const [ahora, setAhora] = useState(Date.now());
  // El efecto existe mientras la tarjeta está montada y hay un estudiante en sesión.
  useEffect(() => {
    if (!usuarioId) return;
    const intervalo = setInterval(() => setAhora(Date.now()), 1000);
    // React limpia al desmontar la tarjeta o antes de cambiar de usuario.
    return () => clearInterval(intervalo);
  }, [usuarioId]);
  // Son valores calculados: no necesitamos otro estado para la próxima reserva.
  const proxima = buscarProxima(reservas, usuarioId, ahora);
  const restante = tiempoRestante(proxima ? inicioReserva(proxima) - ahora : 0);
  const laboratorio = laboratorios.find((lab) => lab.id === proxima?.laboratorioId);
  return (
    <section className="countdown-card" aria-label="Próxima reserva">
      <div className="countdown-heading">
        <Icono nombre="clock" />
        <span>TU PRÓXIMO ESPACIO</span>
      </div>
      {proxima ? (
        <>
          <h2>{laboratorio?.nombre ?? 'Laboratorio'}</h2>
          <p>
            {fechaLegible(proxima.fecha)} · {proxima.horaInicio} h
          </p>
          <div className="countdown" role="timer" aria-label="Tiempo hasta la próxima reserva">
            {['dias', 'horas', 'minutos', 'segundos'].map((unidad) => (
              <div key={unidad}>
                <strong>{String(restante[unidad]).padStart(2, '0')}</strong>
                <small>{unidad === 'dias' ? 'días' : unidad}</small>
              </div>
            ))}
          </div>
          <div className="countdown-bottom">
            <BadgeEstado estado={proxima.estado} />
            <Link to="/mis-reservas">
              Ver mi reserva <Icono nombre="arrow" size={17} />
            </Link>
          </div>
          {proxima.estado === 'pendiente' && (
            <small className="pending-note">El horario está solicitado y aún requiere aprobación.</small>
          )}
        </>
      ) : (
        <>
          <h2>
            Un espacio para
            <br />
            tu siguiente idea.
          </h2>
          <p>
            {usuarioId
              ? 'Todavía no tienes reservas futuras activas.'
              : 'Inicia sesión y organiza tu próxima sesión de trabajo.'}
          </p>
          <Link className="btn btn-light" to={usuarioId ? '/nueva-reserva' : '/login'}>
            {usuarioId ? 'Crear una reserva' : 'Ingresar al portal'} <Icono nombre="arrow" size={17} />
          </Link>
        </>
      )}
    </section>
  );
}
