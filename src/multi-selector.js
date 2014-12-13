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

    function docClickHide() {
      closePopup();
      $scope.$apply();
    }

    function closePopup() {
      $scope.showTree = false;
      if (activeItem) {
        activeItem.isActive = false;
        activeItem = undefined;
      }
      $document.off('click', docClickHide);
      $document.off('keydown', keyboardNav);
    }

    function findItemOwnerAndParent(item, array, parentArray, parentIndex) {
      var itemIndex = array.indexOf(item);
      if (itemIndex > -1) {
        return {currentArray: array, parentArray: parentArray, parentIndex: parentIndex, itemIndex: itemIndex };
      }
      var newArray;
      for (var i = 0; i < array.length; i++) {
        if (array[i].children && array[i].children.length > 0) {
          newArray = findItemOwnerAndParent(item, array[i].children, array, i);
          if (newArray) {
            break;
          }
        }
      }
      return newArray;
    }

    function findLowestExpandedItem(item) {
      var c = item.children[item.children.length - 1];
      if (c.isExpanded) {
        return findLowestExpandedItem(c);
      }
      return c;
    }

    /*
     * Get the next or previous item from a item in the tree
     */
    function getNextItem(down, item, array) {
      var itemData = findItemOwnerAndParent(item, array);

      if (down) {
        if (item.isExpanded) {
          // go down the branch
          return item.children[0];
        }
        if (itemData.itemIndex < itemData.currentArray.length - 1) {
          // next item at this level
          return itemData.currentArray[itemData.itemIndex + 1];
        }
        if (itemData.itemIndex === itemData.currentArray.length - 1 && itemData.parentArray && itemData.parentIndex < itemData.parentArray.length - 1) {
          // Next item up a level
          return itemData.parentArray[itemData.parentIndex + 1];
        }
      } else {
        if (itemData.itemIndex > 0) {
          // previous item at this level
          var previousAtSameLevel = itemData.currentArray[itemData.itemIndex - 1];
          if (previousAtSameLevel.isExpanded) {
            // find the lowest item
            return findLowestExpandedItem(previousAtSameLevel);
          }
          return previousAtSameLevel;
        }
        if (itemData.itemIndex === 0 && itemData.parentArray) {
          // go to parent
          return itemData.parentArray[itemData.parentIndex];
        }
      }

      return item;
    }

    function changeActiveItem(down) {
      var idx;
      if (!activeItem) {
        // start at the top or bottom
        idx = down ? 0 : $scope.data.length - 1;
        $scope.onActiveItem($scope.data[idx]);
      } else {
        $scope.onActiveItem(getNextItem(down, activeItem, $scope.data));
      }
      $scope.$apply();
    }

    // handle keyboard navigation
    function keyboardNav(e) {
      switch (e.keyCode) {
      // ESC closes
      case 27:
        e.stopPropagation();
        closePopup();
        $scope.$apply();
        break;
      // space/enter - select item
      case 32:
      case 13:
        e.stopPropagation();
        if (activeItem) {
          $scope.itemSelected(activeItem);
          $scope.$apply();
        }
        break;
      // down arrow - move down list (next item, child or not)
      case 40:
        e.stopPropagation();
        changeActiveItem(true);
        break;
      // up arrow - move up list (previous item, child or not)
      case 38:
        e.stopPropagation();
        changeActiveItem(false);
        break;
      // left arrow - colapse node if open
      case 37:
        e.stopPropagation();
        if (activeItem) {
          activeItem.isExpanded = false;
          $scope.$apply();
        }
        break;
      // right arrow - expand node if has children
      case 39:
        e.stopPropagation();
        if (activeItem) {
          activeItem.isExpanded = true;
          $scope.$apply();
        }
        break;
      }
    }

    $scope.onActiveItem = function (item) {
      if (activeItem !== item) {
        if (activeItem) {
          activeItem.isActive = false;
        }
        activeItem = item;
        activeItem.isActive = true;
      }
    };

    $scope.deselectItem = function (item, $event) {
      $event.stopPropagation();
      $scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
      closePopup();
      item.selected = false;
      if ($scope.onSelectionChanged) {
        $scope.onSelectionChanged({items: $scope.selectedItems.length ? $scope.selectedItems : undefined});
      }
    };

    $scope.onControlClicked = function ($event) {
      $event.stopPropagation();
      if (!$scope.showTree) {
        $scope.showTree = true;

        $document.on('click', docClickHide);
        $document.on('keydown', keyboardNav);
      }
    };

    $scope.itemSelected = function (item) {
      if (($scope.useCanSelectItemCallback && $scope.canSelectItem({item: item}) === false) || ($scope.selectOnlyLeafs && item.children && item.children.length > 0)) {
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

      if ($scope.onSelectionChanged) {
        $scope.onSelectionChanged({items: $scope.selectedItems.length ? $scope.selectedItems : undefined});
      }
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
          data: '=',
          multiSelect: '=?',
          onSelectionChanged: '&',
          selectOnlyLeafs: '=?',
          canSelectItem: '&'
        },
        link: function (scope, element, attrs) {
          if (attrs.canSelectItem) {
            scope.useCanSelectItemCallback = true;
          }
        },
        controller: 'multiSelectTreeCtrl'
      };
    });
}());