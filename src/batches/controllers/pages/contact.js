module.exports = function (tools) {
    const { utils } = tools;
    return [
        async function (request, response, next) {
            try {
                const contactPage = await utils.renderPage(process.env.PROJECT_SRC + "/batches/templates/pages/contact.ejs")
                return response.send(contactPage);
            } catch (error) {
                return response.jsonError({
                    action: "/contact",
                    error,
                });
            }
        }
    ];
}