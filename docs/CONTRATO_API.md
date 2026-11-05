# Contrato de CampusHub Labs

Base: `http://localhost:3000`. Datos JSON. Identificadores numéricos en json-server 0.17.4. Un único contrato para las capas futuras.

## Entidades

| Entidad | Campos |
| --- | --- |
| Usuario | id:number, nombre:string, correo:string, codigo:string, rol:estudiante/admin, password:string |
| Laboratorio | id:number, nombre:string, sede:string, capacidad:number, equipos:string[], estado:disponible/mantenimiento |
| Reserva | id:number, codigo:string, laboratorioId:number, usuarioId:number, fecha:string, horaInicio:string, horaFin:string, motivo:string, estado:pendiente/aprobada/rechazada, creadoEn:string |

Correo: `@utp.edu.pe`. Código de alumno: U y 8 dígitos. Los administradores de los ejemplos usan A y 8 dígitos. Capacidad entera: 1 a 60. Fecha: AAAA-MM-DD real; hora: HH:mm con dos dígitos. El final debe ser posterior al inicio. No se aceptan cruces de reservas activas del mismo laboratorio y día en el núcleo de negocio.

## Endpoints por avance

| Método | Ruta | Avance | Semántica |
| --- | --- | --- | --- |
| GET | /laboratorios | 1 | Lista; filtros opcionales sede y q |
| GET | /laboratorios/:id | 1 | Detalle o 404 |
| POST | /laboratorios | 1 | Crea, responde 201 con id |
| PUT | /laboratorios/:id | 1 | Reemplaza todos los datos del registro, responde 200 |
| DELETE | /laboratorios/:id | 1 | Elimina, responde 200 en el mock |
| GET | /reservas?usuarioId= | 1 | Lista filtrada por usuario |
| POST | /reservas | 1 | Crea una reserva, responde 201 |
| DELETE | /reservas/:id | 1 | Cancela por eliminación física, responde 200 |
| GET | /usuarios/:id | 2 | Perfil |
| GET | /usuarios?correo= | 2-4 | Consulta para login simulado |
| PATCH | /reservas/:id | 3 | Cambio de estado desde el panel |
| POST | /auth/login | 5 | Login real: token y usuario |
| GET | /estadisticas | 5 | Totales por estado y por laboratorio |

Consultas auxiliares del panel: `GET /usuarios`, `GET /reservas` y `GET /reservas?laboratorioId=`. json-server ya expone las rutas de sus colecciones, pero eso no significa que se hayan construido las interfaces de semanas futuras. `POST /auth/login` y `GET /estadisticas` no existen en este avance.

Se añade un PATCH de diagnóstico a un laboratorio temporal para demostrar los cinco verbos de la rúbrica. Ese diagnóstico no amplía el alcance de los frontends.

## Ejemplo de creación de laboratorio

```json
{
  "nombre": "Lab E-501",
  "sede": "Lima Centro",
  "capacidad": 20,
  "equipos": ["PC i7", "Proyector"],
  "estado": "disponible"
}
```

No enviar id al crear: lo asigna el mock. En PUT enviar todos los campos; los omitidos se perderían. PATCH modifica solo los enviados.

## Alcance de las validaciones

El mock no comprueba reglas de negocio ni autentica. Es posible crear datos inválidos enviando peticiones manuales. Angular valida el catálogo; core-js permite probar las demás reglas. La autoridad final de validación y los errores 400/401/403/409 se incorporan con Express en la semana 17. No se presenta esta API simulada como un backend seguro ni se despliega públicamente.

## Colección de Postman

1. Iniciar la API con `npm run api` o `npm start`.
2. Importar `api-mock/CampusHub_Avance1.postman_collection.json` en Postman.
3. Seleccionar la colección y ejecutar sus 13 solicitudes en orden, con el Collection Runner o manualmente.
4. La variable `baseUrl` ya tiene `http://localhost:3000`. Las peticiones POST guardan los IDs en variables de colección.
5. Los DELETE usan esos IDs temporales. Ejecutar también las últimas peticiones, que comprueban 404 tras eliminar.

Utilizar los datos de muestra para esta secuencia. Si se interrumpe antes de los DELETE, pueden quedar registros temporales; revisarlos antes de repetir. Para restaurar TODA la semilla, detener la API y ejecutar `npm run restaurar-datos -- --confirmar`; esto elimina los cambios locales de db.json.
