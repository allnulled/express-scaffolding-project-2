module.exports = function(test, project) {
    
    test.addTest("it can set up the project", async function (assert) {
        try {
            assert(1 === 1, "Tester works", 1);
            const Tools = await project;
            assert(typeof Tools === "object", "Tools is an object", 1);
            assert(typeof Tools.app === "function", "Tools.app is a function", 1);
            assert(typeof Tools.server === "object", "Tools.server is an object", 1);
            assert(typeof Tools.db === "object", "Tools.db is an object", 1);
            assert(typeof Tools.utils === "object", "Tools.utils is an object", 1);
            assert(typeof Tools.state === "object", "Tools.state is an object", 1);
        } catch (error) {
            throw error;
        }
    });

};