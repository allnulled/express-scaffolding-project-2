module.exports = function (tools) {
    const { utils } = tools;
    return [
        async function (request, response, next) {
            try {
                const homePage = await utils.renderPage(process.env.PROJECT_SRC + "/batches/templates/pages/home.ejs")
                return response.send(homePage);
            } catch (error) {
                return response.jsonError({
                    action: "/home",
                    error,
                });
            }
        }
    ];
}