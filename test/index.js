const Tester = require(__dirname + "/testing-utilities.js");
const test = new Tester();
const project = require(__dirname + "/../src/index.js");

require(__dirname + "/001.setup.test.js")(test, project);
require(__dirname + "/002.auth.test.js")(test, project);
require(__dirname + "/999.setdown.test.js")(test, project);

test.runTests();


