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
                    email: string;
                    email.length: gt(5);
                `);
                if (hasErrors !== false) {
                    throw hasErrors;
                }
                
                //////////////////////////////////////////////////
                // @STEP: SELECT user by email
                const sanitizedEmail = utils.sanitize(args.email);
                const [selectionUsers] = await db.query(`
                    SELECT 
                        *
                    FROM
                        usuarios
                    WHERE
                        usuarios.correo_electronico = ${sanitizedEmail};
                `);
                if (selectionUsers.length === 0) {
                    throw new Error("Required «email» to exist in «user» [000073189036757010]");
                } else if (selectionUsers.length > 1) {
                    throw new Error("This account has anomalities. Please, contact the administrator to confirm this account [000073146378248563701]");
                }
                const [userData] = selectionUsers;

                //////////////////////////////////////////////////
                // @STEP: UPDATE user token with a new one
                const recoveryToken = utils.generateRandomToken();
                const recoveryMoment = utils.formatUtcDate(new Date());
                const sanitizedRecoveryToken = utils.sanitize(recoveryToken);
                const sanitizedRecoveryMoment = utils.sanitize(recoveryMoment);
                const sanitizedId = utils.sanitize(userData.id);
                const [updationUserToken] = await db.query(`
                    UPDATE
                        usuarios
                    SET 
                        usuarios.token_recuperacion = ${sanitizedRecoveryToken},
                        usuarios.momento_recuperacion = ${sanitizedRecoveryMoment}
                    WHERE
                        usuarios.id = ${sanitizedId};
                `);
                
                //////////////////////////////////////////////////
                // @STEP: send email with new recovery token
                const recoveryLink = `${configurations.applicationURL}/auth/recovery/${recoveryToken}`;
                const emailResponse = await utils.sendEmail({
                    to: args.email,
                    subject: `Recover session on «${process.env.APP_ID}»`,
                    text: `Recover a session of user «${process.env.MAIL_USER}» on «${process.env.APP_ID}» visiting ${recoveryLink}. Once in, you will be able to change your password, or anything.`,
                    html: `
                        <div>
                            <p>Hello from <b>${process.env.APP_ID}</b>,<p/>
                            <p>Please, visit the link <a href="${recoveryLink}">${recoveryLink}</a> to recover one session of user «${userData.nombre}». Once in, you will be able to change your password, or anything.</p>
                            <p>If you had further problems, you can contact with the administrator.</p>
                            <p>Thank you.</p>
                        </div>
                    `,
                });

                //////////////////////////////////////////////////
                // @STEP: respond request with new user token (in development mode)
                return response.jsonSuccess({
                    action: "/auth/forgot",
                    result: {
                        success: {
                            code: "0000789453218605789489",
                            message: `An email was sent to «${args.email}» with a temporary link to recover the account.`,
                            recoveryURL: process.env.NODE_ENV === "development" ? recoveryLink : `Check the emails on «${args.email}»`,
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
                    action: "/auth/forgot",
                    error,
                });
            }
        }
    ];
}