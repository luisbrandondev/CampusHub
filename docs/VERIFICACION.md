# Registro de verificación del paquete

Se verificó esta implementación en Linux con Node.js 24.22.1 y npm 11.9.0. No se ejecutó en la laptop del estudiante ni en la PC Windows del laboratorio.

| Control ejecutado | Resultado |
| --- | --- |
| `npm test` | 30 pruebas de core-js aprobadas, 0 fallos |
| `npm run test:api` | 15 comprobaciones HTTP aprobadas; Node informa 16 tests al incluir el contenedor |
| Colección Postman ejecutada con Newman | 13 peticiones, 18 aserciones, 0 fallos |
| `npm run build` | Compilación Angular de producción completada |
| Navegador Chromium automatizado | 16 comprobaciones completadas, sin excepciones JavaScript no controladas |
| Datos después de las pruebas | Restablecidos al contenido inicial: 8 usuarios, 8 laboratorios y 20 reservas |
| Guía PDF | 8 páginas renderizadas y revisadas visualmente |

## Comprobaciones de navegador

1. Catálogo inicial de 8 laboratorios.
2. Búsqueda de Arduino mediante q.
3. Filtro por sede con dos resultados para Lima Centro.
4. Formulario bloquea campos vacíos, nombre inválido y capacidad 61.
5. Creación por POST y detalle del registro guardado.
6. Edición por PUT, cambio a mantenimiento y actualización sin recargar la página.
7. Eliminación por DELETE de un laboratorio temporal.
8. Bloqueo en el panel al intentar eliminar un laboratorio que tiene reservas.
9. Listado de 20 reservas con pipe de estados.
10. Filtro HTTP por estudiante, filtro local de estado y mensaje de lista vacía.
11. Página de ruta desconocida.
12. Mensaje al consultar un laboratorio inexistente (HTTP 404).
13. Mensaje comprensible al simular una falla de red de la API.
14. Recuperación del catálogo mediante Reintentar.
15. Vista móvil de 390 px sin desborde horizontal de toda la página; tablas con scroll interno.
16. Ausencia de errores JavaScript no controlados durante el recorrido.

Las imágenes de revisión son auxiliares de comprobación; no forman parte de los entregables exigidos. Para repetir las verificaciones locales usar `npm run verificar` y el recorrido de `docs/SUSTENTACION.md`. La colección de Postman puede ejecutarse sin instalar Newman.

## Pendientes externos

Este registro no acredita publicación en GitHub, etiqueta remota, acceso del docente, registro en aula virtual, aprobación del dominio, aportes individuales ni sustentación. Esos pasos se completan con el grupo y sus cuentas reales.
