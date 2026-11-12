// Comparte el estudiante en sesión. Las cuentas salen del JSON local de S14.
import { createContext, useState } from 'react';
import db from '../data/db.json';
import { autenticarLocal } from '../utils/auth.js';
export const AuthContext = createContext(null);
// children son los componentes colocados dentro de AuthProvider en main.jsx.
export function AuthProvider({ children }) {
  // null significa que no hay sesión; useState conserva el perfil al navegar.
  const [usuario, setUsuario] = useState(null);
  // La función de JavaScript comprueba correo, contraseña y rol.
  function iniciarSesion(correo, password) {
    const resultado = autenticarLocal(correo, password, db.usuarios);
    if (resultado.usuario) setUsuario(resultado.usuario);
    return resultado;
  }
  function cerrarSesion() {
    setUsuario(null);
  }
  // Los descendientes leen este value mediante useContext(AuthContext).
  return <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>{children}</AuthContext.Provider>;
}
