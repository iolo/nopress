(function () {
    'use strict';

    var module = angular.module('np.meta', []);

    module.factory('np.meta.config', [
        '$window',
        function (window) {
            var location = window.location;
            return {
                endpoint: location.protocol + '//' + location.host + '/meta'
            };
        }
    ]);

    module.factory('np.meta', [
        'np.common.requestFactory', 'np.meta.config',
        function (requestFactory, config) {
            var request = requestFactory(config);
            return {
                index: function (options) {
                    return request('GET', '/index.json', options);
                },
                pages: function (options) {
                    return request('GET', '/pages.json', options);
                },
                posts: function (options) {
                    return request('GET', '/posts.json', options);
                },
                tags: function (options) {
                    return request('GET', '/tags/index.json', options);
                },
                tag: function (tag, options) {
                    return request('GET', '/tags/' + tag + '.json', options);
                },
                archives: function (options) {
                    return request('GET', '/archives/index.json', options);
                },
                archive: function (year, month, options) {
                    return request('GET', '/archives/' + year + '/' + month + '.json', options);
                },
                file: function (id, options) {
                    return request('GET', '/' + id, options);
                }
            };
        }
    ]);

}());
