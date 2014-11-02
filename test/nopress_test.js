'use strict';

var
    asserts = require('asserts'),
    nopress = require('../lib/nopress'),
    debug = require('debug')('test');

describe('nopress', function () {

    describe('getFiles', function () {
        before(function () {
            nopress.init({dataDir: __dirname + '/fixtures', tempDir: '/tmp/nopress-test-temp'});
        });
        it('should be tested', function () {
        });
    });

    describe('getFile', function () {
        before(function () {
            nopress.init({dataDir: __dirname + '/fixtures', tempDir: '/tmp/nopress-test-temp'});
        });

        it('should be tested', function () {
        });
    });

    describe('createFile', function () {
        before(function () {
            nopress.init({dataDir: '/tmp/noprss-test-data', tempDir: '/tmp/nopress-test-temp'});
        });

        it('should be tested', function () {
        });
    });

    describe('updateFile', function () {
        before(function () {
            nopress.init({dataDir: '/tmp/noprss-test-data', tempDir: '/tmp/nopress-test-temp'});
        });

        it('should be tested', function () {
        });
    });

    describe('deleteFile', function () {
        before(function () {
            nopress.init({dataDir: '/tmp/noprss-test-data', tempDir: '/tmp/nopress-test-temp'});
        });

        it('should be tested', function () {
        });
    });
});