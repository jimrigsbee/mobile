'use strict';

var myApp = angular.module('inventory', ['ngRoute',
    'ngSanitize',
    'inventory.controllers',
    'inventory.directives',
    'inventory.services',
    'inventory.filters',
    'snap',
    'fhcloud'
]);

myApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/inventory.html',
            controller: 'MainCtrl'
        })
        .when('/list', {
            templateUrl: 'views/books.html',
            controller: 'ListCtrl'
        })
});
