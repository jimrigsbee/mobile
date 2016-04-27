'use strict';

var myApp = angular.module('inventory', ['ngRoute',
    'ngSanitize',
    'inventory.controllers',
    'inventory.directives',
    'inventory.services',
    'inventory.filters',
    'snap'
]);

myApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/books.html',
            controller: 'ListCtrl'
        })
});
