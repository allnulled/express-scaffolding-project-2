const bodyParser = require("body-parser");

module.exports = function () {
    return [
        bodyParser.urlencoded({ extended: false }),
        bodyParser.json({ extended: true }),
    ];
}