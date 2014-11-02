(function () {
    'use strict';

    var module = angular.module('np.api', []);

    module.factory('np.api.config', [
        '$window',
        function (window) {
            var location = window.location;
            return {
                endpoint: location.protocol + '//' + location.host + '/api/v1'
            };
        }
    ]);

    module.factory('np.api.request', [
        'np.common.requestFactory', 'np.api.config',
        function (requestFactory, config) {
            return requestFactory(config);
        }
    ]);

    module.factory('np.api', [
        'np.api.request',
        function (request) {
            return {
                files: {
                    get: function (name, options) {
                        return request('GET', '/files/' + name, options);
                    },
                    create: function (name, data) {
                        return request('POST', '/files/' + name);
                    },
                    update: function (name, data) {
                        return request('PUT', '/files/' + name, data);
                    },
                    destroy: function (name) {
                        return request('DELETE', '/files/' + name);
                    }
                }
            };
        }
    ]);

}());
