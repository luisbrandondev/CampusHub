// Dibuja los iconos del diseño con SVG, sin instalar una biblioteca adicional.
// Cada cadena contiene coordenadas del dibujo; no interviene en las reservas.
const trazos = {
  logo: 'm3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  sun: 'M12 3V1m0 22v-2M3 12H1m22 0h-2M5 5 3 3m18 18-2-2M5 19l-2 2M21 3l-2 2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
  moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
  calendar: 'M5 5h14v16H5V5Zm0 5h14M8 2v6m8-6v6M8 14h2m4 0h2m-8 3h2',
  users:
    'M15 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm5-2a4 4 0 0 1 0 8m1 3a4 4 0 0 1 3 4v1',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  monitor: 'M3 3h18v13H3V3Zm9 13v5m-5 0h10',
  clock: 'M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  check: 'm5 12 4 4L19 6',
};
export default function Icono({ nombre, size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={trazos[nombre] ?? trazos.logo} />
    </svg>
  );
}
