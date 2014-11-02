'use strict';

/** @module nopress.routes.files */

var nopress = require('../nopress');

module.exports = {
    index: function (req, res, next) {
        nopress.getFile(req.param('id'), res.jsonCallbackFn(next));
    },
    create: function (req, res, next) {
        nopress.createFile(req.param('id'), req.data, res.jsonCallbackFn(next));
    },
    show: function (req, res, next) {
        nopress.getFile(req.param('id'), res.jsonCallbackFn(next));
    },
    update: function (req, res, next) {
        nopress.updateFile(req.param('id'), req.body, res.jsonCallbackFn(next));
    },
    destroy: function (req, res, next) {
        var name = req.params[0];
        nopress.deleteFile(req.param('id'), res.jsonCallbackFn(next));
    }
};
