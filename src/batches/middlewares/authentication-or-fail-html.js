module.exports = function () {
    const tools = this;
    return async function (request, response, next) {
        try {
            const sessionToken = request.headers.authorization || (request.body ? request.body.session_token : false) || request.query.session_token;
            const sessionData = await tools.utils.authenticate(sessionToken);
            request.$$authentication = { session: sessionData };
            return next();
        } catch (error) {
            const errorPage = await tools.utils.renderPage(process.env.PROJECT_SRC + "/batches/templates/pages/error.ejs", {
                request,
                response,
                errorMessage: `(${error.name}) ${error.message}.`,
            });
            return response.send(errorPage);
        }
    };
}