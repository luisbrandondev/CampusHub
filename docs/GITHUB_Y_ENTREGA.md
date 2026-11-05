# GitHub y entrega del Avance 1

El ZIP contiene el proyecto. El PDF exige adicionalmente un repositorio del grupo, una etiqueta y el enlace registrado en el aula virtual. Estos pasos se realizan con la cuenta real del grupo; no están publicados automáticamente.

## Antes de publicar

1. Confirmar que CampusHub Labs sea el dominio aprobado por el docente.
2. Completar nombres, códigos y usuarios GitHub de los 3 o 4 integrantes en el README.
3. Probar `npm ci`, `npm run verificar` y `npm start` en una PC del grupo.
4. Si ya existe un repositorio para CampusHub, trabajar en su copia y conservar su historial. No inicializar otro ni sobrescribir código previo sin comparar.

## Si todavía no existe repositorio

En GitHub, crear un repositorio vacío para este proyecto, sin README inicial. Puede ser público; si es privado, invitar al profesor como colaborador. Copiar su URL HTTPS real.

En la terminal de VS Code, dentro de CampusHub_S13:

```bash
git init -b main
git config user.name "TU NOMBRE REAL"
git config user.email "TU CORREO ASOCIADO A GITHUB"
git add .
git commit -m "feat: preparar avance 1 de CampusHub Labs"
git remote add origin URL_HTTPS_REAL_DEL_REPOSITORIO
git push -u origin main
```

Los textos en mayúsculas son valores que debes reemplazar, no comandos que funcionen literalmente. La configuración anterior es local a este repositorio. El commit debe representar una revisión real de quien lo realiza.

## Participación del grupo

Cada integrante clona el mismo repositorio, realiza cambios que comprende y los sube con su propia cuenta. No fabricar commits de otras personas. Ejemplos útiles: mejorar un mensaje, explicar una función, revisar un caso límite o ajustar un formulario y demostrar el cambio.

El PDF indica que un integrante sin commits en el avance tiene factor individual máximo 0.5. Aunque se repartan tareas, todos deben entender cualquier archivo.

## Etiqueta de entrega

Cuando las contribuciones ya estén integradas y la verificación pase:

```bash
git status
npm run verificar
git tag -a avance-1 -m "Avance 1 - Semana 13"
git push origin main
git push origin avance-1
```

No crear la etiqueta antes de integrar el trabajo final. Si ya existe, revisar qué commit señala; no borrarla ni moverla sin acordarlo con el grupo. El ZIP no contiene una etiqueta publicada ni un historial Git ficticio.

## Entrega en aula virtual

- Pegar el enlace real al repositorio del grupo.
- Verificar que el docente pueda acceder y que aparezca la etiqueta `avance-1`.
- Verificar que el README tenga integrantes, dominio, comandos y declaración de uso de IA.
- Entregar antes de la segunda sesión de la semana 13, según la fecha indicada por el docente.
- Ensayar el arranque en la PC del laboratorio; el PDF asigna dos minutos a esta parte.

## Arranque desde el repositorio

```bash
git clone URL_HTTPS_REAL_DEL_REPOSITORIO
cd NOMBRE_REAL_DE_LA_CARPETA
git switch --detach avance-1
npm ci
npm start
```

El modo detached sirve para ejecutar exactamente la versión calificada. Para seguir trabajando después, volver a la rama: `git switch main`.

La primera instalación puede superar los dos minutos según Internet. Ensayar con anticipación y acordar con el docente la preparación del laboratorio. Si usan node_modules comprimido como sugiere el PDF, generarlo en Windows con la misma arquitectura y versión de Node del laboratorio; no reutilizar dependencias binarias instaladas en Linux.
