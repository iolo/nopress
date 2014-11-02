module.exports = {
    http: {
        host: '0.0.0.0', // to allow remote access
        middlewares: {
            logger: 'combined'
        },
        routes: {
            errors: {
                404: {
                    template: '<html><title><%=error.status%> <%=error.message%></title><body><pre><%=JSON.stringify(error)%></pre></body></html>'
                },
                500: {
                    template: '<html><title><%=error.status%> <%=error.message%></title><body><pre><%=JSON.stringify(error)%></pre></body></html>'
                }
            }
        }
    }
};
