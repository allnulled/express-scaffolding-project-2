module.exports = async function(sessionToken) {
    try {
        if(typeof sessionToken !== "string") {
            throw new Error("Invalid session token [0000478329678432101]");
        } else if (sessionToken.length !== 200) {
            throw new Error("Invalid session token [000047832967843210" + sessionToken.length + "2]");
        }
        const sanitizedToken = this.utils.sanitize(sessionToken);
        const [sessionSelection] = await this.db.query(`
            SELECT

                sesiones.id AS 'sesiones.id',
                sesiones.id_usuario AS 'sesiones.id_usuario',
                sesiones.token AS 'sesiones.token',
                sesiones.momento_creacion AS 'sesiones.momento_creacion',

                usuarios.id AS 'usuarios.id',
                usuarios.nombre AS 'usuarios.nombre',
                usuarios.contrasenia AS 'usuarios.contrasenia',
                usuarios.correo_electronico AS 'usuarios.correo_electronico',
                usuarios.token_recuperacion AS 'usuarios.token_recuperacion',
                usuarios.momento_recuperacion AS 'usuarios.momento_recuperacion',

                usuarios_y_grupos.id AS 'usuarios_y_grupos.id',
                usuarios_y_grupos.id_usuario AS 'usuarios_y_grupos.id_usuario',
                usuarios_y_grupos.id_grupo AS 'usuarios_y_grupos.id_grupo',

                grupos.id AS 'grupos.id',
                grupos.nombre AS 'grupos.nombre',

                grupos_y_privilegios.id AS 'grupos_y_privilegios.id',
                grupos_y_privilegios.id_grupo AS 'grupos_y_privilegios.id_grupo',
                grupos_y_privilegios.id_privilegio AS 'grupos_y_privilegios.id_privilegio',

                privilegios.id AS 'privilegios.id',
                privilegios.nombre AS 'privilegios.nombre'

            FROM sesiones

                LEFT JOIN usuarios
                    ON usuarios.id = sesiones.id_usuario
                LEFT JOIN usuarios_y_grupos
                    ON usuarios_y_grupos.id_usuario = usuarios.id
                LEFT JOIN grupos
                    ON grupos.id = usuarios_y_grupos.id_grupo
                LEFT JOIN grupos_y_privilegios
                    ON grupos_y_privilegios.id_grupo = grupos.id
                LEFT JOIN privilegios
                    ON privilegios.id = grupos_y_privilegios.id_privilegio
            WHERE
                sesiones.token = ${sanitizedToken};
        `);
        if(sessionSelection.length === 0) {
            throw new Error("Invalid session token [0000478329678432103]");
        }
        const sessionDataFormatted = this.utils.fromSqlToLists(sessionSelection);
        return sessionDataFormatted;
    } catch (error) {
        this.utils.error(error);
        throw error;
    }
}

