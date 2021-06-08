const asynchandler = require("@allnulled/asynchandler");

module.exports = async function() {
    try {
        await new Promise((ok, fail) => { this.db.connection.end(asynchandler(ok, fail)) });
        await new Promise(ok => this.server.close(asynchandler(ok)));
        this.state.active = false;
    } catch (error) {
        this.utils.logger.error("Error on src/batches/utils/shutdown.js:", error);
    }
};