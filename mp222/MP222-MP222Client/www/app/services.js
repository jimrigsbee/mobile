'use strict';

var myApp = angular.module('inventory.services', ['fhcloud']);

myApp.factory('', function() {});

myApp.service('InventoryModel', function(fhcloud, $q) {
    var service = this;

    service.getGenres = function() {

      var defer = $q.defer();
      var promise = defer.promise;

      fhcloud.cloud('inventory/genre', {}, "GET", defer.resolve, defer.reject);

      return promise;

    };
});
