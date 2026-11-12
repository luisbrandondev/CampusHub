// Traduce el estado recibido por props a una etiqueta con texto y color.
const estados = {
  disponible: 'Disponible',
  mantenimiento: 'Mantenimiento',
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};
export default function BadgeEstado({ estado }) {
  const texto = estados[estado] || 'Estado desconocido';
  const clase = estados[estado] ? estado : 'desconocido';
  return (
    <span className={`status-badge status-${clase}`}>
      <span aria-hidden="true">●</span>
      {texto}
    </span>
  );
}
