'use strict';

/** @module nopress.routes.data */

var
    readFile = require('fs').readFile,
    nopress = require('../nopress');

module.exports = {
    index: function index(req, res, next) {
        readFile(nopress.data.index(), res.sendFileCallbackFn(next));
    },
    page: function index(req, res, next) {
        readFile(nopress.data.page(req.param('id')), res.sendFileCallbackFn(next));
    },
    post: function index(req, res, next) {
        readFile(nopress.data.post(req.param('id')), res.sendFileCallbackFn(next));
    },
    file: function index(req, res, next) {
        readFile(nopress.data.file(req.param('id')), res.sendFileCallbackFn(next));
    }
};
