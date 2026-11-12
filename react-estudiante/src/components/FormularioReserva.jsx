// Formulario controlado: muestra los valores del estado y comunica el envío al padre.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fechaCampus } from '../utils/fechas.js';
import CampoReserva from './CampoReserva.jsx';
import SelectorLaboratorio from './SelectorLaboratorio.jsx';
import Icono from './Icono.jsx';

const camposVacios = { laboratorioId: '', fecha: '', horaInicio: '', horaFin: '', motivo: '' };
export default function FormularioReserva({ laboratorios, laboratorioInicial = '', onGuardar }) {
  const [valores, setValores] = useState({ ...camposVacios, laboratorioId: laboratorioInicial });
  const [errores, setErrores] = useState({});
  const [creada, setCreada] = useState(null);
  // useRef conserva referencias al DOM; cambiar una referencia no vuelve a renderizar.
  const primerCampo = useRef(null);
  const formularioRef = useRef(null);
  // Después de montar, el selector ya existe y podemos darle el foco.
  useEffect(() => {
    primerCampo.current.focus();
  }, []);

  // name identifica el campo; spread conserva los demás valores del objeto.
  function cambiar(evento) {
    const { name, value } = evento.target;
    setValores({ ...valores, [name]: value });
    setErrores({ ...errores, [name]: undefined });
    setCreada(null);
  }

  // La prop onGuardar devuelve errores por campo o la reserva creada en App.
  function guardar(evento) {
    evento.preventDefault();
    const resultado = onGuardar(valores);
    if (resultado.errores) {
      setErrores(resultado.errores);
      const primerError = Object.keys(resultado.errores)[0];
      formularioRef.current.elements.namedItem(primerError)?.focus();
      return;
    }
    // reset actúa sobre el DOM; también limpiamos el estado porque controla los inputs.
    formularioRef.current.reset();
    setValores({ ...camposVacios });
    setErrores({});
    setCreada(resultado.reserva);
    primerCampo.current.focus();
  }

  return (
    <section className="surface form-surface">
      <h2>Información de tu reserva</h2>
      <p className="section-copy">Todos los campos son obligatorios. Horarios en hora de Perú.</p>
      {creada && (
        <div className="alert alert-success" role="status">
          <Icono nombre="check" /> <strong>{creada.codigo} registrada.</strong> Tu solicitud está pendiente.{' '}
          <Link to="/mis-reservas">Ver mis reservas</Link>
        </div>
      )}
      {errores.general && <div className="alert alert-danger" role="alert">{errores.general}</div>}
      {/* noValidate permite mostrar nuestros propios mensajes debajo de cada campo. */}
      <form ref={formularioRef} onSubmit={guardar} noValidate>
        <SelectorLaboratorio laboratorios={laboratorios} referencia={primerCampo}
          value={valores.laboratorioId} onChange={cambiar} error={errores.laboratorioId} />
        <CampoReserva id="fecha" etiqueta="Fecha" type="date" min={fechaCampus()}
          value={valores.fecha} onChange={cambiar} error={errores.fecha} />
        <div className="row g-3">
          <div className="col-sm-6">
            <CampoReserva id="horaInicio" etiqueta="Hora de inicio" type="time" step="60"
              value={valores.horaInicio} onChange={cambiar} error={errores.horaInicio} />
          </div>
          <div className="col-sm-6">
            <CampoReserva id="horaFin" etiqueta="Hora de fin" type="time" step="60"
              value={valores.horaFin} onChange={cambiar} error={errores.horaFin} />
          </div>
        </div>
        <CampoReserva id="motivo" etiqueta="Motivo de la reserva" multilinea maxLength={200}
          placeholder="Ejemplo: práctica grupal de React"
          value={valores.motivo} onChange={cambiar} error={errores.motivo} />
        <div className="form-actions">
          <Link to="/catalogo" className="btn btn-outline-secondary">Volver al catálogo</Link>
          <button className="btn btn-primary" type="submit">
            Confirmar solicitud <Icono nombre="arrow" size={17} />
          </button>
        </div>
      </form>
    </section>
  );
}
