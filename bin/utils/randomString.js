const number = parseInt(process.argv.pop()) || 200;
const defaultAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

let randomString = "";
for(let index = 0; index < number; index++) {
    randomString += defaultAlphabet[Math.floor(Math.random() * defaultAlphabet.length)];
}

console.log(randomString);