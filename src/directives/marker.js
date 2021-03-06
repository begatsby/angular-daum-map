(function (window, angular, daum, undefined) {
  'use strict';

  angular.module('angularDaumMap')
    .directive('daumMarker', function () {
      return {
        scope: {
          position: '=position',
          icon: '=icon',
          click: '&click',
          zIndex: '=zIndex',
          events: '=events'
        },
        restrict: 'E',
        require: '^daumMap',
        transclude: true,
        replace: true,
        template: '<span class="angular-daum-map-marker" ng-transclude></span>',
        link: function (scope, element, attrs, mapCtrl) {
          if (scope.position.lat && scope.position.lng) {
            scope.position.latitude = scope.position.lat;
            scope.position.longitude = scope.position.lng;
          }
          var marker = new daum.maps.Marker({
            position: new daum.maps.LatLng(scope.position.latitude, scope.position.longitude),
            image: (scope.icon) ? new daum.maps.MarkerImage(scope.icon.image, new daum.maps.Size(scope.icon.width, scope.icon.height)) : null
          });

          scope.$watch(function () {
            return mapCtrl.getMap();
          }, function (map) {
            marker.setMap(map);
            scope.map = map;
          });
          scope.$on('$destroy', function () {
            marker.setMap(null);
          });
          scope.$watch('position', function () {
            marker.setPosition(new daum.maps.LatLng(scope.position.latitude, scope.position.longitude));
          });
          scope.$watch('icon', function (newValue) {
            if(typeof newValue !== 'undefined' && newValue !== null) {
              marker.setImage(new daum.maps.MarkerImage(newValue.image, new daum.maps.Size(newValue.width, newValue.height)));
            }
          });
          scope.$watch('zIndex', function () {
            if (scope.zIndex) {
              marker.setZIndex(scope.zIndex);
            }
          });

          if (angular.isDefined(scope.events) && scope.events !== null && angular.isArray(scope.events)) {
            angular.forEach(scope.events, function (event) {
              if (angular.isFunction(event.handler)) {
                var data = { scope: scope, element: element, attrs: attrs };
                daum.maps.event.addListener(marker, event.name, function () {
                  return event.handler.apply(scope, [data, event.name, arguments]);
                });
              }
            });
          }

        },
        controller: function ($scope) {
          angular.extend(this, {
            getMarkerPosition: function () {
              return $scope.position;
            },
            getMap: function () {
              return $scope.map;
            }
          });
        }
      };
    });

})(window, window.angular, window.daum);
