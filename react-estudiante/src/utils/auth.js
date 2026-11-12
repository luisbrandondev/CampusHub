// Comprueba una cuenta del JSON local; no realiza una petición ni un login de servidor.
import { esCorreoUTP } from '../core/validadores.js';
export function autenticarLocal(correo, password, usuarios) {
  // trim quita espacios y toLowerCase permite escribir el correo con mayúsculas.
  const limpio = correo.trim().toLowerCase();
  if (!esCorreoUTP(limpio)) return { error: 'Ingresa tu correo institucional @utp.edu.pe.' };
  const encontrado = usuarios.find((u) => u.correo.toLowerCase() === limpio && u.password === password);
  if (!encontrado) return { error: 'El correo o la contraseña no coinciden con una cuenta de demostración.' };
  if (encontrado.rol !== 'estudiante')
    return { error: 'Este portal es para estudiantes. La administración se realiza en Angular.' };
  // El resto del objeto forma el perfil: la contraseña no se entrega al contexto.
  const { password: omitida, ...usuario } = encontrado;
  return { usuario };
}
