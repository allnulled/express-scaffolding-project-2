const bcrypt = require("bcrypt");
const wordToEncrypt = process.argv.pop();

bcrypt.hash(wordToEncrypt, 12).then(hashed => {
    console.log(hashed);
});