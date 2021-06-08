module.exports = function (tools) {
    const { db, middlewares, utils } = tools;
    return [
        middlewares.bodyParser(),
        async function (request, response, next) {
            try {
                
                //////////////////////////////////////////////////
                // @STEP: validate parameters
                const args = { ...request.params };
                if(!("token" in args)) {
                    throw new Error("Missing recovery token in arguments [0000478391267886783126]");
                } else if(args.token.length !== 200) {
                    throw new Error("Invalid recovery token in arguments [0000478391267886783543]");
                }

                //////////////////////////////////////////////////
                // @STEP: SELECT this user (by recovery token) to get the id
                const sanitizedRecoveryToken = utils.sanitize(args.token);
                const [selectionUsers] = await db.query(`
                    SELECT
                        *
                    FROM
                        usuarios
                    WHERE
                        usuarios.token_recuperacion = ${sanitizedRecoveryToken};
                `);
                if (selectionUsers.length === 0) {
                    throw new Error(`Required «user» to exist [00008543254233678952]`);
                } else if (selectionUsers.length > 1) {
                    throw new Error("This account has anomalities. Please, contact the administrator to confirm this account [00008543254233678953]");
                }
                const [userData] = selectionUsers;

                //////////////////////////////////////////////////
                // @STEP: UPDATE user recovery token to NULL
                const sanitizedUserId = utils.sanitize(userData.id);
                const [updationUsers] = await db.query(`
                    UPDATE
                        usuarios
                    SET
                        usuarios.token_recuperacion = NULL,
                        usuarios.momento_recuperacion = NULL
                    WHERE
                        usuarios.id = ${sanitizedUserId};
                `);

                //////////////////////////////////////////////////
                // @STEP: DELETE all opened sessions by this user (as it is recovering the account)
                const [deletionSessions] = await db.query(`
                    DELETE FROM
                        sesiones
                    WHERE
                        sesiones.id_usuario = ${userData.id};
                `);

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
                    action: "/auth/recovery",
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
                    action: "/auth/recovery",
                    error,
                });
            }
        }
    ];
}