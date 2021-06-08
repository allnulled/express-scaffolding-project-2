module.exports = function () {
    const tools = this;
    return async function (request, response, next) {
        try {
            const sessionToken = request.headers.authorization || (request.body ? request.body.session_token : false) || request.query.session_token;
            const sessionData = await tools.utils.authenticate(sessionToken);
            request.$$authentication = { session: sessionData };
            return next();
        } catch (error) {
            return response.jsonError({
                action: "/middlewares/authentication-or-fail",
                error,
            });
        }
    };
}