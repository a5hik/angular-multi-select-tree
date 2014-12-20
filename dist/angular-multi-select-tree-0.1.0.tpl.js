angular.module('multi-select-tree').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/multi-select-tree.tpl.html',
    "<div class=\"tree-control\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"btn tree-input\" ng-click=\"onControlClicked($event)\">\r" +
    "\n" +
    "    <span ng-if=\"selectedItems.length == 0\" class=\"selected-items\">\r" +
    "\n" +
    "      <span ng-bind=\"defaultLabel\"></span>\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "    <span ng-if=\"selectedItems.length > 0\" class=\"selected-items\">\r" +
    "\n" +
    "      <span ng-repeat=\"i in selectedItems\" class=\"selected-item\">{{i.name}} <span class=\"selected-item-close\"\r" +
    "\n" +
    "                                                                                  ng-click=\"deselectItem(i, $event)\"></span></span>\r" +
    "\n" +
    "        <span class=\"caret\"></span>\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "        <!-- <input type=\"text\" class=\"blend-in\" /> -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"tree-view\" ng-show=\"showTree\">\r" +
    "\n" +
    "        <div class=\"helper-container\">\r" +
    "\n" +
    "            <!-- <div class=\"line\" >\r" +
    "\n" +
    "                 <button type=\"button\" ng-click=\"select( 'none', $event );\" class=\"helper-button\">×&nbsp; Select None</button>\r" +
    "\n" +
    "                 <button type=\"button\" ng-click=\"select( 'reset', $event );\" class=\"helper-button\">↶&nbsp; Reset</button>\r" +
    "\n" +
    "             </div>-->\r" +
    "\n" +
    "            <div class=\"line\">\r" +
    "\n" +
    "                <input placeholder=\"Search...\" type=\"text\" ng-model=\"filterKeyword\" ng-click=\"onFilterClicked($event)\"\r" +
    "\n" +
    "                       class=\"input-filter\">\r" +
    "\n" +
    "                <span class=\"clear-button\" ng-click=\"clearFilter($event)\">×</span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <ul class=\"tree-container\">\r" +
    "\n" +
    "            <tree-item class=\"top-level\" ng-repeat=\"item in inputModel\" item=\"item\" ng-show=\"!item.isFiltered\"\r" +
    "\n" +
    "                       use-callback=\"useCallback\" can-select-item=\"canSelectItem\"\r" +
    "\n" +
    "                       multi-select=\"multiSelect\" item-selected=\"itemSelected(item)\"\r" +
    "\n" +
    "                       on-active-item=\"onActiveItem(item)\"></tree-item>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/tree-item.tpl.html',
    "<li>\r" +
    "\n" +
    "    <div class=\"item-container\" ng-class=\"{active: item.isActive, selected: item.selected}\"\r" +
    "\n" +
    "         ng-click=\"clickSelectItem(item, $event)\" ng-mouseover=\"onMouseOver(item, $event)\">\r" +
    "\n" +
    "        <span ng-if=\"showExpand(item)\" class=\"expand\" ng-class=\"{'expand-opened': item.isExpanded}\"\r" +
    "\n" +
    "              ng-click=\"onExpandClicked(item, $event)\"></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"item-details\"><input class=\"tree-checkbox\" type=\"checkbox\" ng-if=\"showCheckbox()\"\r" +
    "\n" +
    "                                         ng-checked=\"item.selected\"/>{{item.name}}\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <ul ng-repeat=\"child in item.children\" ng-if=\"item.isExpanded\">\r" +
    "\n" +
    "        <tree-item item=\"child\" item-selected=\"subItemSelected(item)\" use-callback=\"useCallback\"\r" +
    "\n" +
    "                   can-select-item=\"canSelectItem\" multi-select=\"multiSelect\"\r" +
    "\n" +
    "                   on-active-item=\"activeSubItem(item, $event)\"></tree-item>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</li>\r" +
    "\n"
  );

}]);
