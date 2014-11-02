'use strict';

/**
 * startup script for debugging.
 *
 * @module nopress.app
 */

var config = require('./config')({
    dataDir: __dirname + '/test/fixtures/data',
    metaDir: __dirname + '/test/fixtures/meta',
    http: {
        routes: {
            statics: {
                '/data': __dirname + '/test/fixtures/data',
                '/meta': __dirname + '/test/fixtures/meta'
            }
        }
    }
});

require('./lib/nopress').init(config);

require('./lib/http').startServer(config.http);
