import { createContext, useState } from 'react';
import { autenticarLocal } from '../utils/auth.js';
import { consultar } from '../services/api.js';
import { esCorreoUTP } from '../core/validadores.js';
export const AuthContext = createContext(null);
const CLAVE = 'campushub-estudiante';

function leerSesion() {
  try {
    const usuario = JSON.parse(localStorage.getItem(CLAVE));
    return usuario?.rol === 'estudiante' && usuario?.id && typeof usuario.nombre === 'string'
      ? usuario
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // La función inicial permite conservar la sesión al recargar.
  const [usuario, setUsuario] = useState(leerSesion);

  async function iniciarSesion(correo, password) {
    const limpio = correo.trim().toLowerCase();
    if (!esCorreoUTP(limpio)) return { error: 'Ingresa tu correo institucional @utp.edu.pe.' };
    try {
      const usuarios = await consultar('/usuarios?correo=' + encodeURIComponent(limpio));
      const resultado = autenticarLocal(limpio, password, usuarios);
      if (resultado.usuario) {
        // Guardamos el perfil sin contraseña. El login es simulado hasta el avance 5.
        localStorage.setItem(CLAVE, JSON.stringify(resultado.usuario));
        setUsuario(resultado.usuario);
      }
      return resultado;
    } catch (error) {
      return { error: error.message };
    }
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}
