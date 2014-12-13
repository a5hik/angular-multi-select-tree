/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var app = angular.module('demoApp', ['multi-select']);

app.controller('demoAppCtrl', function ($scope) {

  $scope.inputList = [
    { firstName: "Peter",    lastName: "Parker", selected: false },
    { firstName: "Mary",     lastName: "Jane", selected: false },
    { firstName: "Bruce",    lastName: "Wayne", selected: true  },
    { firstName: "David",    lastName: "Banner", selected: false },
    { firstName: "Natalia",  lastName: "Romanova", selected: false },
    { firstName: "Clark",    lastName: "Kent", selected: true  }
  ];

});