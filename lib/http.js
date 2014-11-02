'use strict';

/** @module nopress.http */

var
    util = require('util'),
    http = require('http'),
    Q = require('q'),
    _ = require('lodash'),
    express = require('express-toybox')(require('express')),
    nopress = require('./nopress'),
    routes = require('./routes'),
    debug = require('debug')('nopress:http'),
    DEBUG = debug.enabled;

/**
 * create express router.
 *
 * @param {*} config
 * @returns {express.application}
 */
function createRouter(config) {
    DEBUG && debug('create nopress router...');

    var r = express.Router()
            .useResource('/files/:id', routes.files)
            .get('/data/index.json', routes.data.index)
            .get('/data/pages/:id', routes.data.page)
            .get('/data/posts/:id', routes.data.post)
            .get('/data/:id', routes.data.file)
            .get('/meta/index.json', routes.meta.index)
            .get('/meta/pages.json', routes.meta.pages)
            .get('/meta/posts.json', routes.meta.posts)
            .get('/meta/tags/index.json', routes.meta.tags)
            .get('/meta/tags/:tag.json', routes.meta.tag)
            .get('/meta/archives/index.json', routes.meta.archives)
            .get('/meta/archives/:year/:month.json', routes.meta.archive)
            .get('/meta/:id', routes.meta.file)
            .all('/echo', express.toybox.utils.echo);
    console.log(r);
    return r;
}

/**
 * create express app.
 *
 * @param {*} config
 * @param {string} [config.prefix]
 * @param {*} [config.middlewares]
 * @param {*} [config.routes]
 */
function createApp(config) {
    DEBUG && debug('create nopress app...', config);
    return express()
        .useCommonMiddlewares(config.middlewares)
        .use(config.prefix || '/', createRouter(config))
        .useCommonRoutes(config.routes);
}

/**
 * @param {*} config
 * @param {string} [config.host]
 * @param {number} [config.port]
 * @param {function} [callback]
 * @returns {*}
 */
function startServer(config, callback) {
    DEBUG && debug('*** start nopress server...');
    return express.toybox.server.start(createApp(config), config, callback);
}

function stopServer(callback) {
    DEBUG && debug('*** stop nopress server...');
    return express.toybox.server.stop(callback);
}

module.exports = {
    createRouter: createRouter,
    createApp: createApp,
    startServer: startServer,
    sopServer: stopServer
};
