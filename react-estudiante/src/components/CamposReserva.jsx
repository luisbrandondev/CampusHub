import { Link } from 'react-router-dom';
import { fechaCampus } from '../utils/fechas.js';
import CampoReserva from './CampoReserva.jsx';
import Icono from './Icono.jsx';
import SelectorLaboratorio from './SelectorLaboratorio.jsx';

// Agrupa solo los controles visuales para que el formulario principal sea más fácil de seguir.
export default function CamposReserva({
  laboratorios,
  primerCampo,
  valores,
  errores,
  guardando,
  onChange,
}) {
  return (
    <>
      <SelectorLaboratorio
        laboratorios={laboratorios}
        referencia={primerCampo}
        value={valores.laboratorioId}
        onChange={onChange}
        error={errores.laboratorioId}
      />
      <CampoReserva
        id="fecha"
        etiqueta="Fecha"
        type="date"
        min={fechaCampus()}
        value={valores.fecha}
        onChange={onChange}
        error={errores.fecha}
      />
      <div className="row g-3">
        <div className="col-sm-6">
          <CampoReserva
            id="horaInicio"
            etiqueta="Hora de inicio"
            type="time"
            step="60"
            value={valores.horaInicio}
            onChange={onChange}
            error={errores.horaInicio}
          />
        </div>
        <div className="col-sm-6">
          <CampoReserva
            id="horaFin"
            etiqueta="Hora de fin"
            type="time"
            step="60"
            value={valores.horaFin}
            onChange={onChange}
            error={errores.horaFin}
          />
        </div>
      </div>
      <CampoReserva
        id="motivo"
        etiqueta="Motivo de la reserva"
        multilinea
        maxLength={200}
        placeholder="Ejemplo: práctica grupal de React"
        value={valores.motivo}
        onChange={onChange}
        error={errores.motivo}
      />
      <div className="form-actions">
        <Link to="/catalogo" className="btn btn-outline-secondary">
          Volver al catálogo
        </Link>
        <button className="btn btn-primary" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Confirmar solicitud'} <Icono nombre="arrow" size={17} />
        </button>
      </div>
    </>
  );
}
