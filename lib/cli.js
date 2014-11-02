'use strict';

/** @module nopress.cli */

module.exports = function (argv) {
    var
        args = require('minimist')(argv),
        config = require('../config')({
            dataDir: args.data,
            metaDir: args.meta,
            tempDir: args.temp,
            http: {
                host: args.host,
                port: args.port,
                middlewares: {
                    multipart: {uploadDir: args.temp}
                },
                routes: {
                    statics: {
                        '/data': args.data,
                        '/meta': args.meta
                    }
                }
            }
        });

    if (args.help) {
        return require('fs').createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
    }

    var nopress = require('../lib/nopress').init(config);

    if (args.verbose || !args.quiet) {
        // just for fun ;)
        require('fs').createReadStream(__dirname + '/banner.txt').pipe(process.stdout);
    }

    if (args.generate) {
        console.log('*** generate ***');
        nopress.generate(function (err, items) {
            if (err) {
                return console.log(err);
            }
            console.log('*** generate finished ***', items.length + 'items');

            if (args.deploy) {
                console.log('*** deploy ***');
                nopress.deploy(function (err, items) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('*** deploy finished ***', items.length + 'items');
                });
            }
        });
    }

    if (args.server) {
        require('../lib/http').startServer(config.http);
    }
};
