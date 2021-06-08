const bcrypt = require("bcrypt");

module.exports = function(passwordCrude, salts = 12) {
    return bcrypt.hash(passwordCrude, salts);
}
