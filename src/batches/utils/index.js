const fs = require("fs");
const path = require("path");
const isEmpty = (v) => typeof v === "undefined" || v === "";

module.exports = async function (tools) {
    try {
        require("dotenv").config({ path: __dirname + "/../configurations/.env" });
        require("dotenv").config({ path: __dirname + "/../configurations/.env." + process.env.NODE_ENV });
        if (isEmpty(process.env.NODE_ENV)) throw new Error("Missing environment variable «NODE_ENV» [000185756410301]");
        if (isEmpty(process.env.APP_PROTOCOL)) throw new Error("Missing environment variable «APP_PROTOCOL» [000185756410301]");
        if (isEmpty(process.env.APP_HOST)) throw new Error("Missing environment variable «APP_HOST» [000185756410301]");
        if (isEmpty(process.env.APP_PORT)) throw new Error("Missing environment variable «APP_PORT» [000185756410301]");
        if (isEmpty(process.env.APP_ID)) throw new Error("Missing environment variable «APP_ID» [000185756410301]");
        if (isEmpty(process.env.APP_PAGE_TITLE)) throw new Error("Missing environment variable «APP_PAGE_TITLE» [000185756410301]");
        if (isEmpty(process.env.SESSION_MAX_OPENED_PER_USER)) throw new Error("Missing environment variable «SESSION_MAX_OPENED_PER_USER» [000185756410301]");
        if (isEmpty(process.env.DATABASE_HOST)) throw new Error("Missing environment variable «DATABASE_HOST» [000185756410301]");
        if (isEmpty(process.env.DATABASE_USER)) throw new Error("Missing environment variable «DATABASE_USER» [000185756410301]");
        if (isEmpty(process.env.DATABASE_PASSWORD)) throw new Error("Missing environment variable «DATABASE_PASSWORD» [000185756410301]");
        if (isEmpty(process.env.DATABASE_NAME)) throw new Error("Missing environment variable «DATABASE_NAME» [000185756410301]");
        if (isEmpty(process.env.MAIL_SERVICE)) throw new Error("Missing environment variable «MAIL_SERVICE» [000185756410301]");
        if (isEmpty(process.env.MAIL_USER)) throw new Error("Missing environment variable «MAIL_USER» [000185756410301]");
        if (isEmpty(process.env.MAIL_PASSWORD)) throw new Error("Missing environment variable «MAIL_PASSWORD» [000185756410301]");
        tools.configurations = {};
        tools.configurations.applicationURL = `${process.env.APP_PROTOCOL}://${process.env.APP_HOST}:${process.env.APP_PORT}`;
        const files = fs.readdirSync(__dirname);
        const utils = {};
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (file.endsWith(".js") && file != "index.js") {
                const modulePath = path.resolve(__dirname, file);
                const moduleName = file.replace(/(\.imm)?\.js/g, "").replace(/[-]./g, match => match.substr(1).toUpperCase());
                const moduleCrude = require(modulePath);
                let utilsModule = moduleCrude;
                if (file.endsWith(".imm.js")) {
                    utilsModule = moduleCrude.call(tools);
                } else if (typeof utilsModule === "function") {
                    utilsModule = utilsModule.bind(tools);
                }
                Object.assign(utils, { [moduleName]: utilsModule });
            }
        }
        Object.assign(tools, { utils });
    } catch (error) {
        console.error("Error on src/batches/utils/index.js:", error);
        throw error;
    }
}