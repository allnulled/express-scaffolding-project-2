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
                const sanitizedSessionToken = utils.sanitize(args.sessionToken);
                
                //////////////////////////////////////////////////
                // @STEP: SELECT current session data
                const [selectionSessions] = await db.query(`
                    SELECT
                        *
                    FROM
                        sesiones
                    WHERE
                        sesiones.token = ${sanitizedSessionToken};
                `);
                if (selectionSessions.length === 0) {
                    throw new Error(`Required «token» to exist as «current session token» [000043217843678951]`);
                } else if (selectionSessions.length > 1) {
                    throw new Error("This session has anomalities. Please, contact the administrator [000043457563799410055]");
                }

                //////////////////////////////////////////////////
                // @STEP: UPDATE current session token
                const [sessionData] = selectionSessions;
                const sessionId = sessionData.id;
                const dateCreation = utils.formatUtcDate(new Date());
                const newSessionToken = utils.generateRandomToken();
                const sanitizedSessionId = utils.sanitize(sessionId);
                const sanitizedNewToken = utils.sanitize(newSessionToken);
                const sanitizedCreationMoment = utils.sanitize(dateCreation);
                const [updationSession] = await db.query(`
                    UPDATE
                        sesiones 
                    SET 
                        token = ${sanitizedNewToken},
                        momento_creacion = ${sanitizedCreationMoment}
                    WHERE 
                        id = ${sanitizedSessionId};
                `)

                //////////////////////////////////////////////////
                // @STEP: respond request with the new header token
                return response.jsonSuccess({
                    action: "/auth/refresh",
                    result: {
                        token: newSessionToken,
                        created_at: dateCreation
                    },
                });
                
            } catch (error) {
                return response.jsonError({
                    action: "/auth/refresh",
                    error,
                });
            }
        }
    ];
}