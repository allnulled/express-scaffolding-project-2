const bcrypt = require("bcrypt");

module.exports = function(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
};