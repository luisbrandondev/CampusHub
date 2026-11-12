// Reutiliza etiqueta, control y error para evitar repetirlos en reserva y login.
export default function CampoReserva({ id, etiqueta, error, value, onChange, multilinea = false, ...atributos }) {
  // ...atributos recoge propiedades como type o min. Spread las aplica al input.
  const comunes = {
    id,
    name: id,
    value,
    onChange,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
    className: `form-control${error ? ' is-invalid' : ''}`,
    ...atributos,
  };
  return (
    <div className="field">
      <label className="form-label" htmlFor={id}>
        {etiqueta}
      </label>
      {/* value y onChange vienen del padre: el control no guarda otro estado. */}
      {multilinea ? <textarea {...comunes} rows={3} /> : <input {...comunes} />}
      {error && (
        <p id={`${id}-error`} className="invalid-feedback">
          {error}
        </p>
      )}
    </div>
  );
}
