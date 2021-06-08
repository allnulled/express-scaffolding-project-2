module.exports = function (tools) {
    const { db, middlewares, utils } = tools;
    return [
        middlewares.bodyParser(),
        async function (request, response, next) {
            try {

                //////////////////////////////////////////////////
                // @STEP: parameters validation
                const args = {
                    ...request.body,
                    ...request.query,
                    sessionToken: request.headers.authorization || (request.body ? request.body.session_token : false) || request.query.session_token,
                };
                
                const hasErrors = utils.hasTypeErrors(args, `
                    name: undefined | string;
                    name.length: undefined | gt(2);
                    email: undefined | string;
                    email.length: undefined | gt(5);
                    password: undefined | string;
                    password.length: undefined | gt(5);
                    repeat_password: undefined | string;
                    repeat_password.length: undefined | gt(5);
                    sessionToken: string;
                    sessionToken.length: equal(200);
                `);
                if (hasErrors !== false) {
                    throw hasErrors;
                } else if((typeof args.password !== "undefined") && (args.password !== args.repeat_password)) {
                    throw new Error("Required «password» and «repeat_password» to be the same [000097843621789031]");
                } else if(true
                    && typeof args.name === "undefined"
                    && typeof args.password === "undefined"
                    && typeof args.email === "undefined"
                ) {
                    throw new Error("Required any of { name, password, email } to not be undefined [000077843621789032]");
                }
                
                // @STEP: SELECT current session
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
                    throw new Error("Required «token» to exist as «current session token» [00097004784567601]");
                }
                const [sessionData] = selectionSessions;
                
                // @STEP: SELECT current user
                const sanitizedUserId = utils.sanitize(sessionData.id_usuario);
                const [selectionUsers] = await db.query(`
                    SELECT
                        *
                    FROM 
                        usuarios
                    WHERE 
                        usuarios.id = ${sanitizedUserId};
                `);
                const [userData] = selectionUsers;

                // @STEP: UPDATE current user
                let sanitizedPassword = undefined;
                if(args.password) {
                    const encryptedPassword = await utils.encryptPassword(args.password);
                    sanitizedPassword = utils.sanitize(encryptedPassword);
                } else {
                    sanitizedPassword = utils.sanitize(userData.contrasenia);
                }
                const sanitizedName = utils.sanitize(args.name || userData.nombre);
                const sanitizedEmail = utils.sanitize(args.email || userData.correo_electronico);
                const [updationUsers] = await db.query(`
                    UPDATE
                        usuarios
                    SET
                        usuarios.nombre = ${sanitizedName},
                        usuarios.contrasenia = ${sanitizedPassword},
                        usuarios.correo_electronico = ${sanitizedEmail}
                    WHERE
                        usuarios.id = ${sanitizedUserId};
                `);

                // @STEP: respond request
                return response.jsonSuccess({
                    action: "/auth/change",
                    result: {
                        message: "User data was successfully changed."
                    },
                });
            } catch (error) {
                return response.jsonError({
                    action: "/auth/change",
                    error,
                });
            }
        }
    ];
}