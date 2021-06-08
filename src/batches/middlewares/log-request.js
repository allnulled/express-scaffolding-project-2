module.exports = function () {
    const tools = this;
    return function(request, response, next) {
        tools.utils.logger.inform({
            ip: request.headers["x-forwarded-for"] || request.connection.remoteAddress,
            date: new Date(),
            url: request.originalUrl
        });
        return next();
    };
}