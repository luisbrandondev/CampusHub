// Conecta la página de reserva con el formulario y la función de guardado de App.
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useTitulo } from '../hooks/useTitulo.js';
import FormularioReserva from '../components/FormularioReserva.jsx';
import Icono from '../components/Icono.jsx';
export default function NuevaReserva({ laboratorios, onCrearReserva }) {
  useTitulo('Nueva reserva');
  const { usuario } = useContext(AuthContext);
  // El detalle envía ?laboratorio=1 para preseleccionar el laboratorio en el formulario.
  const [parametros] = useSearchParams();
  const inicial = parametros.get('laboratorio') ?? '';
  return (
    <>
      <header className="page-intro">
        <span className="eyebrow">DALE ESPACIO A TU PROYECTO</span>
        <h1>Tu próxima reserva.</h1>
        <p>Elige cuándo y dónde quieres trabajar.</p>
      </header>
      <div className="row g-4">
        <div className="col-lg-8">
          <FormularioReserva
            key={inicial}
            laboratorioInicial={inicial}
            laboratorios={laboratorios}
            onGuardar={onCrearReserva}
          />
        </div>
        <aside className="col-lg-4">
          <section className="reservation-help">
            <Icono nombre="calendar" size={32} />
            <h2>Todo listo para organizarte.</h2>
            <p>
              Registraremos la solicitud a nombre de <strong>{usuario.nombre}</strong>.
            </p>
            <ul>
              <li>Usa un horario futuro.</li>
              <li>El final debe ser posterior al inicio.</li>
              <li>Las solicitudes pendientes y aprobadas bloquean ese horario.</li>
              <li>Una reserva rechazada no bloquea disponibilidad.</li>
            </ul>
            <div className="local-note">
              Esta demostración conserva tus cambios mientras navegas. Al recargar la página, vuelve a los datos de
              muestra.
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
