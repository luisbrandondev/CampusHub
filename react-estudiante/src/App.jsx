// Organiza las rutas y guarda las reservas que comparten las páginas del portal.
import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import db from './data/db.json';
import { validarFormularioReserva, construirReserva } from './utils/reservas.js';
import { inicioReserva } from './utils/fechas.js';
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
  const { pathname } = useLocation();
  const laboratorios = db.laboratorios;
  // useState conserva la lista al navegar. Spread crea otra lista sin alterar el JSON.
  const [reservas, setReservas] = useState([...db.reservas]);

  // Al cambiar de página, el navegador vuelve a la parte superior.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // El formulario llama a esta función por una prop; primero validamos, luego guardamos.
  function crearReserva(valores) {
    if (!usuario) return { errores: { general: 'Inicia sesión para reservar.' } };
    const errores = validarFormularioReserva(valores, usuario.id, laboratorios, reservas);
    if (Object.keys(errores).length > 0) return { errores };
    const reserva = construirReserva(valores, usuario.id, reservas);
    setReservas((actuales) => [...actuales, reserva]);
    return { reserva };
  }

  // Solo se puede quitar una reserva propia, activa y futura. filter crea otra lista.
  function cancelarReserva(id) {
    const reserva = reservas.find((reserva) => reserva.id === id);
    if (!reserva || reserva.usuarioId !== usuario?.id) return false;
    if (reserva.estado === 'rechazada' || inicioReserva(reserva) <= Date.now()) return false;
    setReservas((actuales) => actuales.filter((reserva) => reserva.id !== id));
    return true;
  }

  // Los datos bajan mediante props; las páginas avisan de cambios llamando a funciones.
  return (
    <>
      <a className="visually-hidden-focusable skip-link" href="#contenido">Saltar al contenido</a>
      <Navbar subtitulo="PORTAL DEL ESTUDIANTE" />
      <main className="container-xl main-shell" id="contenido">
        <Routes>
          <Route path="/" element={<Inicio laboratorios={laboratorios} reservas={reservas} />} />
          <Route path="/catalogo" element={<Catalogo laboratorios={laboratorios} />} />
          <Route path="/catalogo/:id" element={<DetalleLaboratorio laboratorios={laboratorios} reservas={reservas} />} />
          {/* Outlet muestra estas páginas solamente si RutaProtegida encuentra una sesión. */}
          <Route element={<RutaProtegida />}>
            <Route path="/mis-reservas" element={
              <MisReservas reservas={reservas} laboratorios={laboratorios} onCancelarReserva={cancelarReserva} />
            } />
            <Route path="/nueva-reserva" element={
              <NuevaReserva laboratorios={laboratorios} onCrearReserva={crearReserva} />
            } />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      <footer className="container-xl site-footer">
        <span>CampusHub Labs · Un lugar para tus ideas</span>
        <span>Demostración académica · Semana 14</span>
      </footer>
    </>
  );
}
