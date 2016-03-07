/**
 * Created by yang on 2016/3/7.
 */
angular.module('ng-resthelper', []).factory('RestApi', function($http, $q, $log) {

    function _http(method, uri, data, opts) {
        var delay = $q.defer();
        var req = _param(method, uri, data, opts);
        $http(req).then(function(res) {
            // response handler
            $log.debug('requert uri:', uri, ', method:', method, ', data:', JSON.stringify(data), ', res data:', JSON.stringify(res.data));
            delay.resolve(res.data);
        }, function(res) {
            // err handler
            $log.error('requert uri:', uri, ', method:', method, ', data:', JSON.stringify(data), ', res:', JSON.stringify(res));
            delay.reject(res.status);
        });
        return delay.promise;
    }

    function _param(method, uri, data, opts) {
        opts = opts || {};
        if (method === 'GET' || method == 'DELETE') {
            opts.params = opts.params || {};
            angular.extend(opts.params, data);
        }
        return {
            method: method,
            url: uri,
            params: opts.params || {},
            data: data || {},
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            cache: false,
            timeout: 60000
        };
    }

    function _get(uri, data, opts) {
        return _http('GET', uri, data, opts);
    }

    function _post(uri, data, opts) {
        return _http('POST', uri, data, opts);
    }

    function _put(uri, data, opts) {
        return _http('PUT', uri, data, opts);
    }

    function _remove(uri, data, opts) {
        return _http('DELETE', uri, data, opts);
    }

    function _handleArrayConfig(service, baseuri, config) {
        var key = config[0].toLowerCase();
        var uri = baseuri + config[1];
        if (key === 'get') {
            if (angular.isFunction(val)) {
                service.get = val
            }  else {
                angular.bind(service, _get, uri);
            }
        } else if (key === 'post') {
            if (angular.isFunction(val)) {
                service.post = val
            }  else {
                angular.bind(service, _post, uri);
            }
        } else if (key === 'put') {
            if (angular.isFunction(val)) {
                service.put = val
            }  else {
                angular.bind(service, _put, uri);
            }
        } else if (key === 'remove') {
            if (angular.isFunction(val)) {
                service.remove = val
            }  else {
                angular.bind(service, _remove, uri);
            }
        }
    }

    return function(apis) {
        var services = {};
        var baseuri = apis.baseuri || '';
        for (var name in apis) {
            var service = {};
            var config = apis[name];
            var uri = baseuri + config.uri;
            services[name] = service;

            for (var key in config) {
                var val = config[key];
                if (key === 'get') {
                    if (angular.isFunction(val)) {
                        service.get = val
                    }  else {
                        angular.bind(service, _get, uri);
                    }
                } else if (key === 'post') {
                    if (angular.isFunction(val)) {
                        service.post = val
                    }  else {
                        angular.bind(service, _post, uri);
                    }
                } else if (key === 'put') {
                    if (angular.isFunction(val)) {
                        service.put = val
                    }  else {
                        angular.bind(service, _put, uri);
                    }
                } else if (key === 'remove') {
                    if (angular.isFunction(val)) {
                        service.remove = val
                    }  else {
                        angular.bind(service, _remove, uri);
                    }
                } else if (angular.isArray(val)) {
                    _handleArrayConfig(service, baseuri, config)
                } else if (angular.isFunction(val)) {
                    service[key] = val;
                }
            }
        }
    };

});