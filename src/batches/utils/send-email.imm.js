const nodemailer = require("nodemailer");

module.exports = function () {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
        return (mailOptions) => {
            const hasErrors = this.utils.hasTypeErrors(mailOptions, `
                to: string;
                to.length: gt(1);
                text: string;
                text.length: gt(1);
                subject: string;
            `);
            return new Promise((ok, fail) => {
                if (hasErrors !== false) {
                    return fail(hasErrors);
                }
                transporter.sendMail({
                    from: process.env.MAIL_USER,
                    ...mailOptions
                }, (error, info) => {
                    if(error) {
                        return fail(error);
                    }
                    return ok(info);
                });
            });
        };
    } catch (error) {
        console.error("Error on src/batches/utils/send-email.imm.js:", error);
        console.error("[ERROR NOTE:] This error can be related with the account configured to send emails.");
        throw error;
    }
}