# Verificación del Avance 2 simplificado — Semana 14

**Fecha de cierre:** 12/11/2026 (Perú). **Fuentes:** exclusivamente el ZIP y el PDF adjuntos a esta revisión. Entorno de ejecución: Linux, Node.js 24.22.1, npm 11.9.0 y Chromium automatizado con Playwright. Se conservaron las versiones fijadas por el ZIP; React compiló con Vite 7.3.8.

## 1. Instalación y pruebas ejecutadas

| Comprobación | Resultado observado |
| --- | --- |
| `npm ci --no-audit --no-fund` | Instalación completa: 519 paquetes. Un intento inicial sin red no tenía todo en caché; la instalación normal sí terminó. |
| `npm test` | 30 pruebas de validadores, clases, estadísticas y semilla; 30 aprobadas, 0 fallos. |
| `npm run test:api` | 15 casos más el contenedor: Node reporta 16 pruebas aprobadas, 0 fallos. Se cubren GET, POST, PUT, PATCH y DELETE. |
| `npm run test:react` | 20 pruebas de reglas de reservas, autenticación y fechas; 20 aprobadas, 0 fallos. |
| `npm run revisar:componentes` | Todos los archivos JSX bajo el límite de 120 líneas. Versión final: 23 archivos, máximo 112, incluidos comentarios y líneas en blanco. |
| `npm run build:angular` | Compilación de producción completada. |
| `npm run build:react` | Compilación de producción completada; repetida después de la corrección final de navegación. |
| `npm start` | API en 3000, Angular en 4200 y React en 5173 iniciaron juntos. |
| Ejercicios de la guía | Aplicados en una copia: compilación React y revisión de líneas aprobadas; 24 archivos JSX, máximo 112, incluido el Perfil de 17 líneas. |

`npm run verificar` agrupa las tres suites, el conteo de líneas y las dos compilaciones. Los tests se encuentran en `core-js/core.test.js`, `pruebas/api.test.mjs` y `react-estudiante/tests/reservas.test.js`. Las pruebas de reglas no sustituyen a las pruebas de interfaz; se ejecutaron ambas. El aviso de npm sobre la configuración `http-proxy` del entorno no impidió instalar, probar ni compilar y no se añadió al proyecto.

## 2. Navegador: portal React

Se usó una vista de escritorio de 1440 × 1000 y vistas móviles de 390 × 844. El reloj del navegador comenzó en **2030-01-10 09:00, hora de Perú** (14:00 UTC), para probar de forma reproducible reservas futuras sin alterar el reloj del sistema ni las fechas de la semilla.

| Escenario ejecutado | Observación |
| --- | --- |
| Catálogo | 8 tarjetas; filtros por texto, texto sin tildes, sede y disponibilidad; 6 disponibles; estado vacío y limpieza. La navegación conserva una marca en `window`, comprobando que no recarga el documento. |
| Detalle y rutas | Detalle por ID, ID inexistente y 404; al pedir reservar sin sesión aparece el login. Después de ingresar se conserva la ruta y el laboratorio preseleccionado. |
| Login | Correo ajeno, contraseña incorrecta y administrador rechazados; estudiantes de muestra admitidos. Cerrar sesión desde una página protegida devuelve al login sin la doble redirección que se corrigió. |
| Formulario | Errores bajo los cinco campos al enviar vacío; laboratorios en mantenimiento deshabilitados; fecha pasada, final anterior y motivo corto rechazados. |
| Guardado | Se crea RES-0021 como pendiente; se vacían los cinco valores y el foco vuelve al selector Laboratorio. |
| Cruce de horarios | 10:00–11:00 bloquea 10:30–11:30; 11:00–12:00 se admite como RES-0022. También se bloquea el cruce al ingresar como otro estudiante. |
| Historial y cancelación | Solo se muestran reservas propias; funciona el filtro por estado. Cancelar una propia futura la elimina y libera su horario. |
| Contador y cleanup | Cambia cada segundo; hay 1 intervalo de un segundo en la tarjeta con sesión, 0 al ir al catálogo y 1 al volver. Al avanzar el reloj pasa a la siguiente reserva futura y finalmente al mensaje vacío. |
| Contextos y recarga | El tema oscuro se conserva al navegar. Salir cambia el usuario; recargar restablece sesión y reservas de muestra. |
| Móvil | Inicio, catálogo, formulario e historial sin desbordamiento horizontal a 390 px; revisión visual de las capturas de preparación. |
| Datos locales y consola | 0 peticiones de React al puerto 3000; 0 errores de consola y 0 excepciones de página observados en el recorrido completado. |

Las pruebas contemplaron dos cuentas: `u20260001@utp.edu.pe` y `u20260002@utp.edu.pe`, con contraseña ficticia `est123`. Las capturas producidas para revisar la interfaz son material temporal de comprobación, no sustituyen la demostración del estudiante.

## 3. Conservación del Avance 1

- Se compararon **37 archivos** del núcleo, Angular, API y pruebas contra el ZIP: 21 fuentes JS/TS comparadas tras transpilación sin comentarios, 7 plantillas/estilos sin comentarios y 9 archivos de datos/configuración byte a byte. No se encontraron cambios funcionales en esa comparación.
- Los archivos `package.json`, `react-estudiante/package.json` y `package-lock.json` mantienen exactamente sus bytes originales; no se añadieron bibliotecas.
- Las fuentes de clases, validadores y estadísticas solo recibieron comentarios. Pasaron las 30 pruebas del núcleo y las 16 reportadas del API.
- En Chromium se creó un laboratorio, se abrió su detalle, se editó su capacidad y estado, y se eliminó sin recargar. Capacidad 61 se rechazó; 20 y 25 se aceptaron. Se observó la directiva de mantenimiento y la presentación del pipe en reservas.
- Angular terminó con los 8 laboratorios y las 20 reservas de la semilla. No se observaron excepciones de página en ese recorrido. La base `api-mock/db.json` se restauró y comparó byte a byte con el archivo recibido después de la prueba.
- Los documentos y evidencias S13 incluidos provienen del ZIP; no se presentan como capturas nuevas ni se cambian sus fechas históricas.

## 4. Cambios en vivo comprobados

Se copiaron literalmente los bloques de `GUIA_SUSTENTACION_S14.md` en una carpeta separada, conservando el portal final sin esas funciones adicionales.

| Ejercicio | Verificación real |
| --- | --- |
| `/perfil` | Compila; sin sesión redirige al login; con sesión muestra Lucía Ramos, su correo y código desde AuthContext; salir vuelve a proteger la ruta. |
| Título | La pestaña cambia a `Catálogo de laboratorios \| CampusHub Labs`. |
| Filtro por capacidad | Mínimo 30 muestra A-301, C-101 y D-402; con Solo disponibles quedan dos; Limpiar devuelve ocho y vacía el campo. |
| Mensaje de validación | Un final anterior muestra el texto nuevo bajo Hora de fin. |
| Limpieza del intervalo | El código entregado conserva su cleanup; la instrumentación del recorrido principal confirmó la eliminación al desmontar. No se entrega la versión defectuosa sin cleanup. |

La copia de ejercicios compiló, respetó las 120 líneas y no produjo errores de consola ni de página en su recorrido. No se añadieron Playwright ni el navegador automatizado como dependencias del proyecto.

## 5. Comprobación del paquete

Se extrajo un ZIP limpio en otra carpeta y se ejecutó `npm ci --offline --no-audit --no-fund` usando la caché obtenida en la instalación anterior: 519 paquetes instalados. Después pasaron `npm run revisar:componentes` y `npm run build`, que compiló Angular y React. Las copias del núcleo se regeneraron automáticamente. La compilación React produjo el mismo archivo de aplicación que la carpeta de trabajo (`index-hfsg6vMD.js`).

Tras actualizar únicamente esta documentación, se recompuso el ZIP final y se comprobó que sus fuentes/configuraciones coinciden byte a byte con las de la extracción compilada. El ZIP contiene 125 archivos, sin `node_modules`, `.git`, `dist`, cachés ni archivos temporales. Las copias generadas `src/core/` no se incluyen: los scripts las crean antes de arrancar o compilar. Se comprobó la integridad del ZIP y la presencia de los cinco documentos de apoyo.

## 6. Reproducir en la PC de sustentación

Los comandos exactos para Windows 11 y PowerShell están en `INSTRUCCIONES_WINDOWS11.md`. Desde la raíz:

```powershell
npm.cmd ci
npm.cmd run verificar
npm.cmd run estudiante
```

1. Abre http://localhost:5173 y comprueba los filtros del catálogo.
2. Abre `/nueva-reserva` sin sesión e ingresa con la cuenta de estudiante.
3. Envía vacío; muestra dónde aparece cada error.
4. Elige un laboratorio disponible y una fecha futura sin reservas existentes. Guarda 15:00–16:00 con un motivo válido; comprueba limpieza y foco.
5. Intenta 15:30–16:30 del mismo día y laboratorio: debe rechazarse. Prueba 16:00–17:00: debe permitirse si no hay otra reserva.
6. Abre Mis reservas, observa el contador y el filtro, cambia el tema y navega al catálogo.
7. Vuelve, cancela una propia futura y cambia al segundo estudiante: el historial es distinto, pero un horario ocupado por el primero sigue bloqueado.
8. Recarga: vuelve al login y a los datos de muestra. Prueba una ruta desconocida y un ID inexistente.
9. Para Angular, detén React, ejecuta `npm.cmd start` y prueba el CRUD en http://localhost:4200 con un registro de práctica; elimínalo al terminar.
10. Practica los cambios de la guía en una copia y vuelve a compilar.

Usa una fecha futura real para estas comprobaciones manuales; no cambies el reloj de tu PC. La fecha de 2030 se usó solo en el navegador automatizado de preparación.

## 7. Alcance y pendientes reales

- No se ejecutó Windows 11. Se prepararon comandos compatibles con PowerShell y scripts Node, pero falta comprobar tu PC y la del laboratorio.
- El recorrido automatizado verifica los casos descritos, no todos los estados posibles ni todos los navegadores.
- El login es simulado y las reservas son locales. Persistencia e integración HTTP React–Angular corresponden a S15.
- No se publicaron commits, etiquetas o entregas en el aula virtual. Deben completarse los datos reales del grupo, su revisión, los aportes individuales y la publicación de `avance-2`.
- La cobertura técnica de los cuatro criterios no asigna automáticamente la nota: cada integrante debe explicar y modificar el código como exige el PDF.
