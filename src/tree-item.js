/*jshint indent: 2 */
/*global angular: false */

(function () {

  'use strict';
  var mainModule = angular.module('multi-select-tree');

  /**
   * Controller for sortable item.
   *
   * @param $scope - drag item scope
   */
  mainModule.controller('treeItemCtrl', ['$scope', function ($scope) {

    $scope.item.isExpanded = false;

    $scope.showExpando = function (item) {
      return item.children && item.children.length > 0;
    };

    $scope.onExpandoClicked = function (item, $event) {
      $event.stopPropagation();
      item.isExpanded = !item.isExpanded;
    };

    $scope.clickSelectItem = function (item, $event) {
      $event.stopPropagation();
      if ($scope.itemSelected) {
        $scope.itemSelected({item: item});
      }
    };

    $scope.subItemSelected = function (item, $event) {
      if ($scope.itemSelected) {
        $scope.itemSelected({item: item});
      }
    };

    $scope.activeSubItem = function (item, $event) {
      if ($scope.onActiveItem) {
        $scope.onActiveItem({item: item});
      }
    };

    $scope.onMouseOver = function (item, $event) {
      $event.stopPropagation();
      if ($scope.onActiveItem) {
        $scope.onActiveItem({item: item});
      }
    };

    $scope.showCheckbox = function () {
      if (!$scope.multiSelect) {
        return false;
      }
      // it is multi select
      // canSelectItem callback takes preference
      if ($scope.useCanSelectItem) {
        return $scope.canSelectItem({item: $scope.item});
      }
      return !$scope.selectOnlyLeafs || ($scope.selectOnlyLeafs && $scope.item.children.length === 0);
    };

  }]);

  /**
   * sortableItem directive.
   */
  mainModule.directive('treeItem',
    function ($compile) {
      return {restrict: 'E',
        replace: true,
        templateUrl: 'src/tree-item.tpl.html',
        scope: {
          item: '=',
          itemSelected: '&',
          onActiveItem: '&',
          multiSelect: '=?',
          isActive: '=', // the item is active - means it is highlighted but not selected
          selectOnlyLeafs: '=?',
          useCanSelectItem: '=',
          canSelectItem: '=' // reference from the parent control
        },
        controller: 'treeItemCtrl',
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function (element, attrs, link) {
          // Normalize the link parameter
          if (angular.isFunction(link)) {
            link = { post: link };
          }

          // Break the recursion loop by removing the contents
          var contents = element.contents().remove();
          var compiledContents;
          return {
            pre: (link && link.pre) ? link.pre : null,
            /**
             * Compiles and re-adds the contents
             */
            post: function (scope, element, attrs) {
              // Compile the contents
              if (!compiledContents) {
                compiledContents = $compile(contents);
              }
              // Re-add the compiled contents to the element
              compiledContents(scope, function (clone) {
                element.append(clone);
              });

              // Call the post-linking function, if any
              if (link && link.post) {
                link.post.apply(null, arguments);
              }
            }
          };
        }
      };
    });
}());