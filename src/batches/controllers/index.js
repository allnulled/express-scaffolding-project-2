const express = require("express");

module.exports = function (tools) {
    try {
        const { app } = tools;

        /* GENERAL MIDDLEWARES */
        app.use(tools.middlewares.logRequest());

        /* PAGE CONTROLLERS */
        app.get(["/home", "/$"], require(__dirname + "/pages/home.js")(tools));
        app.get("/contact", require(__dirname + "/pages/contact.js")(tools));

        /* DATA CONTROLLERS */
        // @TODO...
        // @TODO...
        // @TODO...
        // @TODO...
        // @TODO...

        /* AUTH CONTROLLERS */
        app.get("/auth/session", [tools.middlewares.authenticationOrFailJson()], (request, response) => response.jsonSuccess({ authentication: request.$$authentication }));
        app.all("/auth/register", require(__dirname + "/auth/register.js")(tools));
        app.all("/auth/confirm/:token", require(__dirname + "/auth/confirm.js")(tools));
        app.all("/auth/login", require(__dirname + "/auth/login.js")(tools));
        app.all("/auth/refresh", require(__dirname + "/auth/refresh.js")(tools));
        app.all("/auth/logout", require(__dirname + "/auth/logout.js")(tools));
        app.all("/auth/forgot", require(__dirname + "/auth/forgot.js")(tools));
        app.all("/auth/recovery/:token", require(__dirname + "/auth/recovery.js")(tools));
        app.all("/auth/change", require(__dirname + "/auth/change.js")(tools));
        app.all("/auth/unregister", require(__dirname + "/auth/unregister.js")(tools));

        /* STATIC CONTROLLER */
        app.use("/", express.static(process.env.PROJECT_SRC + "/batches/static"));

        /* NOT FOUND */
        app.get("*", require(__dirname + "/pages/errors/404-not-found.js")(tools));

    } catch (error) {
        console.error("Error on src/batches/controllers/index.js:", error);
        throw error;
    }
}