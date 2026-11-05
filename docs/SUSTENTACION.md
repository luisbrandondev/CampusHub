# Guía de sustentación · Semana 13

## Explicación corta para comenzar

«Nuestro proyecto se llama CampusHub Labs y permite administrar laboratorios del campus. En este primer avance usamos Angular y TypeScript para el panel, Bootstrap para el diseño y json-server para simular una API REST que guarda los datos en un archivo JSON. Separamos las validaciones, clases y estadísticas en un núcleo JavaScript reutilizable. El administrador puede listar, crear, editar y eliminar laboratorios sin recargar la página, además de consultar las reservas».

Practicar con el proyecto abierto. No memorizar términos sin localizar el código que los demuestra.

## Conceptos desde cero

| Término | Explicación sencilla | Dónde verlo |
| --- | --- | --- |
| Frontend | La pantalla y los controles que usa la persona | angular-admin |
| API REST | Una puerta para consultar y modificar datos mediante direcciones y métodos HTTP | CampusService |
| Backend simulado | Un programa que imita las respuestas de un servidor; todavía no aplica toda la seguridad | json-server |
| JSON | Texto estructurado con objetos y listas que permite intercambiar información | db.json |
| CRUD | Crear, leer, actualizar y eliminar | Catálogo y servicio |
| Componente | Una pieza de pantalla con su comportamiento | Lista, formulario y navbar |
| Interface | Una descripción de los campos esperados por TypeScript | modelos.ts |
| Servicio | Clase que concentra una responsabilidad reutilizable, aquí las llamadas HTTP | campus.service.ts |
| Observable | Representa valores que pueden llegar después; HttpClient devuelve uno | subscribe |
| Formulario reactivo | El estado y las reglas de los campos se definen en TypeScript | FormBuilder y formGroup |
| Regex | Un patrón que define qué textos se permiten | validadores.js |
| Clase | Un molde para crear objetos con datos y acciones | Reserva |
| Constructor | Función que inicializa un objeto creado con new | constructor(...) |
| Getter | Propiedad calculada al leerla | reserva.horario |
| Pipe | Cambia la presentación de un dato, no el original | estadoReserva |
| Directiva | Agrega comportamiento o apariencia a un elemento | appResaltarMantenimiento |
| Monorepo | Un solo repositorio que contiene varios módulos | Carpeta raíz |

## Recorrido de cinco minutos

| Tiempo | Acción | Qué explicar |
| --- | --- | --- |
| 0:00-0:40 | Mostrar core-js y `npm test` | Las reglas se prueban sin abrir Angular |
| 0:40-1:20 | Mostrar db.json y la API | Hay 8 usuarios, 8 laboratorios y 20 reservas |
| 1:20-2:00 | Listar, buscar Arduino y filtrar sede | El servicio envía GET con parámetros |
| 2:00-3:20 | Crear laboratorio, editarlo y eliminarlo | POST crea, PUT actualiza, DELETE elimina; la tabla se vuelve a consultar |
| 3:20-4:15 | Consultar reservas y cambiar filtros | reduce calcula contadores y el pipe muestra cada estado |
| 4:15-5:00 | Abrir formulario, pipe, directiva y Bootstrap | Señalar cada requisito en archivos reales |

Antes del CRUD, crear un laboratorio de prueba que no tenga reservas. No eliminar los registros históricos de la semilla. Probar capacidad 61 y nombre `@@@` para mostrar los errores del formulario; luego corregirlos.

## Si el profesor pregunta...

**1. ¿Qué devuelve reduce en reservasPorEstado?**

Un objeto con los tres contadores. Imagina tres cajas: pendiente, aprobada y rechazada. Cada reserva suma uno a su caja. El valor inicial es un objeto porque necesitamos varios contadores con nombre. Con una lista vacía, devuelve esos contadores en cero.

```js
reservasPorEstado([{ estado: 'pendiente' }, { estado: 'aprobada' }]);
// { pendiente: 1, aprobada: 1, rechazada: 0 }
```

**2. ¿En qué se diferencian Map y Set?**

Map guarda parejas clave-valor: laboratorio 1 tiene 4 horas aprobadas. Set guarda valores únicos: una misma sede aparece una sola vez. No son lo mismo que map(): map() es un método de arreglos que transforma cada elemento.

**3. ¿Qué es el closure de los códigos?**

Es una función que recuerda la variable de la función donde nació. `crearGeneradorCodigos()` devuelve otra función que recuerda `siguiente`. Cada llamada genera un código y aumenta ese contador. `padStart(4, '0')` rellena con ceros a la izquierda. Ese contador no se comparte automáticamente entre navegadores ni se conserva al reiniciar.

**4. ¿Cómo detectan cruces?**

Primero comprobamos que las reservas estén activas, sean del mismo laboratorio y del mismo día. Luego exigimos que el inicio de una ocurra antes del final de la otra, y viceversa. Los límites son estrictos: si una termina a las 10:00 y otra empieza a las 10:00, no se cruzan.

**5. ¿Por qué usan spread antes de sort?**

sort() ordena el arreglo que recibe y lo modifica. Con `[...laboratorios]` obtenemos una copia; así el ranking no cambia el orden del catálogo original. El spread copia el arreglo, no clona profundamente todos los objetos.

**6. ¿Dónde está TypeScript y dónde está JavaScript?**

Los archivos `.ts` de Angular contienen interfaces, componentes y servicios con tipos. `core-js` usa `.js` para reutilizar las mismas reglas. Angular permite esos imports con `allowJs: true` y el script de copia. Una interface de TypeScript no valida por sí sola el JSON recibido en ejecución.

**7. ¿Dónde está Bootstrap?**

Abrir `angular-admin/package.json`, buscar `bootstrap`. Luego abrir `angular-admin/angular.json`, buscar `bootstrap.min.css`. Finalmente señalar `row`, `col-md-*`, `form-control`, `btn` o `table` en una plantilla. El CSS propio cambia colores y espaciados sobre esa base.

**8. ¿Por qué no recargan la página después de guardar?**

HttpClient envía la petición sin navegar a otra página HTML. Cuando responde, Angular cambia la ruta y consulta la lista de nuevo. El navegador conserva la aplicación y solo cambia lo que muestra.

**9. ¿PUT y PATCH son iguales?**

PUT reemplaza los datos completos del registro: enviamos nombre, sede, capacidad, equipos y estado. PATCH cambia solo algunos campos. En este avance usamos PUT para editar el catálogo y un PATCH técnico en Postman. La aprobación de reservas se implementa en el avance 3.

**10. ¿El servidor impide ahora que manden datos inválidos?**

No. Esta semana el servidor es simulado. El formulario valida y core-js prueba las reglas, pero una petición directa puede saltar esas comprobaciones. Express validará en el servidor en la semana 17. Lo mismo aplica a roles, contraseñas y JWT.

## Cambio en vivo del ejemplo: añadir piso (1 a 10)

Esta es una práctica para estudiar, no un campo ya incorporado al alcance base.

1. En `modelos.ts`, agregar `piso: number` a la interface Laboratorio.
2. En el FormGroup, crear el control `piso` con required, min(1), max(10) y patrón de entero.
3. En el HTML del formulario, agregar un input numérico con `formControlName="piso"` y mensaje de error.
4. En `core-js/validadores.js`, validar piso entero de 1 a 10. En la clase Laboratorio, recibir y asignar ese campo.
5. Añadir piso a los 8 laboratorios de `db.json` y `db.inicial.json`, y actualizar las muestras de pruebas y colección que crean laboratorios.
6. Mostrar piso en lista o detalle; actualizar el contrato documentado.
7. Ejecutar `npm run sync-core`, `npm run verificar` y comprobar que 0 y 11 fallen, pero 1 y 10 se guarden.

Todos deben practicar la modificación. No afirmar que alguien realizó una parte que no revisó ni comprendió.
