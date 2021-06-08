module.exports = function (tools) {
    const { db, middlewares, utils } = tools;
    return [
        middlewares.bodyParser(),
        async function (request, response, next) {
            try {
                
                //////////////////////////////////////////////////
                // @STEP: parameters validation
                const args = { ...request.params };
                const hasErrors = utils.hasTypeErrors(args, `
                    token: string;
                    token.length: equal(200);
                `);
                if (hasErrors !== false) {
                    throw hasErrors;
                }
                
                //////////////////////////////////////////////////
                // @STEP: SELECT FROM unregistered users by token
                const sanitizedToken = utils.sanitize(args.token);
                const [unregisteredUserSelection] = await db.query(`
                    SELECT 
                        *
                    FROM
                        usuarios_no_registrados
                    WHERE
                        usuarios_no_registrados.token_confirmacion = ${sanitizedToken};
                `);
                
                //////////////////////////////////////////////////
                // @STEP: prevent user data duplication
                if (unregisteredUserSelection.length === 0) {
                    throw new Error("Required «token» to exist in «unregistered user» [0000731463782157812]");
                } else if (unregisteredUserSelection.length > 1) {
                    throw new Error("This account has anomalities. Please, contact the administrator to confirm this account [0000731463782157813]");
                }
                
                //////////////////////////////////////////////////
                // @STEP: INSERT INTO usuarios
                const userData = unregisteredUserSelection[0];
                const {
                    nombre: userName,
                    contrasenia: userPassword,
                    correo_electronico: userEmail,
                } = userData;
                const tokenRecuperacion = utils.generateRandomToken();
                const sanitizedName = utils.sanitize(userName);
                const sanitizedPassword = utils.sanitize(userPassword);
                const sanitizedEmail = utils.sanitize(userEmail);
                const sanitizedTokenRecuperacion = utils.sanitize(tokenRecuperacion);
                const insertionUser = await db.query(`
                    INSERT INTO 
                        usuarios(
                            nombre,
                            contrasenia,
                            correo_electronico,
                            token_recuperacion
                        )
                    VALUES (
                        ${sanitizedName},
                        ${sanitizedPassword},
                        ${sanitizedEmail},
                        ${sanitizedTokenRecuperacion}
                    );
                `);
                
                //////////////////////////////////////////////////
                // @STEP: DELETE FROM usuarios_no_registrados
                const deletionUser = await db.query(`
                    DELETE FROM 
                        usuarios_no_registrados
                    WHERE 
                        usuarios_no_registrados.id = ${userData.id};
                `);
                
                //////////////////////////////////////////////////
                // @STEP: respond request
                return response.jsonSuccess({
                    action: "/auth/confirm",
                    result: {
                        success: {
                            code: "0000789453218602264",
                            message: `User «${userName}» was successfully registered and confirmed in «${process.env.APP_ID}».`,
                        },
                        user: {
                            name: userData.nombre,
                            email: userData.correo_electronico,
                        }
                    },
                });

            } catch (error) {
                return response.jsonError({
                    action: "/auth/confirm",
                    error,
                });
            }
        }
    ];
}