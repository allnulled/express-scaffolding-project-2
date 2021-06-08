module.exports = function (tools) {
    const { utils } = tools;
    return [
        async function (request, response, next) {
            try {
                const errorPage = await utils.renderPage(process.env.PROJECT_SRC + "/batches/templates/pages/error.ejs", {
                    errorMessage: "Page not found [error 404]",
                });
                return response.send(errorPage);
            } catch (error) {
                return response.jsonError({
                    action: "/error/404",
                    error,
                });
            }
        }
    ];
}