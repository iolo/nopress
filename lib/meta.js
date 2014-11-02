'use strict';

/** @module nopress.meta */

module.exports = function (config) {
    var join = require('path').join;
    var baseDir = config.metaDir;
    return {
        index: function () {
            return join(baseDir, 'index.json');
        },
        pages: function () {
            return join(baseDir, 'pages.json');
        },
        posts: function () {
            return join(baseDir, 'posts.json');
        },
        tags: function () {
            return join(baseDir, 'tags/index.json');
        },
        tag: function (tag) {
            return join(baseDir, 'tags/' + tag + '.json');
        },
        archives: function () {
            return join(baseDir, 'archives/index.json');
        },
        archive: function (year, month) {
            return join(baseDir, 'archives/' + year + '/' + month + '.json');
        },
        file: function (id) {
            return join(baseDir, id);
        }
    };
};
