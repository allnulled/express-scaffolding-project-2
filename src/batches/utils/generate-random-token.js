const defaultAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

module.exports = function(len = 200, items = defaultAlphabet) {
    let token = "";
    for(let index = 0; index < len; index++) {
        token += items[Math.floor(Math.random() * items.length)];
    }
    return token;
}