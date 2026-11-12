// Reutiliza el mismo efecto en las páginas para actualizar el título de la pestaña.
import { useEffect } from 'react';
export function useTitulo(titulo) {
  // [titulo] hace que el efecto se repita solo cuando cambia ese valor.
  useEffect(() => {
    document.title = `${titulo} | CampusHub Labs`;
  }, [titulo]);
}
