# Actualizar el repositorio y entregar avance-2

El ZIP es el proyecto completo actualizado, no una carpeta que debas anidar dentro de tu repositorio. Mantén el historial del repositorio que utilizaste en S13.

## 1. Integrar el contenido

1. Abre tu copia local de CampusHub y revisa `git status`. Conserva cualquier trabajo tuyo que todavía no esté guardado.
2. Extrae el nuevo ZIP en una carpeta aparte. Copia el contenido de `CampusHub_S13` sobre la raíz de tu repositorio existente, manteniendo su carpeta `.git` y sus archivos adicionales. Revisa los cambios antes de aceptar reemplazos si hiciste cambios posteriores al ZIP que enviaste.
3. No ejecutes `git init`, no reemplaces `.git` y no copies `node_modules`. El paquete contiene las evidencias que recibimos del Avance 1.
4. Ejecuta los comandos siguientes en la raíz del repositorio:

```powershell
npm.cmd ci
npm.cmd run verificar
npm.cmd run estudiante
```

Comprueba la aplicación y completa los nombres/códigos de los otros integrantes y la confirmación del dominio en el README. La URL registrada es https://github.com/luisbrandondev/CampusHub.git; puedes contrastarla con `git remote -v`.

La revisión simplificada retira `react-estudiante/src/context/ReservasContext.jsx`, `react-estudiante/src/hooks/useCuentaRegresiva.js` y tres guías S14 anteriores. Al copiar encima, esos archivos no desaparecen solos: consulta la lista de `RESUMEN_CAMBIOS_S14.md` y retira las copias antiguas que correspondan al ZIP recibido, después de guardar cualquier cambio personal. No borres el núcleo ni las evidencias de S13.

## 2. Registrar aportes y publicar

Cada integrante realiza sus cambios reales con su identidad habitual. No compartan una sola identidad para simular colaboración. Revisa lo que se incluirá antes de confirmar:

```bash
git status
git diff
```

Después de revisar, preparar los archivos concretos que correspondan y crear el commit:

```bash
git add README.md GUIA_SUSTENTACION_S14.md INSTRUCCIONES_WINDOWS11.md CUMPLIMIENTO_RUBRICA_S14.md RESUMEN_CAMBIOS_S14.md PREGUNTAS_PRACTICA_S14.md scripts react-estudiante docs core-js angular-admin pruebas
git commit -m "Simplificar y comentar el portal React de avance 2"
git push
```

`git push` usa la rama y remoto configurados en tu repositorio. Si trabajas en una rama de colaboración, integra el cambio mediante el flujo habitual de tu grupo antes de etiquetar la versión final. No es necesario borrar o mover la etiqueta `avance-1`.

## 3. Etiquetar la versión que será evaluada

Primero revisa si la etiqueta ya existe:

```bash
git tag --list avance-2
```

Si no existe y estás en el commit final que quieres entregar:

```bash
git tag -a avance-2 -m "Entrega Semana 14: portal React del estudiante"
git push origin avance-2
```

Si ya existe, revisa qué commit identifica antes de cambiar nada; estos pasos no sobrescriben etiquetas existentes.

En GitHub, comprueba que la etiqueta contiene `react-estudiante`, el README vigente y `package-lock.json`. Registra el enlace solicitado en el aula virtual antes de la sustentación y confirma que el docente puede acceder al repositorio.

## Estado de este paquete

El código y los documentos se generaron y verificaron localmente. No se publicaron commits, no se creó la etiqueta remota y no se envió una entrega al aula virtual. Esas acciones se realizan sobre el repositorio real del grupo después de su revisión.
