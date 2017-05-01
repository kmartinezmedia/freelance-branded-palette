(function(){
	'use strict';
	angular.module('app.controllers')
	.controller('GalleryCtrl', ['$scope', 'Instagram', 'ngDialog', function ($scope, Instagram, ngDialog) {

	  Instagram.getPics().then(function(resp){
	  	$scope.instagrams = resp.data.data;
	  	console.log($scope.instagrams);
	  });
		$scope.openModal = function (image) {
			$scope.image = image;
	    ngDialog.open({
		    template: 'views/Gallery/modal.html',
		    scope: $scope,
		    plain: false
			});
	  };
	}])
	.factory("Instagram", ['$http', 'lodash', function($http, lodash) {
		var instagram = {};
		var endpoint = "https://api.instagram.com/v1/users/48552872/media/recent/?&client_id=f7e31a4b63a54b03b299b0aabb9a5c2b&callback=JSON_CALLBACK";
		var pics = [];
		instagram.getPics = function(){
			return $http.jsonp(endpoint).success(function (data) {
	      pics = data.data;
	      if (data.pagination.hasOwnProperty('next_max_id')){
					return instagram.getRemainingPhotos(data.pagination.next_max_id).then(function(res){
						return res;
					});
				} else {
					return lodash.flattenDeep(pics);
				}
	    });
		};
		instagram.getRemainingPhotos = function(max_id){
			var endpoint2 = "https://api.instagram.com/v1/users/48552872/media/recent/?&max_id=" + max_id + "&client_id=f7e31a4b63a54b03b299b0aabb9a5c2b&callback=JSON_CALLBACK";
			return $http.jsonp(endpoint2).success(function (data2) {
				angular.forEach(data2.data, function(pic){
					pics.push(pic);
				});
				if (data2.pagination.hasOwnProperty('next_max_id')){
					return instagram.getRemainingPhotos(data2.pagination.next_max_id);
				} else {
					return lodash.flattenDeep(pics);
				}
			});
		};
		return instagram;

	}]);
})();