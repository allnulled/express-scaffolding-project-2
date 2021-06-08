module.exports = function (tools) {
    const { db, middlewares, utils } = tools;
    return [
        middlewares.bodyParser(),
        async function (request, response, next) {
            try {

                //////////////////////////////////////////////////
                // @STEP: parameters validation
                const args = { ...request.body, ...request.query };
                const hasErrors = utils.hasTypeErrors(args, `
                    name: undefined | string;
                    name.length: undefined | gt(2);
                    email: undefined | string;
                    email.length: undefined | gt(5);
                    password: string;
                    password.length: gt(5);
                `);
                if (hasErrors !== false) {
                    throw hasErrors;
                }

                //////////////////////////////////////////////////
                // @STEP: SELECT this user (by name or email) to get the id
                const sanitizedName = utils.sanitize(args.name);
                const sanitizedEmail = utils.sanitize(args.email);
                const [selectionUsers] = await db.query(`
                    SELECT
                        *
                    FROM
                        usuarios
                    WHERE
                        usuarios.nombre = ${sanitizedName}
                        OR usuarios.correo_electronico = ${sanitizedEmail};
                `);
                if(selectionUsers.length === 0) {
                    throw new Error(`Required «user» to exist [000043217843678951]`);
                } else if (selectionUsers.length > 1) {
                    throw new Error("This account has anomalities. Please, contact the administrator to confirm this account [00004471563799410041]");
                }
                const [userData] = selectionUsers;

                //////////////////////////////////////////////////
                // @STEP: verify password
                const isCorrect = await utils.verifyPassword(args.password, userData.contrasenia);
                if(!isCorrect) {
                    throw new Error("Password is not correct");
                }

                //////////////////////////////////////////////////
                // @STEP: SELECT opened session by this user
                const [selectionSessions] = await db.query(`
                    SELECT
                        *
                    FROM
                        sesiones
                    WHERE
                        sesiones.id_usuario = ${userData.id};
                `);

                //////////////////////////////////////////////////
                // @STEP: check maximum number of sessions
                const maxSessions = parseInt(process.env.SESSION_MAX_OPENED_PER_USER);
                if ((selectionSessions.length !== 0) && (maxSessions <= selectionSessions.length)) {
                    throw new Error(`Maximum of sessions reached with user «${userData.nombre}»`);
                }

                //////////////////////////////////////////////////
                // @STEP: INSERT new session
                const dateCreation = utils.formatUtcDate(new Date());
                const sessionToken = utils.generateRandomToken();
                const sanitizedId = utils.sanitize(userData.id);
                const sanitizedToken = utils.sanitize(sessionToken);
                const sanitizedCreationMoment = utils.sanitize(dateCreation);
                await db.query(`
                    INSERT INTO
                        sesiones (
                            id_usuario,
                            token,
                            momento_creacion
                        )
                    VALUES (
                        ${sanitizedId},
                        ${sanitizedToken},
                        ${sanitizedCreationMoment}
                    );
                `)

                //////////////////////////////////////////////////
                // @STEP: respond request with the header token
                return response.jsonSuccess({
                    action: "/auth/login",
                    result: {
                        user: {
                            name: userData.nombre,
                            email: userData.correo_electronico,
                            session: sessionToken,
                            created_at: dateCreation,
                        }
                    },
                });
                
            } catch (error) {
                return response.jsonError({
                    action: "/auth/login",
                    error,
                });
            }
        }
    ];
}