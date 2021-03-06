(function() {
    'use strict';
    angular.module('RedhatAccessInsights', [
            'ui.router',
            'ui.bootstrap',
            'insights',
            'templates'
        ])
        .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', '$provide', 'InsightsConfigProvider','$injector',
            function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $provide,InsightsConfigProvider,$injector) {
                $httpProvider.defaults.headers.common = {
                    'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')
                };

                $provide.factory('AuthInterceptor', ['$injector',
                    function($injector) {
                        return {
                            responseError: function(response) {
                                var $q = $injector.get('$q');
                                var $window = $injector.get('$window');
                                if (response.status === 401) {
                                    $window.location.reload();
                                } else
                                if (response.status === 403) {
                                    var message = 'You are not authorized to perform this action.';
                                    response.data.errors = [message];
                                    response.data.displayMessage = message;
                                    $window.location.href = '/katello/403';
                                }
                                return $q.reject(response);
                            }
                        };
                    }
                ]);
                $httpProvider.interceptors.push('AuthInterceptor');
                $stateProvider.state('manage', {
                    url: '/manage',
                    templateUrl: 'insights/views/configuration.html',
                    controller: 'ConfigurationCtrl'
                });
                $stateProvider.state('help', {
                    url: '/help',
                    templateUrl: 'insights/views/help.html'
                });
                $stateProvider.state('serviceerror', {
                    url: '/proxyerror',
                    templateUrl: 'insights/views/error.html'
                });
                $urlRouterProvider.otherwise('/overview');
                $locationProvider.html5Mode(true);

                // Insights UI configuration
                InsightsConfigProvider.setApiRoot('/redhat_access/r/insights/view/api/');
                InsightsConfigProvider.setCanUnregisterSystems(window.canUnregisterSystems);
                InsightsConfigProvider.setCanIgnoreRules(window.canIgnoreRules);
                InsightsConfigProvider.setGettingStartedLink('https://access.redhat.com/insights/getting-started/satellite/6/');
            }
        ]).value('SAT_CONFIG', {
            enableBasicAuth: true
        });
})();
