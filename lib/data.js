'use strict';

/** @module nopress.data */

module.exports = function (config) {
    var join = require('path').join;
    var baseDir = config.dataDir;
    return {
        index: function () {
            return join(baseDir, 'index.md');
        },
        page: function (id) {
            return join(baseDir, 'pages/' + id + '.md');
        },
        post: function (id) {
            return join(baseDir, 'posts/' + id + '.md');
        },
        file: function (id) {
            return join(baseDir, id);
        }
    };
};