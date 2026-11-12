// Página 404 que aparece cuando la dirección no coincide con ninguna ruta.
import { Link } from 'react-router-dom';
import { useTitulo } from '../hooks/useTitulo.js';
import EstadoVacio from '../components/EstadoVacio.jsx';
export default function NoEncontrado() {
  useTitulo('Página no encontrada');
  return (
    <>
      <p className="eyebrow mt-4">ERROR 404</p>
      <EstadoVacio
        titulo="Este espacio no existe"
        descripcion="La dirección que abriste no corresponde a una página del portal."
      >
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </EstadoVacio>
    </>
  );
}
