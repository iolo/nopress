module.exports = {
    dataDir: '/tmp/nopress-data', // override with `--data`
    metaDir: '/tmp/nopress-meta', // override with `--meta`
    tempDir: '/tmp/nopress-temp', // override with `--temp`
    encoding: 'utf8',
    generate: {
        //all: false
    },
    deploy: {
        provider: 'local' //'s3', 'ftp', 'ssh', 'git', 'http', 'rsync', ...
        //host:
        //port:
        //username:
        //password:
        //path:
    },
    http: {
        host: 'localhost', // override with `--host`
        port: 3355, // override with `--port`
        prefix: '/api/v1',
        // see express-toybox/common#configureMiddlewares()
        middlewares: {
            json: {},
            urlencoded: {},
            cors: {}
            //session:{}
            //compress:{}
            //methodOverride: {}
            //cookieParser: {}
            //csrf: {}
            //multipart: {uploadDir: '/tmp/nopress-temp', keepExtensions: false, maxFields: 10 * 1024 * 1024}
        },
        // see express-toybox/common#configureRoutes()
        routes: {
            root: 'build/public', // build with `grunt build`
            statics: {
                '/data': '/tmp/nopress-data',
                '/meta': '/tmp/nopress-meta',
                '/bower_components': 'bower_components' // download with 'bower install'
            }
        }
    }
};
