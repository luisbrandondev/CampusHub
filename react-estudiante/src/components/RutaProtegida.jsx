// Impide mostrar las páginas de reservas cuando no hay una sesión simulada.
import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
export default function RutaProtegida() {
  const { usuario } = useContext(AuthContext);
  const ubicacion = useLocation();
  // Navigate cambia la ruta; state recuerda a qué página quería entrar el usuario.
  if (!usuario) {
    return <Navigate to="/login" state={{ desde: ubicacion.pathname + ubicacion.search }} replace />;
  }
  // Outlet es el espacio donde React Router coloca la página protegida.
  return <Outlet />;
}
