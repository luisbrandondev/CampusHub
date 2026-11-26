// Las rutas reciben datos de hooks; las páginas se encargan de presentarlos.
import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import { useConsulta } from './hooks/useConsulta.js';
import { useReservas } from './hooks/useReservas.js';
import EstadoConsulta from './components/EstadoConsulta.jsx';
import Navbar from './components/Navbar.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Inicio from './pages/Inicio.jsx';
import Catalogo from './pages/Catalogo.jsx';
import DetalleLaboratorio from './pages/DetalleLaboratorio.jsx';
import NuevaReserva from './pages/NuevaReserva.jsx';
import MisReservas from './pages/MisReservas.jsx';
import Login from './pages/Login.jsx';
import NoEncontrado from './pages/NoEncontrado.jsx';

export default function App() {
  const { usuario } = useContext(AuthContext);
  const catalogo = useConsulta('/laboratorios');
  const reservas = useReservas(usuario?.id);
  const laboratorios = catalogo.datos ?? [];

  // Solo las rutas que necesitan el catálogo esperan esa consulta.
  function conCatalogo(pagina) {
    if (catalogo.cargando || catalogo.error)
      return <EstadoConsulta {...catalogo} onActualizar={catalogo.actualizar} />;
    return pagina;
  }

  return (
    <>
      <a className="visually-hidden-focusable skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar subtitulo="PORTAL DEL ESTUDIANTE" />
      <main className="container-xl main-shell" id="contenido">
        <Routes>
          <Route
            path="/"
            element={conCatalogo(
              <Inicio
                laboratorios={laboratorios}
                reservas={reservas.datos}
                consultaReservas={reservas}
              />,
            )}
          />
          <Route path="/catalogo" element={conCatalogo(<Catalogo laboratorios={laboratorios} />)} />
          <Route path="/catalogo/:id" element={<DetalleLaboratorio />} />
          <Route element={<RutaProtegida />}>
            <Route
              path="/mis-reservas"
              element={conCatalogo(<MisReservas gestion={reservas} laboratorios={laboratorios} />)}
            />
            <Route
              path="/nueva-reserva"
              element={conCatalogo(
                <NuevaReserva laboratorios={laboratorios} onCrearReserva={reservas.crear} />,
              )}
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      <footer className="container-xl site-footer">
        <span>CampusHub Labs · Un lugar para tus ideas</span>
        <span>Portal del estudiante</span>
      </footer>
    </>
  );
}
