# Bot de Discord en NodeJS con TypeScript

Este bot ha sido desarrollado usando NodeJS y TypeScript. A continuación, te explicaré cómo configurarlo, lanzarlo y cómo obtener las claves necesarias.

## Configuración

1. **Variables de Entorno**: Antes de lanzar el bot, necesitas configurar algunas variables de entorno. Crea un archivo llamado `.env` en la raíz del proyecto y añade las siguientes variables:

| Variable             | Tipo     | Requerida | Descripción                          |
|----------------------|----------|-----------|--------------------------------------|
| `DISCORD_TOKEN`      | String   | X         | Token del bot de Discord             |
| `RIOT_API_KEY`       | String   | X         | Clave de la API de Riot              |
| `PLAYERS_IN_GAME`    | Number   |           | Número de jugadores en un juego (3 default)|
| `DISCORD_SERVER_ID`  | String   | X         | ID del servidor de Discord           |
| `DISCORD_CHANNEL_ID` | String   | X         | ID del canal de Discord              |
| `DISCORD_ROLE_NAME`  | String   | X         | Nombre del rol de Discord            |

Asegúrate de rellenar los valores correspondientes en el archivo `.env`.

2. **Instalación de Dependencias**: Una vez que hayas configurado las variables de entorno, instala las dependencias del proyecto con el siguiente comando:

    ```bash
    npm i
    ```

3. **Lanzar el Bot**: Después de instalar las dependencias, puedes lanzar el bot usando:

    ```bash
    npm start
    ```

## Creación de un Bot en Discord

1. **Accede al Portal de Desarrolladores de Discord**:
   - Ve a [Discord Developer Portal](https://discord.com/developers/applications).

2. **Crea una Nueva Aplicación**:
   - Haz clic en el botón "New Application" en la esquina superior derecha.
   - Dale un nombre a tu aplicación y haz clic en "Create".

3. **Configura tu Bot**:
   - En el menú lateral, selecciona "Bot".
   - Haz clic en "Add Bot". Confirma haciendo clic en "Yes, do it!".

4. **Obtén el Token del Bot**:
   - En la sección "TOKEN", haz clic en "Copy" para copiar el token de tu bot. Este es el valor que debes usar para `DISCORD_TOKEN` en tu archivo `.env`.

5. **Invita a tu Bot a un Servidor**:
   - En el menú lateral, selecciona "OAuth2".
   - En la sección "OAuth2 URL Generator", marca la casilla "bot" en "SCOPES".
   - Marca los permisos en "BOT PERMISSIONS":
    ``Manage nicknames``, ``Send Messages``, ``Embed Links``, ``Use Embedded Activities``
   - Copia y pega el URL generado en tu navegador y sigue las instrucciones para invitar al bot a tu servidor.

## Obtener las Claves de la API de Riot

1. **Regístrate en el Portal de Desarrolladores de Riot**:
   - Ve a [Riot Developer Portal](https://developer.riotgames.com/).

2. **Inicia Sesión o Crea una Cuenta**:
   - Si ya tienes una cuenta, inicia sesión. Si no, regístrate.

3. **Crea un Proyecto**:
   - Una vez que hayas iniciado sesión, crea un nuevo proyecto y sigue las instrucciones para obtener tu `RIOT_API_KEY`.

---

Ahora deberas ir al discord, agregar el role con el mismo nombre que has agregado antes en las enviroments, y cambiarle los nicks dentro de tu servidor a tus jugadores por sus nombres dentro del juego, y ya con esto tienes todo hecho. disfruta de tu bot :)

TODOS: 
   - [] Poder configurar el servidor en el que se estan jugando las partidas. ( actualmente es EUW ).

Espero que disfrutes usando este bot. Si tienes alguna pregunta o encuentras algún problema, no dudes en abrir un issue, una PR o contactar conmigo.
