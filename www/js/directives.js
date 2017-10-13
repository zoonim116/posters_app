// angular.module('starter')
//   .directive('tabsSwipable', ['$ionicGesture', function($ionicGesture, $rootScope) {
//     return {
//       restrict: 'A',
//       require: 'ionTabs',
//       link: function(scope, elm, attrs, tabsCtrl, $rootScope) {
//         var onSwipeLeft = function() {
//           var target = tabsCtrl.selectedIndex() + 1;
//           scope.direction = true;
//           if (target < tabsCtrl.tabs.length) {
//             scope.$apply(tabsCtrl.select(target));
//           }
//           scope.$apply();
//         };
//         var onSwipeRight = function() {
//           var target = tabsCtrl.selectedIndex() - 1;
//           scope.direction = false;
//
//           if (target >= 0) {
//             scope.$apply(tabsCtrl.select(target));
//           }
//           scope.$apply();
//         };
//
//         var swipeGesture = $ionicGesture.on('swipeleft', onSwipeLeft, elm)
//           .on('swiperight', onSwipeRight);
//         // scope.$on('$destroy', function() {
//         //   $ionicGesture.off(swipeGesture, 'swipeleft', onSwipeLeft);
//         //   $ionicGesture.off(swipeGesture, 'swiperight', onSwipeRight);
//         // });
//       }
//     };
//   }])
//   .directive('tabsAnimation', function(){
//     return {
//       restrict: 'A',
//       require: 'ionNavView',
//       link: function(scope, elm, attrs, tabsCtrl) {
//           scope.direction = "saD";
//           scope.$apply();
//       }
//     }
//   });
