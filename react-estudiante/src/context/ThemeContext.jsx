// Comparte el tema visual para que todas las páginas cambien juntas de color.
import { createContext, useEffect, useState } from 'react';
export const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [tema, setTema] = useState('light');
  // El efecto actualiza el atributo que Bootstrap y nuestro CSS usan para el tema.
  useEffect(() => {
    document.documentElement.dataset.bsTheme = tema;
    document.documentElement.style.colorScheme = tema;
  }, [tema]);
  function alternarTema() {
    setTema((actual) => (actual === 'light' ? 'dark' : 'light'));
  }
  return <ThemeContext.Provider value={{ tema, alternarTema }}>{children}</ThemeContext.Provider>;
}
