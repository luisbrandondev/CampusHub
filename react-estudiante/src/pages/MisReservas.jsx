import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useTitulo } from '../hooks/useTitulo.js';
import ContadorReserva from '../components/ContadorReserva.jsx';
import TarjetaReserva from '../components/TarjetaReserva.jsx';
import EstadoVacio from '../components/EstadoVacio.jsx';
import EstadoConsulta from '../components/EstadoConsulta.jsx';
import ResumenEstudiante from '../components/ResumenEstudiante.jsx';

export default function MisReservas({ gestion, laboratorios }) {
  useTitulo('Mis reservas');
  const { usuario } = useContext(AuthContext);
  const [estado, setEstado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorAccion, setErrorAccion] = useState('');
  const [cancelando, setCancelando] = useState(false);
  const { datos: reservas, cargando, error, actualizar, revision } = gestion;
  const visibles = reservas.filter((r) => !estado || r.estado === estado)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.horaInicio.localeCompare(a.horaInicio));

  async function cancelar(id) {
    setCancelando(true);
    setMensaje('');
    setErrorAccion('');
    try {
      await gestion.cancelar(id);
      setMensaje('La reserva se canceló. El horario vuelve a quedar libre.');
    } catch (fallo) {
      setErrorAccion(fallo.message);
    } finally {
      setCancelando(false);
    }
  }

  return (
    <>
      <header className="page-intro intro-with-action">
        <div><span className="eyebrow">TU AGENDA EN EL CAMPUS</span><h1>Mis reservas.</h1>
          <p>Las aprobaciones se consultan automáticamente cada 15 segundos.</p></div>
        <Link to="/nueva-reserva" className="btn btn-primary">Nueva reserva</Link>
      </header>
      <ResumenEstudiante key={usuario.id} usuarioId={usuario.id} revision={revision} />
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="reservation-toolbar">
            <h2>Tu historial</h2>
            <label htmlFor="estado">Estado</label>
            <select id="estado" className="form-select w-auto" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos</option><option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option><option value="rechazada">Rechazadas</option>
            </select>
            <button className="btn btn-outline-primary" disabled={cargando} onClick={actualizar}>Actualizar reservas</button>
          </div>
          {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}
          {errorAccion && <p className="alert alert-danger" role="alert">{errorAccion}</p>}
          <EstadoConsulta cargando={cargando} error={error} onActualizar={actualizar} />
          {!cargando && !error && (visibles.length ? (
            <div className="reservation-list">
              {visibles.map((reserva) => <TarjetaReserva key={reserva.id} reserva={reserva}
                laboratorio={laboratorios.find((l) => l.id === reserva.laboratorioId)}
                onCancelar={cancelar} cancelando={cancelando} />)}
            </div>
          ) : <EstadoVacio titulo="No tienes reservas en esta vista" descripcion="Cambia el filtro o crea una solicitud." />)}
        </div>
        <aside className="col-lg-4">
          <ContadorReserva reservas={reservas} usuarioId={usuario.id} laboratorios={laboratorios} />
        </aside>
      </div>
    </>
  );
}
