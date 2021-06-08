module.exports = function (test, project) {

    test.addTest("it can set down the project", async function (assert) {
        try {
            const Tools = await project;
            assert(Tools.state.active === true, "Tools.state.active is true before being shutted down", 1);
            await Tools.utils.shutdown();
            assert(Tools.state.active === false, "Tools.state.active is false once shutted down", 1);
        } catch (error) {
            throw error;
        }
    });

};