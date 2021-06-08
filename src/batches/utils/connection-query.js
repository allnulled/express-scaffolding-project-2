module.exports = function(connection, query) {
    return new Promise((ok, fail) => {
        connection.query(query, function(error, results, fields) {
            if(error) {
                return fail(error);
            }
            return ok([results, fields]);
        });
    });
    
}