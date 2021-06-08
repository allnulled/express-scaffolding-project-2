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
                // @STEP: SELECT session by token
                const sanitizedSessionToken = utils.sanitize(args.sessionToken);
                const [deletionSessions] = await db.query(`
                    DELETE FROM
                        sesiones
                    WHERE
                        sesiones.token = ${sanitizedSessionToken};
                `);
                if(deletionSessions.affectedRows === 0) {
                    throw new Error("Required «token» to exist as «current session token» [000674327891453729409]");
                }

                //////////////////////////////////////////////////
                // @STEP: respond request with success message
                return response.jsonSuccess({
                    action: "/auth/logout",
                    result: {
                        message: "Session was deleted successfully",
                        session: deletionSessions
                    },
                });
                
            } catch (error) {
                return response.jsonError({
                    action: "/auth/logout",
                    error,
                });
            }
        }
    ];
}