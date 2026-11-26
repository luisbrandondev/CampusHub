import Link from 'next/link';
import { consultar } from '../../lib/api.js';

export const metadata = {
  title: 'Laboratorios',
  description: 'Catálogo público de laboratorios: sedes, equipamiento, capacidad y disponibilidad.',
};

export default async function Laboratorios() {
  const laboratorios = await consultar('/laboratorios');
  return (
    <>
      <p className="etiqueta">EXPLORA TU CAMPUS</p>
      <h1>Encuentra tu laboratorio.</h1>
      <p className="intro">Espacios equipados para aprender, crear y compartir ideas.</p>
      {!laboratorios?.length ? (
        <p className="panel">No hay laboratorios publicados.</p>
      ) : (
        <div className="catalogo">
          {laboratorios.map((lab) => (
            <article className="tarjeta" key={lab.id}>
              <div className="visual" aria-hidden="true">
                <span>▣</span>
                {lab.nombre.replace('Lab ', '')}
              </div>
              <div className="tarjeta-cuerpo">
                <span className={`estado ${lab.estado}`}>{lab.estado}</span>
                <h2>{lab.nombre}</h2>
                <p>
                  {lab.sede} · {lab.capacidad} puestos
                </p>
                <p className="equipos">{lab.equipos.join(' · ')}</p>
                <Link href={`/laboratorios/${lab.id}`}>Conocer laboratorio →</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
