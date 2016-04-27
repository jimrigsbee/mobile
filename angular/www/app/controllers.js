'use strict';

var myApp = angular.module('inventory.controllers', []);

myApp.controller('ListCtrl', function($scope) {

      $scope.getList = function() {
                  $scope.booklist = [
                    {
                     title: "Gone with the Wind",
                     genre: "Romance",
                     author: "Margaret Mitchell",
                     count: 12
                  },
                  {
                     title: "Moby Dick",
                     genre: "General Fiction",
                     author: "Herman Melville",
                     count: 3
                  }
                ];  
      };
});
