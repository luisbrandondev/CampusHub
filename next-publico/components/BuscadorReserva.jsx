'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Solo el formulario necesita JavaScript en el navegador; las consultas son del servidor.
export default function BuscadorReserva() {
  const [codigo, setCodigo] = useState('');
  const router = useRouter();
  function buscar(evento) {
    evento.preventDefault();
    router.push(`/reserva/${encodeURIComponent(codigo.trim().toUpperCase())}`);
  }
  return (
    <form onSubmit={buscar}>
      <label htmlFor="codigo">Código de reserva</label>
      <div className="buscador">
        <input
          id="codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="RES-0001"
          pattern="[Rr][Ee][Ss]-[0-9]{4,}"
          title="Ejemplo: RES-0001"
          required
        />
        <button type="submit">Consultar →</button>
      </div>
    </form>
  );
}
