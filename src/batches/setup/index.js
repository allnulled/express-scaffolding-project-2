const http = require("http");

module.exports = async function (tools) {
    try {

        tools.state = { active: false };
        
        tools.app.response.jsonResponse = function (data = {}, metadata = {}) {
            const date = new Date();
            return this.json({
                app: process.env.APP_ID,
                time: date,
                data,
                ...metadata,
            });
        };
        
        tools.app.response.jsonSuccess = function (data = {}, metadata = {}) {
            const date = new Date();
            const successData = {
                app: process.env.APP_ID,
                time: date,
                success: true,
                failure: false,
                data,
                ...metadata,
            };
            return this.json(successData);
        };
        
        tools.app.response.jsonError = function (data = {}, metadata = {}) {
            const date = new Date();
            const dataForError = "error" in data && "name" in data.error && "message" in data.error ? { ...data, error: { name: data.error.name, message: data.error.message }} : data;
            const errorData = {
                app: process.env.APP_ID,
                time: date,
                success: false,
                failure: true,
                data: dataForError,
                ...metadata,
            };
            tools.utils.error(errorData);
            return this.json(errorData);
        };

        tools.server = http.createServer(tools.app);
        
    } catch (error) {
        console.error("Error on src/batches/setup/index.js:", error);
        throw error;
    }
}