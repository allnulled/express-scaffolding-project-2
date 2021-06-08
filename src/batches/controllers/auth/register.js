module.exports = function (tools) {
    const { db, middlewares, utils, configurations } = tools;
    return [
        middlewares.bodyParser(),
        async function (request, response, next) {
            try {

                //////////////////////////////////////////////////
                // @STEP: parameters validation
                const args = { ...request.query, ...request.body };
                const hasErrors = utils.hasTypeErrors(args, `
                    name: string;
                    name.length: gt(2);
                    password: string;
                    password.length: gt(5);
                    email: string;
                    email.length: gt(5);
                `);
                if(hasErrors !== false) {
                    throw hasErrors;
                }

                //////////////////////////////////////////////////
                // @STEP: query and filter duplicated users
                const sanitizedName = utils.sanitize(args.name);
                const sanitizedEmail = utils.sanitize(args.email);
                const selectionUsers = await db.query(`
                    SELECT
                        COUNT(*) AS 'TOTAL'
                    FROM
                        usuarios,
                        usuarios_no_registrados
                    WHERE
                        usuarios.nombre = ${sanitizedName}
                        OR usuarios_no_registrados.nombre = ${sanitizedName}
                        OR usuarios.correo_electronico = ${sanitizedEmail}
                        OR usuarios_no_registrados.correo_electronico = ${sanitizedEmail};
                `);
                if (selectionUsers[0][0]["TOTAL"] !== 0) {
                    throw new Error("Required «user» to not be registered [000673489154783123123]");
                }

                //////////////////////////////////////////////////
                // @STEP: query for duplicated users
                const encryptedPassword = await utils.encryptPassword(args.password);
                const sanitizedPassword = utils.sanitize(encryptedPassword);
                const confirmationToken = utils.generateRandomToken(200);
                const sanitizedConfirmationToken = utils.sanitize(confirmationToken);
                const [insertionUnregisteredUser] = await db.query(`
                    INSERT INTO
                        usuarios_no_registrados (
                            nombre,
                            contrasenia,
                            correo_electronico,
                            token_confirmacion
                        )
                    VALUES (
                        ${sanitizedName},
                        ${sanitizedPassword},
                        ${sanitizedEmail},
                        ${sanitizedConfirmationToken}
                    );
                `);

                //////////////////////////////////////////////////
                // @STEP: send email with confirmation link
                const confirmationLink = `${configurations.applicationURL}/auth/confirm/${confirmationToken}`;
                const emailResponse = await utils.sendEmail({
                    to: args.email,
                    subject: `Confirm account on «${process.env.APP_ID}»`,
                    text: `Confirm the account of user ${process.env.MAIL_USER} on «${process.env.APP_ID}» visiting ${confirmationLink}`,
                    html: `
                        <div>
                            <p>Welcome to <b>${process.env.APP_ID}</b>,<p/>
                            <p>Please, visit the link <a href="${confirmationLink}">${confirmationLink}</a> to confirm the account of user «${args.name}».</p>
                            <p>Thank you.</p>
                        </div>
                    `,
                });

                //////////////////////////////////////////////////
                // @STEP: respond request
                return response.jsonSuccess({
                    action: "/auth/register",
                    result: {
                        success: {
                            code: "0000789453218602263",
                            message: `User was successfully registered. Check your email «${args.email}» to finally confirm the account.`,
                            confirmationURL: process.env.NODE_ENV === "development" ? confirmationLink : `Check the emails on «${args.email}»`,
                            email: {
                                destinations: {
                                    accepted: emailResponse.accepted,
                                    rejected: emailResponse.rejected,
                                }
                            },
                        }
                    },
                });

            } catch (error) {
                return response.jsonError({
                    action: "/auth/register",
                    error,
                });
            }
        }
    ];
}