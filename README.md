# CampusHub Labs — Avance 1 | Semana 13

**Curso:** JavaScript Avanzado (100000SI56)
**Proyecto integral:** CampusHub — Gestión de laboratorios y reservas
**Etapa:** Avance 1 (Semana 13)
**Valor del avance en la rúbrica:** 1.00 punto (cuatro criterios de 0.25 puntos)

## 1. Descripción del proyecto

**CampusHub Labs** es una aplicación académica para consultar y administrar laboratorios universitarios y visualizar las solicitudes de reserva. Este primer avance integra:

- Un **núcleo de JavaScript** reutilizable con validaciones, clases, estadísticas y pruebas automatizadas.
- Una **API REST simulada** mediante `json-server`, con datos de demostración y una colección de Postman.
- Un **panel administrativo en Angular y TypeScript**, con Bootstrap, rutas, formularios reactivos y operaciones CRUD sobre laboratorios.

El proyecto se entrega como **avance funcional de la Semana 13**. No se declaran terminadas las funcionalidades de avances posteriores.

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
| Etiqueta de entrega | `avance-1` — Creada |

**Colaboración:** cada integrante debe revisar, probar y comprender el código, realizar contribuciones reales y registrarlas con su propia identidad en Git. No se atribuyen commits o tareas individuales que todavía no se hayan realizado.

## 3. Tecnologías

| Tecnología | Uso |
| --- | --- |
| JavaScript (ES Modules) | Validadores, modelos, reglas de reserva y estadísticas |
| Node.js | Ejecución de scripts y pruebas (`node:test`) |
| json-server `0.17.4` | API REST y persistencia de datos de prueba en JSON |
| Angular `20.3.35` | Interfaz de administración |
| Angular CLI/build `20.3.42` | Desarrollo y compilación |
| TypeScript `5.9.3` | Tipado de los datos y componentes |
| Bootstrap `5.3.8` | Diseño responsivo y componentes visuales |
| Postman | Colección de pruebas HTTP |
| Git / GitHub | Historial de cambios y entrega colaborativa |

Las versiones se conservan en `package-lock.json`. Requiere **Node.js 22.12+ (rama 22) o Node.js 24.x** y npm. **No es necesario instalar Angular CLI globalmente.**

## 4. Estructura principal

```text
CampusHub_S13/
├── angular-admin/
│   ├── angular.json
│   └── src/
│       ├── index.html
│       ├── styles.css
│       └── app/
│           ├── app.routes.ts
│           ├── modelos.ts
│           ├── components/
│           │   ├── laboratorio-lista/
│           │   ├── laboratorio-detalle/
│           │   ├── laboratorio-formulario/
│           │   ├── reserva-lista/
│           │   └── navbar/
│           ├── services/campus.service.ts
│           ├── config/api.config.ts
│           └── shared/
│               ├── estado-reserva.pipe.ts
│               ├── nombre-laboratorio.validator.ts
│               └── resaltar-mantenimiento.directive.ts
├── api-mock/
│   ├── db.json
│   ├── db.inicial.json
│   └── CampusHub_Avance1.postman_collection.json
├── core-js/
│   ├── validadores.js
│   ├── modelos.js
│   ├── estadisticas.js
│   └── core.test.js
├── pruebas/api.test.mjs
├── scripts/
├── docs/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

**Importante:** editar los módulos originales en `core-js/`. La carpeta `angular-admin/src/core/` es una copia generada por `npm run sync-core` y está excluida de Git.

## 5. Instalación y ejecución

### Requisitos

- Windows, macOS o Linux con Node.js compatible, npm y Git.
- Acceso a Internet para instalar las dependencias por primera vez.
- VS Code u otro editor de código.

### Inicio rápido

Abrir **la carpeta raíz** `CampusHub_S13`, donde se encuentra el `package.json` principal, y ejecutar:

```bash
node --version
npm --version
npm ci
npm start
```

`npm start` inicia la API y Angular en conjunto. Abrir las siguientes direcciones:

| Servicio | Dirección |
| --- | --- |
| Panel Angular | http://localhost:4200 |
| API REST | http://localhost:3000 |
| Catálogo de laboratorios | http://localhost:4200/laboratorios |
| Reservas | http://localhost:4200/reservas |

Para detener los servidores, usar **Ctrl + C** en la terminal donde se ejecuta `npm start`.

### Inicio por separado (alternativo)

Si se desea controlar los servidores por separado, abrir **dos terminales** desde la raíz:

```bash
# Terminal 1: API simulada
npm run api
```

```bash
# Terminal 2: aplicación Angular
npm run admin
```

**No ejecutar ambos procedimientos al mismo tiempo**, para evitar conflictos en los puertos 3000 y 4200.

### Scripts disponibles

| Comando | Función |
| --- | --- |
| `npm start` | Inicia API y Angular |
| `npm run api` | Inicia solamente JSON Server |
| `npm run admin` | Inicia solamente Angular |
| `npm run sync-core` | Sincroniza el núcleo JavaScript con Angular |
| `npm test` | Ejecuta las pruebas del núcleo JavaScript |
| `npm run test:api` | Ejecuta las pruebas automatizadas de la API |
| `npm run build` | Compila Angular para producción |
| `npm run verificar` | Ejecuta las pruebas de JS, API y la compilación |
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

1. Mantener la API activa en `http://localhost:3000`.
2. En Postman, seleccionar **Import** e importar `api-mock/CampusHub_Avance1.postman_collection.json`.
3. Abrir **Run**; seleccionar ejecución **Functional** y **Local**.
4. Mantener las **13 solicitudes en su orden original**, con **1 iteración**, e iniciar la ejecución.
5. Verificar **18 pruebas aprobadas y 0 fallidas**. Las comprobaciones finales de **404** son esperadas después de eliminar los registros temporales.
6. Comprobar que el catálogo inicial conserva los ocho laboratorios y las veinte reservas.

## 9. Demostración sugerida para la sustentación

1. Ejecutar `npm test` y mostrar el resumen de pruebas.
2. Abrir `/laboratorios`, buscar `Arduino` y aplicar un filtro por sede.
3. Crear un laboratorio temporal llamado `Lab Demo S13`, sede Lima Centro, 20 puestos y equipos `PC i7, Proyector`.
4. Consultar su detalle; editar la capacidad a 25 y cambiar su estado a mantenimiento.
5. Mostrar la directiva que resalta el estado y eliminar **solo el laboratorio temporal**.
6. Abrir `/reservas`, mostrar los contadores, los filtros y el pipe personalizado.
7. Enseñar el servicio `campus.service.ts`, las rutas, `angular.json` y los resultados de Postman.

Material de apoyo: [`docs/SUSTENTACION.md`](docs/SUSTENTACION.md) y [`docs/RUBRICA_S13.md`](docs/RUBRICA_S13.md). Cada integrante debe poder explicar cualquier módulo y resolver preguntas individuales.

## 10. Alcance y limitaciones

- JSON Server es una API de demostración: **no verifica contraseñas, roles ni permisos**.
- Las validaciones del núcleo o del formulario **no se aplican automáticamente a peticiones HTTP directas** realizadas contra JSON Server.
- El panel impide eliminar laboratorios con reservas mediante una comprobación del cliente; **no es una transacción segura del servidor**.
- El generador de códigos utiliza un contador en memoria; no garantiza unicidad entre varios servidores o clientes.
- La ocupación representa **horas de reservas aprobadas**, no un porcentaje de disponibilidad.
- El Avance 1 **no incluye** autenticación JWT, backend Express definitivo ni todas las funciones previstas en React, Vue o Next.js; corresponden a semanas posteriores del proyecto.

## 11. GitHub y entrega grupal

Git está inicializado localmente en la rama `main`. **Al redactar este README, todavía no se ha confirmado un commit ni un repositorio remoto publicado.**

Antes de publicar, revisar los archivos preparados y cualquier dato privado:

```bash
git status
git diff --cached --check
git diff --cached --name-only
```

Una vez revisados, quien realice el primer commit debe utilizar **su nombre y correo reales de Git**, sin atribuir trabajo a otros:

```bash
git config user.name "NOMBRE REAL"
git config user.email "CORREO DE GITHUB"
git commit -m "chore: inicializar CampusHub avance 1"
```

Después, crear el repositorio vacío del grupo en GitHub, agregar su URL real y publicar `main`. Cada integrante debe realizar y subir sus **propias contribuciones verificables**. Cuando el equipo termine la revisión y estén integrados los cambios, crear la etiqueta `avance-1` en el commit final:

```bash
npm run verificar
git status
git tag -a avance-1 -m "Avance 1 - Semana 13"
git push origin main
git push origin avance-1
```

**No ejecutar la etiqueta hasta que esté lista la versión final.** Guía completa: [`docs/GITHUB_Y_ENTREGA.md`](docs/GITHUB_Y_ENTREGA.md).

### Lista de pendientes para la entrega

- [ ] Confirmar que el docente aprobó el dominio CampusHub Labs.
- [ ] Completar nombres, códigos y usuarios de GitHub de los otros dos integrantes.
- [ ] Registrar los aportes individuales reales del grupo.
- [ ] Revisar privacidad del contenido antes de hacer público el repositorio.
- [ ] Crear el primer commit y publicar el repositorio del grupo.
- [ ] Integrar las contribuciones y ejecutar nuevamente `npm run verificar`.
- [ ] Crear y publicar la etiqueta `avance-1`.
- [ ] Añadir aquí la URL real del repositorio y verificar el acceso del docente.
- [ ] Registrar el enlace de entrega en el aula virtual y preparar la sustentación.

## 12. Declaración de uso de IA

Se utilizó **ChatGPT/Codex** como apoyo para generar una base inicial de código, datos ficticios, pruebas y documentación. El proyecto requiere revisión, comprensión y validación humana. Esta asistencia **no se presenta como evidencia de participación individual** ni reemplaza los commits reales de cada integrante. La declaración se incluye en atención a las indicaciones del proyecto integral.

## 13. Documentación y referencias

- [`docs/CONTRATO_API.md`](docs/CONTRATO_API.md): endpoints y estructuras de datos.
- [`docs/RUBRICA_S13.md`](docs/RUBRICA_S13.md): criterios de evaluación.
- [`docs/GITHUB_Y_ENTREGA.md`](docs/GITHUB_Y_ENTREGA.md): publicación y entrega grupal.
- [`docs/SUSTENTACION.md`](docs/SUSTENTACION.md): guion de exposición y cambios en vivo.
- [`docs/VERIFICACION.md`](docs/VERIFICACION.md): registro de comprobaciones del paquete original.
- [Documentación de Angular](https://angular.dev/overview).
- [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/).
- [json-server 0.17.4](https://github.com/typicode/json-server/tree/v0.17.4).

---

**Estado:** Avance 1 técnicamente probado en el entorno local; publicación, aportes del grupo y entrega académica aún pendientes.
