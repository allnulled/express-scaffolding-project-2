const bcrypt = require("bcrypt");
const hash = process.argv.pop();
const password = process.argv.pop();

console.log("PASSWORD: " + password);
console.log("HASH:     " + hash);

bcrypt.compare(password, hash, (error, result) => {
    if (error) {
        console.error("ERROR:", error);
        console.error("ERROR:    " + hash);
        return;
    }
    console.log("RESULT:   " + result);
});

