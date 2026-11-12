# CampusHub Labs — Avances 1 y 2 | Semanas 13 y 14
**Curso:** JavaScript Avanzado (100000SI56)

**Proyecto integral:** CampusHub — Gestión de laboratorios y reservas

**Etapa:** Avances 1 (Semana 13) y 2 (Semana 14)

**Puntaje acumulado de los dos avances:** 2.00 puntos (1.00 punto por avance)

## 1. Descripción del proyecto
**CampusHub Labs** es una aplicación académica para consultar y administrar laboratorios universitarios y visualizar las solicitudes de reserva. El Avance 1 integra:

- Un **núcleo de JavaScript** reutilizable con validaciones, clases, estadísticas y pruebas automatizadas.
- Una **API REST simulada** mediante `json-server`, con datos de demostración y una colección de Postman.
- Un **panel administrativo en Angular y TypeScript**, con Bootstrap, rutas, formularios reactivos y operaciones CRUD sobre laboratorios.

El Avance 2 agrega el **portal del estudiante en React**, con componentes, rutas, Hooks y formulario de reservas con datos locales. La integración de React con la API corresponde al Avance 3.

## 2. Integrantes y datos de entrega
| Campo | Información |
|---|---|
| Curso | JavaScript Avanzado (100000SI56) |
| Grupo | 3 integrantes |
| Integrante 1 | Luis Brandon Laurente Macha — U18311719 |
| GitHub del integrante 1 | [luisbrandondev](https://github.com/luisbrandondev) |
| Integrante 2 | Loa Rojas, Jahn Pahol |
| Integrante 3 | Ramirez Garcia, Nayely Merarí |
| Dominio propuesto | CampusHub Labs: laboratorios y reservas |
| Aprobación del docente | Pendiente de confirmar |
| Repositorio GitHub | [CampusHub](https://github.com/luisbrandondev/CampusHub) |
| Etiquetas | `avance-1` — publicada; `avance-2` — pendiente de publicar |

**Colaboración:** cada integrante debe revisar, probar y comprender el código, realizar contribuciones reales y registrarlas con su propia identidad en Git. No se atribuyen commits o tareas individuales que todavía no se hayan realizado.

## 3. Tecnologías
| Tecnología | Uso |
| --- | --- |
| JavaScript (ES Modules) | Validadores, modelos, reglas de reserva y estadísticas |
| Node.js | Ejecución de scripts y pruebas (`node:test`) |
| json-server `0.17.4` | API REST y persistencia de datos de prueba en JSON |
| Angular `20.3.35` | Interfaz de administración |
| Angular CLI/build `20.3.42` | Desarrollo y compilación |
| React y React Router | Portal del estudiante y navegación |
| Vite | Servidor y compilación del frontend React |
| TypeScript `5.9.3` | Tipado de los datos y componentes |
| Bootstrap `5.3.8` | Diseño responsivo y componentes visuales |
| Postman | Colección de pruebas HTTP |
| Git / GitHub | Historial de cambios y entrega colaborativa |

Las versiones se conservan en `package-lock.json`. Requiere **Node.js 22.12+ (rama 22) o Node.js 24.x** y npm. **No es necesario instalar Angular CLI globalmente.**

## 4. Estructura principal
```text
CampusHub_S13/
├── angular-admin/
│   ├── angular.json
│   └── src/
│       ├── index.html
│       ├── styles.css
│       └── app/
│           ├── app.routes.ts
│           ├── modelos.ts
│           ├── components/
│           │   ├── laboratorio-lista/
│           │   ├── laboratorio-detalle/
│           │   ├── laboratorio-formulario/
│           │   ├── reserva-lista/
│           │   └── navbar/
│           ├── services/campus.service.ts
│           ├── config/api.config.ts
│           └── shared/
│               ├── estado-reserva.pipe.ts
│               ├── nombre-laboratorio.validator.ts
│               └── resaltar-mantenimiento.directive.ts
├── api-mock/
│   ├── db.json
│   ├── db.inicial.json
│   └── CampusHub_Avance1.postman_collection.json
├── core-js/
│   ├── validadores.js
│   ├── modelos.js
│   ├── estadisticas.js
│   └── core.test.js
├── react-estudiante/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/context/
│   ├── src/utils/
│   └── package.json
├── pruebas/api.test.mjs
├── scripts/
├── docs/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

**Importante:** edita los módulos originales en `core-js/`. Las copias dentro de Angular y React son sincronizadas mediante scripts para reutilizar las reglas.

## 5. Instalación y ejecución
### Requisitos
- Windows, macOS o Linux con Node.js compatible, npm y Git.
- Acceso a Internet para instalar las dependencias por primera vez.
- VS Code u otro editor de código.

### Inicio rápido
Abrir **la carpeta raíz del repositorio** (la que contiene el `package.json` principal) y ejecutar:

```bash
node --version
npm --version
npm ci
npm start
```

`npm start` inicia la API simulada, Angular y React en conjunto. Abrir estas direcciones:

| Servicio | Dirección |
| --- | --- |
| Portal React (estudiante) | http://localhost:5173 |
| Panel Angular (administrador) | http://localhost:4200 |
| API REST | http://localhost:3000 |
| Catálogo de laboratorios | http://localhost:4200/laboratorios |
| Reservas | http://localhost:4200/reservas |

Para detener los servidores, usar **Ctrl + C** en la terminal donde se ejecuta `npm start`.

### Inicio por separado (alternativo)
Si deseas controlar los servicios por separado, abre **tres terminales** desde la raíz:

```bash
# Terminal 1: API simulada
npm run api
```

```bash
# Terminal 2: aplicación Angular
npm run admin
```

```bash
# Terminal 3: portal React
npm run estudiante
```

**No ejecutes `npm start` y estos comandos simultáneamente**, porque utilizarían los mismos puertos.

### Scripts disponibles
| Comando | Función |
| --- | --- |
| `npm start` | Inicia API, Angular y React |
| `npm run api` | Inicia solamente JSON Server |
| `npm run admin` | Inicia solamente Angular |
| `npm run estudiante` | Sincroniza los datos e inicia React |
| `npm run sync-react` | Sincroniza las reglas y datos del portal React |
| `npm run test:react` | Ejecuta las pruebas del portal React |
| `npm run revisar:componentes` | Revisa el límite de líneas de componentes JSX |
| `npm run sync-core` | Sincroniza el núcleo JavaScript con Angular |
| `npm test` | Ejecuta las pruebas del núcleo JavaScript |
| `npm run test:api` | Ejecuta las pruebas automatizadas de la API |
| `npm run build` | Compila Angular para producción |
| `npm run verificar` | Ejecuta la verificación configurada para el proyecto integrado |
| `npm run restaurar-datos` | Restaura voluntariamente los datos iniciales de la API |

**Atención:** `npm run restaurar-datos` reemplaza los datos de trabajo de `api-mock/db.json` con la copia inicial. Usarlo solo cuando se desee descartar modificaciones de prueba.

## 6. Funcionalidades del Avance 1
### Núcleo JavaScript
- **Validaciones:** correo institucional `@utp.edu.pe`, código de estudiante `U` + ocho dígitos, formato de horas y fechas reales, nombres y capacidad de laboratorios.
- **Clases:** `Usuario`, `Laboratorio` y `Reserva`, con constructores, getters y métodos.
- **Reservas:** cálculo de horas y detección de cruces entre reservas activas del mismo laboratorio y fecha. Dos intervalos contiguos no se consideran superpuestos; una reserva rechazada no bloquea horario.
- **Estadísticas:** `reduce` para estados, `Map` para horas aprobadas, `Set` para sedes únicas, ranking mediante `sort` y spread, y generador de códigos con closure y `padStart`.

### Panel Angular
- Listar laboratorios, filtrar por sede y buscar por nombre o equipamiento.
- Consultar el detalle de un laboratorio y las reservas asociadas.
- Crear, editar y eliminar laboratorios de prueba.
- Formulario reactivo con campos obligatorios, validación de capacidad entera entre 1 y 60 y validador personalizado para el nombre.
- Consultar reservas y filtrarlas por estudiante, laboratorio y estado.
- Rutas Angular; `@if`, `@for`, `ngClass`; pipe `estadoReserva`; directiva `appResaltarMantenimiento`; estilos Bootstrap.

### Datos de demostración
| Entidad | Cantidad inicial |
| --- | ---: |
| Administradores | 2 |
| Estudiantes | 6 |
| Laboratorios | 8 |
| Puestos de laboratorio (capacidad total) | 213 |
| Reservas pendientes | 7 |
| Reservas aprobadas | 7 |
| Reservas rechazadas | 6 |
| **Total de reservas** | **20** |

Los usuarios y credenciales del JSON son **ficticios**. El panel del Avance 1 abre directamente: **todavía no implementa inicio de sesión ni autorización real**. No reutilizar las contraseñas de demostración en sistemas o cuentas personales.

## 7. API REST simulada
**URL base:** `http://localhost:3000`

| Método | Endpoint | Uso |
| --- | --- | --- |
| GET | `/laboratorios` | Listado de laboratorios |
| GET | `/laboratorios?sede=Lima%20Centro&q=PC` | Filtrar por sede y buscar |
| GET | `/laboratorios/:id` | Detalle de laboratorio |
| POST | `/laboratorios` | Crear laboratorio |
| PUT | `/laboratorios/:id` | Actualizar laboratorio |
| DELETE | `/laboratorios/:id` | Eliminar laboratorio |
| GET | `/reservas` | Listar reservas |
| GET | `/reservas?usuarioId=3` | Consultar reservas por usuario |
| GET | `/reservas?laboratorioId=1` | Consultar reservas por laboratorio |
| GET | `/usuarios` | Listar usuarios de demostración |

Además, la colección de Postman utiliza `POST /reservas`, `DELETE /reservas/:id` y **PATCH sobre un laboratorio temporal** para comprobar los cinco métodos HTTP. **PATCH no implementa la aprobación o rechazo de reservas desde el panel Angular en esta semana.**

El contrato completo se encuentra en [`docs/CONTRATO_API.md`](docs/CONTRATO_API.md).

## 8. Pruebas y resultados comprobados
Resultados obtenidos durante las pruebas locales del proyecto en Windows 11, el **5 de noviembre de 2026**:

| Comprobación | Resultado observado |
| --- | --- |
| CRUD manual en Angular | Crear, consultar, actualizar y eliminar: **4/4** |
| Validación de capacidad | Se rechazan `0`, `-5`, `61` y `2.5`; se aceptan `1` y `60` |
| Validación de nombre | Vacío, demasiado corto y caracteres no permitidos rechazados; nombre válido aceptado |
| `npm test` | **30 pruebas aprobadas, 0 fallidas** |
| `npm run test:api` | **16 pruebas aprobadas, 0 fallidas** (15 comprobaciones y una prueba contenedora) |
| `npm run build` | **Compilación Angular exitosa** |
| Colección Postman | **13 solicitudes, 18 verificaciones aprobadas, 0 fallidas** |
| Revisión posterior a Postman | Se conservaron **8 laboratorios** y **20 reservas** iniciales |

Estos resultados reflejan ejecuciones observadas; no equivalen a una auditoría de seguridad ni sustituyen la evaluación del profesor. Se pueden repetir con:

```bash
npm run verificar
```

Para repetir los tests del núcleo directamente:

```bash
cd core-js
node --test
```

### Colección de Postman
1\. Mantener la API activa en `http://localhost:3000`.

2\. En Postman, seleccionar **Import** e importar `api-mock/CampusHub_Avance1.postman_collection.json`.

3\. Abrir **Run**; seleccionar ejecución **Functional** y **Local**.

4\. Mantener las **13 solicitudes en su orden original**, con **1 iteración**, e iniciar la ejecución.

5\. Verificar **18 pruebas aprobadas y 0 fallidas**. Las comprobaciones finales de **404** son esperadas después de eliminar los registros temporales.

6\. Comprobar que el catálogo inicial conserva los ocho laboratorios y las veinte reservas.

## 9. Demostración sugerida para la sustentación del Avance 1
1\. Ejecutar `npm test` y mostrar el resumen de pruebas.

2\. Abrir `/laboratorios`, buscar `Arduino` y aplicar un filtro por sede.

3\. Crear un laboratorio temporal llamado `Lab Demo S13`, sede Lima Centro, 20 puestos y equipos `PC i7, Proyector`.

4\. Consultar su detalle; editar la capacidad a 25 y cambiar su estado a mantenimiento.

5\. Mostrar la directiva que resalta el estado y eliminar **solo el laboratorio temporal**.

6\. Abrir `/reservas`, mostrar los contadores, los filtros y el pipe personalizado.

7\. Enseñar el servicio `campus.service.ts`, las rutas, `angular.json` y los resultados de Postman.

Material de apoyo: [`docs/SUSTENTACION.md`](docs/SUSTENTACION.md) y [`docs/RUBRICA_S13.md`](docs/RUBRICA_S13.md). Cada integrante debe poder explicar cualquier módulo y resolver preguntas individuales.

## 10. Alcance y limitaciones
- JSON Server es una API de demostración: **no verifica contraseñas, roles ni permisos**.
- Las validaciones del núcleo o del formulario **no se aplican automáticamente a peticiones HTTP directas** realizadas contra JSON Server.
- El panel impide eliminar laboratorios con reservas mediante una comprobación del cliente; **no es una transacción segura del servidor**.
- El generador de códigos utiliza un contador en memoria; no garantiza unicidad entre varios servidores o clientes.
- La ocupación representa **horas de reservas aprobadas**, no un porcentaje de disponibilidad.
- La autenticación JWT y el backend definitivo en Express corresponden al Avance 5. El portal React del Avance 2 trabaja con datos locales; su conexión con la API corresponde al Avance 3.

## 11. GitHub y entrega grupal

**Repositorio:** [luisbrandondev/CampusHub](https://github.com/luisbrandondev/CampusHub)
**Rama:** `main`
**Etiqueta publicada:** `avance-1`
**Etiqueta en preparación:** `avance-2` (crear únicamente cuando la integración y la revisión final estén completas).

Para comprobar los cambios antes de publicarlos:

```bash
git status
git diff --cached --check
git diff --cached --stat
```

Cada integrante debe realizar aportes reales y commits desde su propia cuenta. Antes de la entrega del Avance 2, comprobar el funcionamiento local, actualizar la rama `main`, crear la etiqueta `avance-2` en el commit correcto y compartir el enlace con el docente.

**Pendientes de gestión:** confirmar la aprobación del dominio si aún no se realizó, verificar los datos y aportes de los demás integrantes, y registrar la entrega en el aula virtual.

## 12. Declaración de uso de IA
Se utilizó **ChatGPT/Codex** como apoyo para generar una base inicial de código, datos ficticios, pruebas y documentación. El proyecto requiere revisión, comprensión y validación humana. Esta asistencia **no se presenta como evidencia de participación individual** ni reemplaza los commits reales de cada integrante. La declaración se incluye en atención a las indicaciones del proyecto integral.

## 13. Documentación y referencias
- [`docs/CONTRATO_API.md`](docs/CONTRATO_API.md): endpoints y estructuras de datos.
- [`docs/RUBRICA_S13.md`](docs/RUBRICA_S13.md): criterios de evaluación.
- [`docs/GITHUB_Y_ENTREGA.md`](docs/GITHUB_Y_ENTREGA.md): publicación y entrega grupal.
- [`docs/SUSTENTACION.md`](docs/SUSTENTACION.md): guion de exposición y cambios en vivo.
- [`docs/VERIFICACION.md`](docs/VERIFICACION.md): registro de comprobaciones del paquete original.
- [`docs/VERIFICACION_S14.md`](docs/VERIFICACION_S14.md): resultados de las comprobaciones del Avance 2.
- [`docs/ACTUALIZAR_GITHUB_AVANCE2.md`](docs/ACTUALIZAR_GITHUB_AVANCE2.md): guía de integración del Avance 2.
- [Documentación de Angular](https://angular.dev/overview).
- [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/).
- [json-server 0.17.4](https://github.com/typicode/json-server/tree/v0.17.4).

---

**Estado:** Avance 1 publicado en GitHub. Avance 2 integrado localmente y pendiente de commit, publicación y etiqueta. El resultado de `npm run verificar` fue exitoso en la ejecución mostrada del 12 de noviembre de 2026.

## 14. Avance 2 – Semana 14: portal React del estudiante

Se desarrolló el portal del estudiante con **React, Vite y Bootstrap**, reutilizando las reglas de `core-js` del Avance 1. En esta etapa las reservas se gestionan en el estado local del frontend: **no se guardan todavía en la API** y se restablecen al recargar.

### Requisitos y rúbrica (1.00 punto)

| Criterio | Implementación | Puntos |
|---|---|---:|
| Componentes y JSX | Cinco componentes mínimos con props, listas con `key` y renderizado condicional; componentes de hasta 120 líneas | 0.25 |
| Navegación | Siete rutas, parámetro con `useParams`, página 404 y rutas de reservas protegidas | 0.25 |
| Hooks | `useState`, `useEffect`, `useContext` y `useRef` con usos reales; limpieza del contador | 0.25 |
| Formulario y reutilización | Formulario controlado, errores por campo, validadores de `core-js` y bloqueo de horarios superpuestos | 0.25 |

### Componentes principales

`Navbar`, `TarjetaLaboratorio`, `ListaLaboratorios`, `FormularioReserva` y `BadgeEstado` se encuentran en `react-estudiante/src/components/`.

### Rutas del portal

| Ruta | Uso |
|---|---|
| `/` | Inicio |
| `/catalogo` | Laboratorios |
| `/catalogo/:id` | Detalle de un laboratorio |
| `/mis-reservas` | Reservas del estudiante (protegida) |
| `/nueva-reserva` | Crear reserva (protegida) |
| `/login` | Inicio de sesión simulado |
| `*` | Página no encontrada (404) |

### Uso de Hooks

- `useState`: filtros, estado del formulario y lista local de reservas.
- `useEffect`: título de la página y contador regresivo con limpieza del intervalo.
- `useContext`: sesión simulada (`AuthContext`) y tema visual (`ThemeContext`).
- `useRef`: enfoque del primer campo y acceso al formulario.

### Ejecución desde la raíz

```bash
npm ci
npm run estudiante
```

Abrir [http://localhost:5173](http://localhost:5173).

Para iniciar React, Angular y la API simulada juntos:

```bash
npm start
```

Para repetir las comprobaciones:

```bash
npm run verificar
```

### Alcance y siguientes avances

La autenticación de este avance es **simulada en el frontend** y las reservas se conservan solo mientras se utiliza la aplicación sin recargar. En el Avance 3 se conectará React con la API mediante Fetch, Axios y Alova; en el Avance 5 se reemplazará la API simulada por Express y se incorporará JWT.
