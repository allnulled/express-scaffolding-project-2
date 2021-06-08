const sqlstring = require("sqlstring");

module.exports = function(...args) {
    return sqlstring.escape(...args);
}