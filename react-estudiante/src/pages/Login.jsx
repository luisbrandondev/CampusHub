// Permite ingresar con las cuentas locales y volver a la página que pidió sesión.
import { useContext, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useTitulo } from '../hooks/useTitulo.js';
import CampoReserva from '../components/CampoReserva.jsx';
import Icono from '../components/Icono.jsx';

export default function Login() {
  useTitulo('Iniciar sesión');
  const { usuario, iniciarSesion } = useContext(AuthContext);
  const ubicacion = useLocation();
  const [valores, setValores] = useState({ correo: '', password: '' });
  const [errores, setErrores] = useState({});
  // RutaProtegida guarda la dirección de origen. Solo aceptamos rutas internas.
  let destino = ubicacion.state?.desde || '/mis-reservas';
  if (!destino.startsWith('/') || destino.startsWith('//')) destino = '/mis-reservas';
  if (usuario) return <Navigate to={destino} replace />;

  // Un solo onChange sirve para ambos inputs porque name coincide con su clave.
  function cambiar(evento) {
    const { name, value } = evento.target;
    setValores({ ...valores, [name]: value });
    setErrores({});
  }

  // preventDefault evita recargar; el contexto comprueba la cuenta en el JSON.
  function ingresar(evento) {
    evento.preventDefault();
    if (!valores.password) {
      setErrores({ password: 'Ingresa la contraseña de demostración.' });
      return;
    }
    const resultado = iniciarSesion(valores.correo, valores.password);
    if (resultado.error) {
      setErrores({ acceso: resultado.error });
      return;
    }
    // AuthContext actualiza usuario; el Navigate de arriba abre el destino.
  }

  return (
    <section className="login-layout">
      <div className="login-story">
        <span className="eyebrow">BIENVENIDO A TU CAMPUS</span>
        <h1>Tu siguiente idea<br />ya tiene lugar.</h1>
        <p>Ingresa para reservar un laboratorio y organizar tus próximas actividades.</p>
        <div className="login-illustration" aria-hidden="true">
          <Icono nombre="logo" size={106} />
          <span>CAMPUSHUB LABS</span>
        </div>
        <Link to="/catalogo" className="quiet-link">Explorar sin iniciar sesión <Icono nombre="arrow" size={18} /></Link>
      </div>
      <div className="surface login-form">
        <h2>Inicia sesión</h2>
        <p className="section-copy">Usa una cuenta de estudiante de demostración.</p>
        {ubicacion.state?.desde && <div className="alert alert-info">Inicia sesión para acceder a tus reservas.</div>}
        <form onSubmit={ingresar} noValidate>
          {/* Reutilizamos el mismo campo accesible del formulario de reservas. */}
          <CampoReserva id="correo" etiqueta="Correo institucional" type="email" autoComplete="username"
            placeholder="u20260001@utp.edu.pe" value={valores.correo} onChange={cambiar} />
          <CampoReserva id="password" etiqueta="Contraseña" type="password" autoComplete="current-password"
            value={valores.password} onChange={cambiar} error={errores.password} />
          {errores.acceso && <div className="alert alert-danger" role="alert">{errores.acceso}</div>}
          <button className="btn btn-primary w-100" type="submit">Entrar al portal <Icono nombre="arrow" size={18} /></button>
        </form>
        <div className="demo-account">
          <strong>Cuenta para probar</strong>
          <span>u20260001@utp.edu.pe</span>
          <span>Contraseña: <code>est123</code></span>
          <p>Inicio de sesión simulado con datos locales. No ingreses contraseñas personales.</p>
        </div>
      </div>
    </section>
  );
}
