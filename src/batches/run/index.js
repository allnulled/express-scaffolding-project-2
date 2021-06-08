module.exports = async function (tools) {
    try {

        await new Promise((ok, fail) => {
            
            const { server } = tools;
            server.listen(process.env.APP_PORT, error => {
                if(error) {
                    return fail(error);
                }
                tools.state.active = true;
                return ok(tools);
            });

        });
        
        console.log(`     ✓ ${process.env.APP_PROTOCOL}://${process.env.APP_HOST}:${process.env.APP_PORT}`);
        
        return tools;

    } catch (error) {
        console.error("Error on src/batches/run/index.js:", error);
        throw error;
    }
}