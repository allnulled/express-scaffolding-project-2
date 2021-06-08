const fs = require("fs");
const ejs = require("ejs");
const asynchandler = require("@allnulled/asynchandler");

module.exports = async function(templatePath, templateParameters = {}) {
    try {
        const templateContents = await new Promise((ok, fail) => fs.readFile(templatePath, asynchandler(ok, fail)));
        const templateRendered = await ejs.render(templateContents.toString(), {
            process,
            require,
            tools: this,
            __file: templatePath,
            ...templateParameters
        }, {
            async: true,
        });
        return templateRendered;
    } catch (error) {
        console.error("Error on src/batches/utils/send-email.imm.js:", error);
        throw error;
    }
}