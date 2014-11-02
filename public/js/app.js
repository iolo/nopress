(function () {
    'use strict';

    var module = angular.module('app', ['ngRoute', 'ngSanitize', 'np.common', 'np.data', 'np.meta']);

    module.config(['$routeProvider', function (routes) {
        routes
            .when('/', {templateUrl: 'views/home.html', controller: 'home'})
            .when('/posts', {templateUrl: 'views/posts/index.html', controller: 'posts.index'})
            .when('/posts/:id', {templateUrl: 'views/posts/show.html', controller: 'posts.show'})
            .when('/pages', {templateUrl: 'views/pages/index.html', controller: 'pages.index'})
            .when('/pages/:id', {templateUrl: 'views/pages/show.html', controller: 'pages.show'})
            .when('/tags', {templateUrl: 'views/tags/index.html', controller: 'tags.index'})
            .when('/tags/:tag', {templateUrl: 'views/tags/show.html', controller: 'tags.show'})
            .when('/archives', {templateUrl: 'views/archives/index.html', controller: 'archives.index'})
            .when('/archives/:year/:month', {templateUrl: 'views/archives/show.html', controller: 'archives.show'})
            .otherwise({redirectTo: '/'});
    }]);

    module.run([
        '$rootScope', '$log', 'np.meta',
        function (root, console, meta) {
            console.log('**** startup ***');
            meta.index().then(function (result) {
                root.site = result;
            });
        }
    ]);

    module.controller('sidebar', [
        '$scope', '$routeParams', '$location', 'np.meta',
        function (scope, params, location, meta) {
            meta.archives().then(function (result) {
                scope.archives = result;
            });
            meta.tags().then(function (result) {
                scope.tags = result;
            });
        }
    ]);

    module.controller('home', [
        '$scope', '$routeParams', '$location', 'np.meta',
        function (scope, params, location, meta) {
            meta.posts().then(function (result) {
                scope.posts = result;
            });
        }
    ]);

    module.controller('posts.index', [
        '$scope', '$routeParams', '$location', 'np.meta',
        function (scope, params, location, meta) {
            meta.posts().then(function (result) {
                scope.posts = result;
            });
        }
    ]);

    module.controller('posts.show', [
        '$scope', '$routeParams', '$location', 'np.meta', 'np.data',
        function (scope, params, location, meta, data) {
            scope.post = {
                id: params.id,
                content: data
            };
            data.post(scope.post.id).then(function (result) {
                var index = result.indexOf('\n---\n');
                if (index > 0) {
                    var front = result.substring(0, index);
                    try {
                        scope.post = angular.extend(scope.post, JSON.parse(front));
                    } catch (e) {
                        console.error(e);
                    }
                    result = result.substring(index + 5);
                }
                try {
                    scope.post.content = marked(result);
                } catch (e) {
                    console.error(e);
                    scope.post.content = result;
                }
            });
        }
    ]);

    module.controller('pages.index', [
        '$scope', '$routeParams', '$location', 'np.meta',
        function (scope, params, location, meta) {
            meta.pages().then(function (result) {
                scope.pages = result;
            });
        }
    ]);

    module.controller('pages.show', [
        '$scope', '$routeParams', '$location', 'np.meta', 'np.data',
        function (scope, params, location, meta, data) {
            scope.page = {
                id: params.id
            };
            data.page(scope.page.id).then(function (result) {
                //...
            });
        }
    ]);

    module.controller('tags.index', [
        '$scope', '$routeParams', '$location', 'np.meta',
        function (scope, params, location, meta) {
            meta.tags().then(function (result) {
                scope.tags = result;
            });
        }
    ]);

    module.controller('tags.show', [
        '$scope', '$routeParams', '$location', 'np.meta',
        function (scope, params, location, meta) {
            scope.tag = params.tag;
            meta.tag(scope.tag).then(function (result) {
                scope.posts = result;
            });
        }
    ]);

    module.controller('archives.index', [
        '$scope', '$routeParams', '$location', 'np.meta',
        function (scope, params, location, meta) {
            meta.archives().then(function (result) {
                scope.archives = result;
            });
        }
    ]);

    module.controller('archives.show', [
        '$scope', '$routeParams', '$location', 'np.meta',
        function (scope, params, location, meta) {
            scope.year = parseInt(params.year, 10);
            scope.month = parseInt(params.month, 10);
            meta.archive(scope.year, scope.month).then(function (result) {
                scope.posts = result;
            });
        }
    ]);

}());