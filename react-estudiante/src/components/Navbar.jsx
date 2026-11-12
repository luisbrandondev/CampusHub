// Barra común: enlaces del router, nombre del estudiante y botón de tema.
import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import Icono from './Icono.jsx';
export default function Navbar({ subtitulo }) {
  // useContext lee los valores compartidos por los proveedores de main.jsx.
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const { tema, alternarTema } = useContext(ThemeContext);
  // Al salir, RutaProtegida decide si debe mostrar el login; evitamos dos redirecciones.
  return (
    <header className="site-header">
      <nav className="container-xl navbar student-navbar" aria-label="Navegación principal">
        <Link className="brand" to="/">
          <span className="brand-icon">
            <Icono nombre="logo" size={26} />
          </span>
          <span>
            CampusHub<small>{subtitulo}</small>
          </span>
        </Link>
        <div className="nav nav-links">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/catalogo">Laboratorios</NavLink>
          <NavLink to="/mis-reservas">Mis reservas</NavLink>
        </div>
        <div className="nav-account">
          <button
            className="theme-button"
            type="button"
            onClick={alternarTema}
            aria-label={tema === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            title={tema === 'light' ? 'Modo oscuro' : 'Modo claro'}
          >
            <Icono nombre={tema === 'light' ? 'moon' : 'sun'} />
          </button>
          {usuario ? (
            <>
              <span className="user-label">
                <span className="user-avatar" aria-hidden="true">
                  {usuario.nombre[0]}
                </span>
                {usuario.nombre.split(' ')[0]}
              </span>
              <button className="btn btn-outline-secondary btn-sm" onClick={cerrarSesion}>
                Salir
              </button>
            </>
          ) : (
            <Link className="btn btn-primary btn-sm" to="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
