const axios = require("axios");

module.exports = function(test, project) {
    
    test.addTest("it can respond correctly auth cycle", async function (assert) {
        try {
            const Tools = await project;
            const baseURL = Tools.configurations.applicationURL;
            const user = {
                name: "Carlos J.",
                password: "SuperSecret:999",
                email: "carlosjimenohernandez2021@gmail.com",
            };
            // @TEST: register
            const registrationResponse1 = await axios.get(`${baseURL}/auth/register?${new URLSearchParams(user).toString()}`);
            assert(registrationResponse1.data.success === true, "/auth/registration is working", 1);
            // @TEST: confirm
            assert(typeof registrationResponse1.data.data.result.success.confirmationURL === "string", "/auth/confirmation provides URL (in development environment) to continue the auth test", 1);
            const confirmationURL = registrationResponse1.data.data.result.success.confirmationURL;
            const confirmationResponse1 = await axios.get(confirmationURL);
            assert(confirmationResponse1.data.success === true, "/auth/confirmation is working", 1);
            // @TEST: login
            const loginResponse1 = await axios.get(`${baseURL}/auth/login?${new URLSearchParams(user).toString()}`);
            assert(loginResponse1.data.success === true, "/auth/login is working", 1);
            const sessionToken1 = loginResponse1.data.data.result.user.session;
            assert(sessionToken1.length === 200, "/auth/login provides token", 1);
            // @TEST: refresh
            const refreshResponse1 = await axios.get(`${baseURL}/auth/refresh?session_token=${sessionToken1}`);
            assert(refreshResponse1.data.success === true, "/auth/refresh is working", 1);
            const sessionToken2 = refreshResponse1.data.data.result.token;
            assert(typeof sessionToken2 === "string" && sessionToken1 !== sessionToken2, "/auth/refresh is working", 1);
            // @TEST: logout
            const logoutResponse1 = await axios.get(`${baseURL}/auth/logout?session_token=${sessionToken2}`);
            assert(logoutResponse1.data.success === true, "/auth/logout is working", 1);
            // @TODO: forgot
            const forgotResponse1 = await axios.get(`${baseURL}/auth/forgot?email=${user.email}`);
            assert(forgotResponse1.data.success === true, "/auth/forgot is working", 1);
            assert(typeof forgotResponse1.data.data.result.success.recoveryURL === "string", "/auth/forgot is working", 1);
            // @TODO: recovery
            const recoveryURL = forgotResponse1.data.data.result.success.recoveryURL;
            const recoveryResponse1 = await axios.get(recoveryURL);
            assert(recoveryResponse1.data.success === true, "/auth/recovery is working", 1);
            assert(recoveryResponse1.data.data.result.user.session.length === 200, "/auth/recovery provides token", 1);
            // @TODO: change
            const sessionToken3 = recoveryResponse1.data.data.result.user.session;
            user.password = "LAST_PASSWORD.777";
            const changeResponse1 = await axios.get(`${baseURL}/auth/change?password=${user.password}&repeat_password=${user.password}&session_token=${sessionToken3}`);
            assert(changeResponse1.data.success === true, "/auth/change is working", 1);
            const logoutResponse2 = await axios.get(`${baseURL}/auth/logout?session_token=${sessionToken3}`);
            assert(logoutResponse2.data.success === true, "/auth/logout is working after changing credentials", 1);
            // @TEST: unregister
            const loginResponse4 = await axios.get(`${baseURL}/auth/login?${new URLSearchParams(user).toString()}`);
            assert(loginResponse4.data.success === true, "/auth/login is working after changing credentials", 1);
            const sessionToken4 = loginResponse4.data.data.result.user.session;
            const unregisterResponse1 = await axios.get(`${baseURL}/auth/unregister?session_token=${sessionToken4}`);
            assert(unregisterResponse1.data.success === true, "/auth/unregister is working", 1);
            assert(Tools.state.active === true, "Tools.state.active is true", 1);
        } catch (error) {
            throw error;
        }
    });

};