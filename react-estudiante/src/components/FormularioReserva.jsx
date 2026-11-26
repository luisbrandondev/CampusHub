// Formulario controlado: muestra los valores del estado y comunica el envío al padre.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CamposReserva from './CamposReserva.jsx';
import Icono from './Icono.jsx';

const camposVacios = { laboratorioId: '', fecha: '', horaInicio: '', horaFin: '', motivo: '' };
export default function FormularioReserva({ laboratorios, laboratorioInicial = '', onGuardar }) {
  const [valores, setValores] = useState({ ...camposVacios, laboratorioId: laboratorioInicial });
  const [errores, setErrores] = useState({});
  const [creada, setCreada] = useState(null);
  const [guardando, setGuardando] = useState(false);
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

  // Esperamos al hook: devuelve errores por campo o la reserva guardada en la API.
  async function guardar(evento) {
    evento.preventDefault();
    if (guardando) return;
    setGuardando(true);
    const resultado = await onGuardar(valores);
    setGuardando(false);
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
          <Icono nombre="check" /> <strong>{creada.codigo} registrada.</strong> Tu solicitud está
          pendiente. <Link to="/mis-reservas">Ver mis reservas</Link>
        </div>
      )}
      {errores.general && (
        <div className="alert alert-danger" role="alert">
          {errores.general}
        </div>
      )}
      {/* noValidate permite mostrar nuestros propios mensajes debajo de cada campo. */}
      <form ref={formularioRef} onSubmit={guardar} noValidate>
        <CamposReserva
          laboratorios={laboratorios}
          primerCampo={primerCampo}
          valores={valores}
          errores={errores}
          guardando={guardando}
          onChange={cambiar}
        />
      </form>
    </section>
  );
}
