module.exports = {
    http: {
        middlewares: {
            logger: {debug: 'nopress:http:log', format: 'dev'}
        },
        routes: {
            errors: { // NO custom error routes
                404: false,
                500: false
            }
        }
    }
};
