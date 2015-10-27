(function (window, angular, daum, undefined) {
  'use strict';

  angular.module('angularDaumMap')
    .directive('daumPolyline', function () {
      return {
        scope: {
          path: '=',
          strokeWeight: '=',
          strokeColor: '=',
          strokeOpacity: '=',
          fillColor: '=',
          fillOpacity: '='
        },
        restrict: 'E',
        require: '^daumMap',
        transclude: false,
        replace: true,
        template: '<span class="angular-daum-map-polyline"></span>',
        link: function (scope, element, attrs, mapCtrl) {
          var path = [];
          angular.forEach(scope.path, function (position) {
            if (position.lat && position.lng) {
              position.latitude = position.lat;
              position.longitude = position.lng;
            }
            path.push(new daum.maps.LatLng(position.latitude, position.longitude));
          });
          var polyline = new daum.maps.Polyline({
            path: path,
            strokeWeight: (scope.strokeWeight || 4),
            strokeColor: (scope.strokeColor || '#FF0000'),
            strokeOpacity: (scope.strokeOpacity || 0.5),
            fillColor: (scope.fillColor || '#FF0000'),
            fillOpacity: (scope.fillOpacity || 0.5)
          });

          scope.$watch(function () {
            return mapCtrl.getMap();
          }, function (map) {
            polyline.setMap(map);
            scope.map = map;
          });

          if (angular.isDefined(scope.events) && scope.events !== null && angular.isArray(scope.events)) {
            angular.forEach(scope.events, function (event) {
              if (angular.isFunction(event.handler)) {
                var data = { scope: scope, element: element, attrs: attrs };
                daum.maps.event.addListener(polyline, event.name, function () {
                  return event.handler.apply(scope, [data, event.name, arguments]);
                });
              }
            });
          }

          scope.$on('$destroy', function () {
            polyline.setMap(null);
          });
        },
        controller: function ($scope) {
          angular.extend(this, {
            getMap: function () {
              return $scope.map;
            }
          });
        }
      };
    });

})(window, window.angular, window.daum);
