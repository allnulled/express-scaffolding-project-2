module.exports = function (tools) {
    const { db, middlewares, utils } = tools;
    return [
        middlewares.bodyParser(),
        async function (request, response, next) {
            try {
                
                //////////////////////////////////////////////////
                // @STEP: parameters validation
                const args = {
                    sessionToken: request.headers.authorization || (request.body ? request.body.session_token : false) || request.query.session_token,
                };
                const hasErrors = utils.hasTypeErrors(args, `
                    sessionToken: string;
                    sessionToken.length: equal(200);
                `);
                if (hasErrors !== false) {
                    throw hasErrors;
                }

                //////////////////////////////////////////////////
                // @STEP: SELECT session
                const sanitizedSessionToken = utils.sanitize(args.sessionToken);
                const [selectionSessions] = await db.query(`
                    SELECT
                        *
                    FROM 
                        sesiones
                    WHERE 
                        sesiones.token = ${sanitizedSessionToken};
                `);
                if (selectionSessions.length === 0) {
                    throw new Error("Required «token» to exist as «current session token» [000556327891453729774]");
                } else if (selectionSessions.length > 1) {
                    throw new Error("This account has anomalities. Please, contact the administrator to confirm this account [00004471563799410041]");
                }
                const [sessionData] = selectionSessions;
                
                //////////////////////////////////////////////////
                // @STEP: user to be unregistered
                const sanitizedUserId = utils.sanitize(sessionData.id_usuario);
                const [selectionUsers] = await db.query(`
                    SELECT
                        *
                    FROM 
                        usuarios
                    WHERE 
                        usuarios.id = ${sanitizedUserId};
                `);
                if (selectionUsers.length === 0) {
                    throw new Error("User could not be deleted by some anomaly. Please, contact the administrator [00001157963570014]");
                } else if (selectionUsers.length > 1) {
                    throw new Error("User could not be deleted by some anomaly. Please, contact the administrator [00002257963570025]");
                }
                const [userData] = selectionUsers;

                //////////////////////////////////////////////////
                // @TODO: DELETE or UPDATE user-related data that is dropped/expired with the user
                // @TODO
                // @TODO
                // @TODO
                // @TODO
                // @TODO
                
                //////////////////////////////////////////////////
                // @STEP: DELETE session
                const [deletionSessions] = await db.query(`
                    DELETE FROM
                        sesiones
                    WHERE 
                        sesiones.id_usuario = ${sanitizedUserId};
                `);
                if (deletionSessions.affectedRows === 0) {
                    throw new Error("User's session could not be deleted by some anomaly. Please, contact the administrator [000037565761377488]");
                }

                //////////////////////////////////////////////////
                // @STEP: DELETE user
                const [deletionUsers] = await db.query(`
                    DELETE FROM
                        usuarios
                    WHERE 
                        usuarios.id = ${sanitizedUserId};
                `);
                if (deletionUsers.affectedRows === 0) {
                    throw new Error("User could not be deleted by some anomaly. Please, contact the administrator [000087365761370014]");
                }

                //////////////////////////////////////////////////
                // @STEP: respond the request
                return response.jsonSuccess({
                    action: "/auth/unregister",
                    result: {
                        message: `User and session of «${userData.nombre}» was successfully deleted. See you soon!`
                    },
                });

            } catch (error) {
                return response.jsonError({
                    action: "/auth/unregister",
                    error,
                });
            }
        }
    ];
}