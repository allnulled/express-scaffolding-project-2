const { checkTypes } = require("@allnulled/typed-as");

module.exports = function(data, pattern, returnError = true) {
    const hasNoErrors = checkTypes(data, pattern, returnError);
    if(hasNoErrors !== true) {
        return hasNoErrors;
    }
    return false;
}