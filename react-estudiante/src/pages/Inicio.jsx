// Página de bienvenida: resume el catálogo y muestra la próxima reserva del estudiante.
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useTitulo } from '../hooks/useTitulo.js';
import ContadorReserva from '../components/ContadorReserva.jsx';
import ListaLaboratorios from '../components/ListaLaboratorios.jsx';
import Icono from '../components/Icono.jsx';
export default function Inicio({ laboratorios, reservas }) {
  useTitulo('Inicio');
  const { usuario } = useContext(AuthContext);
  // filter y Set calculan el resumen; no crean otro estado ni modifican el catálogo.
  const disponibles = laboratorios.filter((lab) => lab.estado === 'disponible');
  const sedes = new Set(laboratorios.map((lab) => lab.sede));
  return (
    <>
      <section className="hero row g-4 align-items-stretch">
        <div className="col-lg-7 hero-copy">
          <span className="eyebrow">
            <span className="live-dot" />
            TU CAMPUS, A TU ALCANCE
          </span>
          <h1>
            Un espacio para
            <br />
            tus <em>grandes ideas.</em>
          </h1>
          <p>
            {usuario ? `Hola, ${usuario.nombre.split(' ')[0]}. ` : ''}Encuentra el laboratorio ideal, elige tu horario y
            dale lugar a tu próximo proyecto.
          </p>
          <div className="hero-actions">
            <Link to="/catalogo" className="btn btn-primary btn-lg">
              Explorar laboratorios <Icono nombre="arrow" />
            </Link>
            <Link to="/nueva-reserva" className="quiet-link">
              Crear una reserva
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{laboratorios.length}</strong>
              <span>laboratorios</span>
            </div>
            <div>
              <strong>{sedes.size}</strong>
              <span>sedes</span>
            </div>
            <div>
              <strong>{disponibles.length}</strong>
              <span>espacios disponibles</span>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <ContadorReserva reservas={reservas} usuarioId={usuario?.id} laboratorios={laboratorios} />
        </div>
      </section>
      <section className="steps-strip" aria-label="Cómo reservar">
        <div>
          <span>01</span>
          <p>
            <strong>Explora</strong>Encuentra tu espacio.
          </p>
        </div>
        <div>
          <span>02</span>
          <p>
            <strong>Elige tu horario</strong>Sin cruces entre reservas.
          </p>
        </div>
        <div>
          <span>03</span>
          <p>
            <strong>Organízate</strong>Consulta tus solicitudes.
          </p>
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EL LUGAR PARA EMPEZAR</span>
            <h2>Espacios que te esperan</h2>
            <p>Equipados para aprender, crear y trabajar en equipo.</p>
          </div>
          <Link to="/catalogo" className="quiet-link">
            Ver todos <Icono nombre="arrow" size={18} />
          </Link>
        </div>
        <ListaLaboratorios laboratorios={disponibles.slice(0, 3)} />
      </section>
    </>
  );
}
