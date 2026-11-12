// Página del catálogo: filtra los laboratorios que App entrega mediante props.
import { useState } from 'react';
import { useTitulo } from '../hooks/useTitulo.js';
import { sedesUnicas } from '../core/estadisticas.js';
import ListaLaboratorios from '../components/ListaLaboratorios.jsx';
import Icono from '../components/Icono.jsx';
export default function Catalogo({ laboratorios }) {
  useTitulo('Laboratorios');
  // useState guarda los filtros; cada cambio vuelve a calcular la lista visible.
  const [sede, setSede] = useState('');
  const [texto, setTexto] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  // Quita tildes y pasa a minúsculas: "robótica" también se encuentra con "robotica".
  const normalizar = (valor) =>
    valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  // filter conserva solo los laboratorios que cumplen las tres condiciones.
  const filtrados = laboratorios.filter((laboratorio) => {
    const coincideSede = sede === '' || laboratorio.sede === sede;
    const coincideEstado = !soloDisponibles || laboratorio.estado === 'disponible';
    const contenido = `${laboratorio.nombre} ${laboratorio.sede} ${laboratorio.equipos.join(' ')}`;
    const coincideTexto = normalizar(contenido).includes(normalizar(texto.trim()));
    return coincideSede && coincideEstado && coincideTexto;
  });
  function limpiar() {
    setSede('');
    setTexto('');
    setSoloDisponibles(false);
  }
  return (
    <>
      <header className="page-intro">
        <span className="eyebrow">EXPLORA TU CAMPUS</span>
        <h1>Encuentra tu laboratorio.</h1>
        <p>El espacio adecuado para lo que tienes en mente.</p>
      </header>
      <section className="surface catalog-filters" aria-label="Filtros del catálogo">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label" htmlFor="buscar">
              Buscar laboratorio o equipo
            </label>
            <div className="search-field">
              <Icono nombre="search" size={18} />
              <input
                id="buscar"
                className="form-control"
                type="search"
                placeholder="Prueba con Arduino, PC i7 o un laboratorio"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="sede">
              Sede
            </label>
            <select id="sede" className="form-select" value={sede} onChange={(e) => setSede(e.target.value)}>
              <option value="">Todas las sedes</option>
              {sedesUnicas(laboratorios).map((opcion) => (
                <option key={opcion}>{opcion}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={limpiar}>
              Limpiar
            </button>
          </div>
        </div>
        <div className="filter-bottom">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={soloDisponibles}
              onChange={(e) => setSoloDisponibles(e.target.checked)}
            />
            Solo disponibles
          </label>
          <span role="status">{filtrados.length} laboratorio(s) encontrados</span>
        </div>
      </section>
      <ListaLaboratorios laboratorios={filtrados} onLimpiar={limpiar} />
    </>
  );
}
