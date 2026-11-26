# CampusHub Labs — Avances 1 a 4

Proyecto de JavaScript Avanzado (100000SI56), ciclo 6. Sistema de consulta y reserva de laboratorios: cuatro frontends consumen la misma API REST.

## Integrantes

- Luis Brandon Laurente Macha — U18311719 — [luisbrandondev](https://github.com/luisbrandondev).
- Loa Rojas, Jahn Pahol.

**Dominio:** CampusHub Labs. **Repositorio:** https://github.com/luisbrandondev/CampusHub.

El equipo actual tiene dos integrantes tras el retiro de una compañera. La guía establece grupos de 3 a 4: corresponde comunicar el cambio al docente y confirmar la excepción. Cada integrante registra sus contribuciones reales desde su propia cuenta.

## Instalación y ejecución

Requisitos: Node.js 22.12+ de la rama 22 o Node.js 24, npm y Git. No hace falta instalar Angular CLI globalmente.

Desde la raíz del repositorio:

```bash
npm ci
npm start
```

El segundo comando inicia la API y los cuatro frontends. Detener con **Ctrl + C**.
No ejecutar simultáneamente otro servidor en esos mismos puertos.

| Módulo | Dirección | Comando individual desde la raíz |
|---|---|---|
| API simulada | http://localhost:3000 | `npm run api` |
| Angular: administración | http://localhost:4200 | `npm run admin` |
| React: estudiante | http://localhost:5173 | `npm run estudiante` |
| Vue: kiosko | http://localhost:5174 | `npm run kiosko` |
| Next.js: portal público | http://localhost:3001 | `npm run publico` |

**Cuenta React de demostración:** `u20260001@utp.edu.pe` / `est123`.
La administración Angular abre directamente en esta etapa.

La API debe estar encendida también al consultar Next.js. Las URL se configuran con los archivos `.env.example` de React, Vue y Next; Angular usa `src/app/config/api.config.ts`.

## Organización

```text
CampusHub/
├── core-js/           # Validadores, clases, estadísticas y grilla compartida
├── api-mock/          # JSON Server 0.17.4, datos y colección Postman
├── angular-admin/     # CRUD de laboratorios y aprobación/rechazo
├── react-estudiante/  # Catálogo, login y reservas del estudiante
├── vue-kiosko/        # Disponibilidad diaria
├── next-publico/      # Catálogo y consulta pública con SSR
├── scripts/          # Arranque, sincronización y revisión de componentes
├── package.json
├── package-lock.json
└── README.md
```

Las reglas originales se editan en `core-js`; los scripts sincronizan las copias usadas por Angular y React. Vue y Next importan directamente el núcleo.

Se conservan `core-js/core.test.js` y la colección Postman porque la guía los pide en el repositorio. Los documentos auxiliares y las pruebas adicionales se trasladaron a la carpeta local hermana `Apoyo_CampusHub`, fuera de GitHub. No se necesitan para instalar o ejecutar el proyecto.

## Avances 1 y 2

- Núcleo JS: expresiones regulares, clases Usuario/Laboratorio/Reserva, detección de cruces, estadísticas con reduce/Map/Set y códigos con closure.
- Angular: CRUD del catálogo, filtros, formularios reactivos, pipe de estados y directiva de mantenimiento.
- React: rutas, componentes con props, formulario controlado, Context de sesión/tema, foco con useRef y contador con limpieza del intervalo.
- Datos iniciales: 2 administradores, 6 estudiantes, 8 laboratorios y 20 reservas con los tres estados.

## Avance 3: React conectado con Angular

| Requisito | Ubicación y comportamiento |
|---|---|
| Catálogo y detalle con Fetch | `services/api.js` y `hooks/useConsulta.js`: async/await, response.ok y cancelación de consultas antiguas |
| Crear y cancelar con Axios | Instancia con baseURL, timeout e interceptor en `services/api.js`; POST y DELETE desde `useReservas.js` |
| Resumen con Alova | `ResumenEstudiante.jsx` usa useRequest; caché de 30 s por estudiante y botón que fuerza actualización |
| Custom hook | `useReservas(usuarioId)` devuelve datos, cargando, error, crear y cancelar; también actualizar y revision |
| Login | GET /usuarios?correo=, comparación de contraseña simulada, perfil sin contraseña en AuthContext y localStorage |
| Estados de pantalla | Carga, error con reintento y lista vacía en las consultas |
| Integración | Angular hace PATCH /reservas/:id; React consulta cada 15 s o al pulsar Actualizar reservas |

Antes de crear se vuelven a consultar laboratorios y reservas de **todos** los usuarios para impedir cruces y reservas en mantenimiento. Se valida una fecha futura y se reutiliza la clase Reserva. El formulario espera la respuesta antes de limpiarse.

| Cliente HTTP | Uso concreto | Qué resolvimos en este proyecto |
|---|---|---|
| Fetch | Catálogo, detalle y lecturas | Viene en el navegador; comprobamos response.ok y convertimos JSON explícitamente |
| Axios | POST y DELETE de reservas | Instancia común e interceptor: los formularios reciben mensajes comprensibles de los errores HTTP |
| Alova | Resumen del estudiante | useRequest administra carga/error/datos y reutiliza respuestas por 30 s; Actualizar resumen omite esa caché |

## Avance 4: Vue y Next.js

**Vue:** `GrillaDisponibilidad` recibe un arreglo de arreglos y pasa cada celda a `CeldaHorario`. El evento `seleccionar` sube al padre para mostrar el detalle. Usa v-for, v-if, :class, v-model y @click. onMounted carga los datos; un intervalo consulta cada 30 s y onUnmounted lo limpia.

La función `core-js/disponibilidad.js → crearGrilla` cruza laboratorios con 15 bloques horarios entre 07:00 y 22:00 (último bloque 21:00–22:00). Una reserva parcial ocupa cada bloque con el que se cruza; rechazada no bloquea, aprobada tiene prioridad sobre pendiente. Mantenimiento se muestra ocupado con su motivo. La fecha corresponde a Perú y se recalcula en cada actualización.

**Next.js (App Router):**

- `/laboratorios`: catálogo generado en el servidor.
- `/laboratorios/[id]`: detalle y reservas aprobadas de lunes a domingo de la semana actual en Perú.
- `/reserva/[codigo]`: estado público, por ejemplo `/reserva/RES-0001`; no revela datos personales del estudiante.
- Rutas inexistentes y códigos desconocidos: página de no encontrado.
- Título y descripción por página, pantalla de carga y recuperación ante errores.
- `lib/api.js` usa `fetch(url, { cache: 'no-store' })`: cada visita consulta datos actuales desde el servidor.

Para comprobar SSR, abrir **Ver código fuente** de `http://localhost:3001/laboratorios/1` y buscar `Lab A-301`. El nombre, capacidad y horarios aprobados ya están en el HTML recibido.

| Framework | Curva de aprendizaje observada en el código | Estado | Enrutamiento | Renderizado |
|---|---|---|---|---|
| Angular | Más conceptos: TypeScript, servicios y formularios reactivos | Propiedades del componente y observables de HttpClient | app.routes.ts | Cliente |
| React | JSX es directo; hay que cuidar dependencias y limpieza de hooks | useState, Context y custom hooks | React Router | Cliente |
| Vue | Plantilla declarativa; props bajan y emit comunica selección | ref y computed; v-model enlaza el filtro | Una sola pantalla de kiosko | Cliente |
| Next.js | Reutiliza React, pero distingue servidor y navegador | Datos de consulta en servidor; formulario con useState | Carpetas app y parámetros [id]/[codigo] | SSR para consultas; cliente solo donde hay interacción |

## Recorrido integrado

1. Iniciar sesión en React y crear una reserva futura en un laboratorio disponible.
2. En Angular, abrir Reservas, pulsar Actualizar reservas y aprobar la solicitud.
3. En React, pulsar Actualizar reservas o esperar 15 s; al detectar cambios, también se invalida la caché del resumen. Su botón permite forzar una consulta independiente.
4. En Vue, si la reserva es para **hoy**, actualizar y observar su bloque ocupado; las fechas futuras no aparecen en el kiosko diario.
5. En Next, buscar su código. Si corresponde a la semana actual, también aparece en el detalle del laboratorio.
6. Cancelar en React una reserva propia activa futura y comprobar que desaparece del API.

Las reservas iniciales conservan las fechas originales. Si no hay reservas de hoy o de esta semana, las vistas muestran el estado vacío correspondiente; crear una solicitud con una fecha adecuada permite demostrar el flujo.

## Comprobaciones y entrega

```bash
npm test
npm run revisar:componentes
npm run build
# Ejecuta los tres pasos anteriores:
npm run verificar
```

Las 30 pruebas originales del núcleo comprueban validaciones, clases, cruces y datos mínimos. El script de componentes comprueba el máximo de 120 líneas por archivo JSX de React. La compilación incluye Angular, React, Vue y Next.

Importar `api-mock/CampusHub_Avance1.postman_collection.json` en Postman para las comprobaciones HTTP originales. `npm run restaurar-datos` reemplaza los datos actuales por la semilla: usarlo solo si se desea descartar las reservas creadas.

La entrega utiliza las etiquetas `avance-3` y `avance-4`. Los avances anteriores se conservan en `avance-1` y `avance-2`.

## Alcance y uso de IA

JSON Server es un backend académico sin autenticación ni validación de negocio en el servidor. La comprobación previa del cliente no evita solicitudes simultáneas desde dos navegadores. La validación central, los permisos y JWT corresponden al avance 5. No usar datos o contraseñas personales.

Se utilizó ChatGPT/Codex para apoyar la implementación, los comentarios, la revisión y las pruebas. Cada integrante debe revisar, comprender y explicar el código; esta asistencia no sustituye sus contribuciones reales ni la sustentación individual.

Referencias oficiales: [Fetch](https://developer.mozilla.org/es/docs/Web/API/Fetch_API), [Axios](https://axios-http.com/docs/interceptors), [Alova](https://alova.js.org/tutorial/client/strategy/use-request/), [Vue](https://vuejs.org/guide/essentials/lifecycle.html), [Next.js](https://nextjs.org/docs/app/getting-started/fetching-data).
