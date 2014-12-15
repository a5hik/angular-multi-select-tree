/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var app = angular.module('demoApp', ['multi-select-tree']);

app.controller('demoAppCtrl', function ($scope) {

  $scope.data1 = [];

  for (var i = 0; i < 7; i++) {
    var obj = {
      id: i,
      name: 'Node ' + i,
      children: []
    };

    for (var j = 0; j < 3; j++) {
      var obj2 = {
        id: j,
        name: 'Node ' + i + '.' + j,
        children: []
      };
      obj.children.push(obj2);
    }

    $scope.data1.push(obj);
  }

  $scope.data1[1].children[0].children.push({
    id: j,
    name: 'Node sub_sub 1',
    children: [],
    selected: true
  });

  $scope.data2 = angular.copy($scope.data1);
});