'use strict';

var myApp = angular.module('inventory.controllers', ['fhcloud', 'inventory.services']);

myApp.controller('MainCtrl', function($scope, $q, $location, fhcloud, InventoryModel) {

    InventoryModel.getGenres().then(
        function(res) {
            $scope.genres = res.genres;
        },
        function(err) {
            alert('Call to get genres failed: ' + JSON.stringify(err));
        });

    // add function to pass userInput to cloud via
    // $fh.cloud call to controller scope
    $scope.submitInventory = function() {

        //Notifying the user that the cloud endpoint is being called.
        $scope.noticeMessage = "Calling Inventory API";
        $scope.textClassName = "text-info";

        //Creating an AngularJS promise as the $fh.cloud function is asynchronous.
        var defer = $q.defer();

        var promise = defer.promise;

        //When the promise has completed, then the notice message can be updated to include result of the $fh.cloud call.
        promise.then(function(response) {
            // If successful, display the length  of the string.
            if (response.msg != null && typeof(response.msg) !== 'undefined') {
                $scope.noticeMessage = response.msg;
                $scope.textClassName = "text-success";
                $scope.bookForm.$setPristine();
                $scope.inputTitle = '';
                $scope.inputGenre = undefined;
                $scope.inputAuthor = '';
                $scope.inputDesc = '';
                $scope.inputCount = '';
            } else {
                $scope.noticeMessage = "Error: Expected a message from Inventory API.";
                $scope.textClassName = "text-danger";
            }
        }, function(err) {
            //If the function
            $scope.noticeMessage = "API call failed. Error: " + JSON.stringify(err);
        });

        // check if userInput is defined
        if ($scope.inputTitle) {
            /**
             * Pass the userInput to the module containing the $fh.cloud call.
             *
             * Notice that the defer.resolve and defer.reject functions are passed to the module.
             * One of these functions will be called when the $fh.cloud function has completed successully or encountered
             * an error.
             */
            fhcloud.cloud('inventory', {
                    title: $scope.inputTitle,
                    genre: $scope.inputGenre.name,
                    author: $scope.inputAuthor,
                    description: $scope.inputDesc,
                    count: $scope.inputCount
                },
                "POST", defer.resolve, defer.reject);
        }
    };

    $scope.showList = function() {
      $location.path("/list");
    }

    $scope.scanCode = function() {
      cordova.plugins.barcodeScanner.scan(function (result) {
        console.log(result.text);
        $scope.inputBarcode = result.text;
        $scope.lookupCode(result.text);
      });
    }

    $scope.lookupCode = function(barcode) {
      var defer = $q.defer();

      var promise = defer.promise;

      promise.then(function(response) {
          if (response.products != null && typeof(response.products) !== 'undefined') {
            var product = response.products[0];
            $scope.image = product.imageurl;
            $scope.noticeMessage = "Product located by UPC";
            $scope.textClassName = "text-success";
            $scope.inputTitle = product.productname;
          } else {
              $scope.noticeMessage = response.msg;
              $scope.textClassName = "text-danger";
          }
      }, function(err) {
          $scope.noticeMessage = "API call failed. Error: " + JSON.stringify(err);
      });

      fhcloud.cloud('inventory/barcode', {barcode: barcode},
          "GET", defer.resolve, defer.reject);
    }

});

myApp.controller('ListCtrl', function($scope, $q, $location, fhcloud) {

      $scope.showInputView = function() {
          $location.path("/");
      };

      $scope.getList = function() {
          var defer = $q.defer();

          var promise = defer.promise;

          promise.then(function(response) {
              if (response.books != null && typeof(response.books) !== 'undefined') {
                  $scope.noticeMessage = "Inventory displayed.";
                  $scope.textClassName = "text-success";
                  $scope.booklist = response.books.list;
              } else {
                  $scope.noticeMessage = "Error: Expected a message from Inventory API.";
                  $scope.textClassName = "text-danger";
              }
          }, function(err) {
              $scope.noticeMessage = "API call failed. Error: " + JSON.stringify(err);
          });

          fhcloud.cloud('inventory/list', {},
              "GET", defer.resolve, defer.reject);
      };
});
