'use strict';

/** @module nopress.routes.meta */

var nopress = require('../nopress');

module.exports = {
    index: function index(req, res, next) {
        res.sendFile(nopress.meta.index());
    },
    pages: function index(req, res, next) {
        res.sendFile(nopress.meta.pages());
    },
    posts: function index(req, res, next) {
        res.sendFile(nopress.meta.posts());
    },
    tags: function index(req, res, next) {
        res.sendFile(nopress.meta.tags());
    },
    tag: function index(req, res, next) {
        res.sendFile(nopress.meta.tag(req.param('tag')));
    },
    archives: function index(req, res, next) {
        res.sendFile(nopress.meta.archives());
    },
    archive: function index(req, res, next) {
        res.sendFile(nopress.meta.archive(req.param('year'), req.param('month')));
    },
    file: function index(req, res, next) {
        res.sendFile(nopress.meta.file(req.param('id')));
    }
};
