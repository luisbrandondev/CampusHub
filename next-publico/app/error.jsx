'use client';
export default function ErrorConsulta({ reset }) {
  return <section className="panel" role="alert"><h1>No pudimos consultar los datos.</h1>
    <p>Comprueba que la API esté activa e intenta nuevamente.</p><button onClick={reset}>Reintentar</button></section>;
}
