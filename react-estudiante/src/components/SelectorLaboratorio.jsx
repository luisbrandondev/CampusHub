// Selector del formulario: recibe el valor, los errores y la referencia para el foco.
export default function SelectorLaboratorio({ laboratorios, referencia, value, onChange, error }) {
  return (
    <div className="field">
      <label className="form-label" htmlFor="laboratorioId">
        Laboratorio
      </label>
      <select
        ref={referencia}
        id="laboratorioId"
        name="laboratorioId"
        value={value}
        onChange={onChange}
        className={`form-select${error ? ' is-invalid' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'laboratorioId-error' : undefined}
      >
        <option value="">Selecciona un laboratorio</option>
        {laboratorios.map((lab) => (
          // key usa el ID estable; disabled impide elegir un laboratorio en mantenimiento.
          <option key={lab.id} value={lab.id} disabled={lab.estado !== 'disponible'}>
            {lab.nombre} · {lab.sede}
            {lab.estado === 'mantenimiento' ? ' (mantenimiento)' : ''}
          </option>
        ))}
      </select>
      {error && (
        <p className="invalid-feedback" id="laboratorioId-error">
          {error}
        </p>
      )}
    </div>
  );
}
