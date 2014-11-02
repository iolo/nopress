(function () {
    'use strict';

    var module = angular.module('np.data', []);

    module.factory('np.data.config', [
        '$window',
        function (window) {
            var location = window.location;
            return {
                endpoint: location.protocol + '//' + location.host + '/data'
            };
        }
    ]);

    module.factory('np.data', [
        'np.common.requestFactory', 'np.data.config',
        function (requestFactory, config) {
            var request = requestFactory(config);
            return {
                index: function () {
                    return request('GET', '/index.json', options);
                },
                page: function (id, options) {
                    return request('GET', '/pages/' + id + '.md', options);
                },
                post: function (id, options) {
                    return request('GET', '/posts/' + id + '.md', options);
                },
                file: function (id, options) {
                    return request('GET', '/' + id, options);
                }
            };
        }
    ]);

}());
