angular.module('author.component-name', ['ng']);

angular.module('author.component-name').factory('thingService', function () {
  return {
    sayHello: function () {
      return 'Hello!';
    }
  };
});
