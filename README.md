# express-baseproject

## Proyecto

Proyecto base para aplicaciones basadas en:
  - `node`
  - `express`
  - `ejs`
  - `mysql`
  - `i18next`

Incluye, entre otros:
  - Servidor basado en Express.js
  - Conexión a base de datos MySQL
  - Sistema de autorización basado en MySQL con:
    - usuarios
    - grupos
    - privilegios
  - Renderizado de plantillas con EJS
  - Logging con Winston
  - Front-end básico con jQuery
  - Framework rudimentario propio para testing
  - Scripts de desarrollo y testeo automático

## ¿Cómo se usa?

Dado que ya viene provisto de muchas cosas básicas, los pasos, grosso modo, son:

  - Clonar el proyecto en una nueva carpeta
  - Cambiar las variables de:
    - `package.json`
  - Ejecutar de nuevo `npm shrinkwrap`
  - Crea las variables de entorno necesarias en:
    - `src/batches/configurations/.env`
    - `src/batches/configurations/.env.development`
    - `src/batches/configurations/.env.production`
  - Cambiar el script de base de datos en:
    - `src/batches/database/database.sql`
  - Añadir los nuevos controladores en:
    - `src/batches/controllers/data/*`
    - `src/batches/controllers/index.js`
  - Añadir las nuevas páginas en:
    - `src/batches/controllers/pages/*`
    - `src/batches/controllers/index.js`
  - Añadir las nuevas traducciones en:
    - `src/batches/static/lib/js/i18n.js`
  - Opcionalmente, añadir los tests en `test/nnn.*`

## Variables de entorno necesarias

En el fichero `src/batches/configurations/.env`:

```
NODE_ENV=

APP_PROTOCOL=
APP_HOST=
APP_PORT=
APP_ID=
APP_PAGE_TITLE=

SESSION_MAX_OPENED_PER_USER=
```

En los ficheros `src/batches/configurations/.env.development` y `.env.production`:

```
DATABASE_HOST=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

MAIL_SERVICE=
MAIL_USER=
MAIL_PASSWORD=
```

