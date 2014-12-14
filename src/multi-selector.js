/*jshint indent: 2 */
/*global angular: false */

(function () {

  'use strict';
  var mainModule = angular.module('multi-select-tree');

  /**
   * Controller for multi select tree.
   */
  mainModule.controller('multiSelectTreeCtrl', ['$scope', '$document', function ($scope, $document) {

    var activeItem;

    $scope.showTree = false;
    $scope.selectedItems = [];
    $scope.multiSelect = $scope.multiSelect || false;

    /**
     * Clicking on document will hide the tree.
     */
    function docClickHide() {
      closePopup();
      $scope.$apply();
    }

    /**
     * Closes the tree popup.
     */
    function closePopup() {
      $scope.showTree = false;
      if (activeItem) {
        activeItem.isActive = false;
        activeItem = undefined;
      }
      $document.off('click', docClickHide);
    }

    /**
     * Sets the active item.
     *
     * @param item the item element.
     */
    $scope.onActiveItem = function (item) {
      if (activeItem !== item) {
        if (activeItem) {
          activeItem.isActive = false;
        }
        activeItem = item;
        activeItem.isActive = true;
      }
    };

    // refresh output model.
    $scope.refreshOutputModel = function() {
      $scope.outputModel = angular.copy( $scope.selectedItems );
    };

    /**
     * Deselect the item.
     *
     * @param item the item element
     * @param $event
     */
    $scope.deselectItem = function (item, $event) {
      $event.stopPropagation();
      $scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
      item.selected = false;
      this.refreshOutputModel();
    };

    /**
     * Swap the tree popup on control click event.
     *
     * @param $event the click event.
     */
    $scope.onControlClicked = function ($event) {
      $event.stopPropagation();
      $scope.showTree = !$scope.showTree;
      if ($scope.showTree) {
        $document.on('click', docClickHide);
      }
    };

    /**
     * Stop the event on filter clicked.
     *
     * @param $event the click event
     */
    $scope.onFilterClicked = function ($event) {
      $event.stopPropagation();
    };

    /**
     * Handles the item select event.
     *
     * @param item the selected item.
     */
    $scope.itemSelected = function (item) {
      if ($scope.useCanSelectItemCallback && $scope.canSelectItem({item: item}) === false) {
        return;
      }

      if (!$scope.multiSelect) {
        closePopup();
        for (var i = 0; i < $scope.selectedItems.length; i++) {
          $scope.selectedItems[i].selected = false;
        }
        item.selected = true;
        $scope.selectedItems = [];
        $scope.selectedItems.push(item);
      } else {
        item.selected = true;
        var indexOfItem = $scope.selectedItems.indexOf(item);
        if (indexOfItem > -1) {
          item.selected = false;
          $scope.selectedItems.splice(indexOfItem, 1);
        } else {
          $scope.selectedItems.push(item);
        }
      }
      this.refreshOutputModel();
    };

  }]);

  /**
   * sortableItem directive.
   */
  mainModule.directive('multiSelector',
    function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'src/multi-selector.tpl.html',
        scope: {
          inputModel: '=',
          outputModel: '=',
          multiSelect: '=?',
          onSelectionChanged: '&',
          canSelectItem: '&'
        },
        link: function (scope, element, attrs) {
          if (attrs.canSelectItem) {
            scope.useCanSelectItemCallback = true;
          }

          scope.$watch('filterKeyword', function () {
            if (scope.filterKeyword !== undefined) {
              filterTree(scope.inputModel);
            }
          });

          function filterTree(itemArray) {
            //TODO: do it for recursive.
            angular.forEach(itemArray, function (item) {
              if (item.name.toLowerCase().indexOf(scope.filterKeyword.toLowerCase()) !== -1) {
                item.isFiltered = false;
              } else {
                item.isFiltered = true;
              }
            });
          }
        },
        controller: 'multiSelectTreeCtrl'
      };
    });
}());