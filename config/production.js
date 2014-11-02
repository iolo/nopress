module.exports = {
    http: {
        middlewares: {
            logger: {
                file: '/tmp/nopress-http.log',
                format: 'combined'
            }
        },
        routes: {
            errors: {
                404: {},
                500: {
                    stack: false
                }
            }
        }
    }
};
