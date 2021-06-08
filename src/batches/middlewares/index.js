module.exports = function (tools) {
    try {
        Object.assign(tools, {
            middlewares: {
                logRequest: require(__dirname + "/log-request.js").bind(tools),
                bodyParser: require(__dirname + "/body-parser.js").bind(tools),
                authentication: require(__dirname + "/authentication.js").bind(tools),
                authenticationOrFailJson: require(__dirname + "/authentication-or-fail-json.js").bind(tools),
                authenticationOrFailHtml: require(__dirname + "/authentication-or-fail-html.js").bind(tools),
            }
        });
    } catch (error) {
        console.error("Error on src/batches/middlewares/index.js:", error);
        throw error;
    }
}