(function () {
    'use strict';

    var module = angular.module('np.common', []);

    module.factory('np.common.requestFactory', [
        '$log', '$q', '$http',
        function (console, Q, http) {
            return function (config) {
                return function (method, path, data, params) {
                    var req = {
                        method: method,
                        url: config.endpoint + path,
                        headers: {Accept: 'application/json'}
                        //withCredentials: true
                    };

                    if (method == 'GET' || method == 'DELETE') {
                        req.params = data;
                    } else {
                        req.headers['Content-Type'] = 'application/json;charset=utf8';
                        req.data = data;
                        req.params = params;
                    }

                    //if (config.authorization) {
                    //     req.headers.Authorization = 'Bearer ' + SHA1(key + secret + nonce) + nonce
                    //}

                    return http(req).then(function (res) {
                        console.log('***request ', req.method, req.url, 'ok:', res.status);
                        return res.data;
                    }, function (res) {
                        console.log('***request ', req.method, req.url, 'err:', res.status);
                        var error = (res.data && res.data.status) ? res.data : {
                            status: res.status,
                            message: String(res.data)
                        };
                        return Q.reject(error);
                    });
                };
            };
        }
    ]);

}());
