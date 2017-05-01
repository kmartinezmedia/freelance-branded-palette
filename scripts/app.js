(function(){
  'use strict';
  angular.module('brandedPalette', [
    'ngAnimate',
    'ui.router',
    'ngLodash',
    'ngDialog',
    'app.controllers',
    'parse.services',
    'app.services',
    'LocalStorageModule'
  ])
  .run(['$rootScope', '$state', '$templateCache', 'ParseService', '$window',
    function ($rootScope, $state, $templateCache, ParseService, $window) {

    $rootScope.$on("$stateChangeSuccess", function(event, toState){
      $rootScope.$emit('stateChange', toState);
      $window.scrollTo(0,0);
    });
    $rootScope.$on("$stateChangeError", function(event, toState){
     console.log(event);
    });
    $templateCache.put('imageModal', 'views/Gallery/modal.html');
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'ngDialogProvider','localStorageServiceProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, ngDialogProvider, localStorageServiceProvider) {
    localStorageServiceProvider
    .setPrefix('storage')
    .setNotify(true, true);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: true,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
    $stateProvider
    .state('app', {
      url: '/',
      abstract: true,
      resolve: {
        cart: function(CartService){
          CartService.setRootScopeCart();
        },
        brands : function(BrandService){
          var brandsArray = [];
          return BrandService.all().then(function(brands) {
            angular.forEach(brands, function(brand){
              var brandObj = {};
              brandObj.name = brand.attributes.name;
              brandObj.id = brand.id;
              if (!brand.attributes.hasOwnProperty('logo')){
                brandObj.image = "img/no_product_image.svg";
              } else {
                brandObj.image = brand.attributes.logo._url;
              }
              brandsArray.push(brandObj);
              // brandsArray.push(brand.attributes);
            })
            return brandsArray;
          });
        },
        categories: function(CategoryService){
          var categoriesArray = [];
          return CategoryService.all().then(function(categories) {
            angular.forEach(categories, function(category){
              var categoryObj = {};
              categoryObj.data = category.attributes;
              categoryObj.id = category.id;
              categoriesArray.push(categoryObj);
              if (!category.attributes.hasOwnProperty('image')){
                categoryObj.image = "img/no_product_image.svg";
              } else {
                categoryObj.image = category.attributes.image._url;
              }
            })
            return categoriesArray;
          });
        },
        products: function(ProductService){
          var productsArray = [];
          return ProductService.all().then(function(products) {
            angular.forEach(products, function(product){
              var productObj = {};
              productObj.data = product.attributes;
              productObj.id = product.id;
              productsArray.push(productObj);
              if (!product.attributes.hasOwnProperty('image')){
                productObj.image = "img/no_product_image.svg";
              } else {
                productObj.image = product.attributes.image._url;
              }
            })
            return productsArray;
          });
        },
        isMobile: function(MenuService){
          return MenuService.isMobile();
        }
      },
      views: {
        'menu': {
          templateUrl: "views/menu.html",
          controller: function ($scope, $state, lodash, categories, products, $rootScope, isMobile) {
            $scope.isMobile = isMobile;
            $scope.windowWidth = window.innerWidth;
            $scope.currentState = $state.current;
            $rootScope.$on('stateChange', function(event, newState){
               $scope['open_'+ $scope.activeMenuItem] = false;
               lodash.defer(function(){
                $scope.currentState = newState;
                $scope.$apply();
                if (newState.name == "app.category"){
                  $scope.currentState.name = "app.categories";
                } else if (newState.name == "app.product"){
                  $scope.currentState.name = "app.products";
                }
              })
            })
            if ($state.current.name == "app.category"){
              $scope.currentState.name = "app.categories";
            }else if ($state.current.name == "app.product"){
                $scope.currentState.name = "app.products";
            }
            $scope.menuItems = [];
            $scope.openPopover = function(index){
              // event.stopPropagation();
              $scope['open_'+ $scope.activeMenuItem] = false;
              $scope.activeMenuItem = index;
              $scope['open_'+ index] = true;
              event.stopPropagation();
            }
            $scope.closePopover = function(){
              $scope['open_'+ $scope.activeMenuItem] = false;
            }
            $scope.goTo = function(menu, sub){
              if (sub != null){
                $state.transitionTo(menu.subRoute, {id: sub});
              } else {
                $state.transitionTo(menu.name);
              }
            }
            $scope.getMenu = function(){
              var states = JSON.parse(angular.toJson($state.get()));
              angular.forEach(states, function(state){
                if (state.hasOwnProperty('abstract')|| state.data.hasOwnProperty('abstract')){
                  return;
                } else {
                  var menuItem = {label: state.data.label, url: state.url, name: state.name};
                  if ( state.url === "categories"){
                    menuItem.hasSubs = true;
                    menuItem.sub = categories;
                    menuItem.subRoute = "app.category";
                  } else if (state.url === "products") {
                    menuItem.hasSubs = true;
                    menuItem.sub = products;
                    menuItem.subRoute = "app.product";
                  } else {
                    menuItem.hasSubs = false;
                  }
                  $scope.menuItems.push(menuItem);
                }
              })
            }
            $scope.getMenu();
          }
        }
      }
    })
    .state('app.home', {
      url: "home",
      views: {
        'app': {
          templateUrl: "views/home.html",
          controller: function($scope, brands){
            console.log(brands);
            $scope.brands = brands;
            
          }
        }
      },
      data: {
        label: 'Home'
      }
    })
    .state('app.categories', {
      url: "categories",
      views: {
        'app': {
          templateUrl: "views/categories.html",
          controller: function($scope, categories, $state){
            $scope.categories = categories;
          }
        }
      },
      data: {
        label: 'Categories'
      }
    })
    .state('app.category', {
      url: "categories/:id",
      views: {
        'app': {
          templateUrl: "views/category.html",
          resolve: {
            category: function(CategoryService, $stateParams){
              return CategoryService.getById($stateParams.id).then(function(category) {
                return category[0];
              });
            },
            products: function(ProductService, $stateParams){
              var productsArray = [];
              return ProductService.getInCategory($stateParams.id).then(function(products) {
                angular.forEach(products, function(product){
                  var productObj = {};
                  productObj.name = product.attributes.name;
                  productObj.id = product.id;
                  if (!product.attributes.hasOwnProperty('image')){
                    productObj.image = "img/no_product_image.svg";
                  } else {
                    productObj.image = product.attributes.image._url;
                  }
                  productsArray.push(productObj);
                })
                return productsArray;
              });
            }
          },
          controller: function($scope, products, category, $rootScope, $state){
            $scope.products = products;
            $scope.category = category;
            $rootScope.$on('stateChange', function(event, newState){
              if ($state.current.url == "categories/:id"){
                $rootScope.activeSub = category.id;
              } else {
                $rootScope.activeSub = null;
              }
            })
            if ($state.current.url == "categories/:id"){
              $rootScope.activeSub = category.id;
            }

          }
        }
      },
      data: {
        abstract: true
      }
    })
    .state('app.products', {
      url: "products",
      views: {
        'app': {
          templateUrl: "views/products.html",
          controller: function($scope, products, brands){
            $scope.products = products;
            $scope.brands = brands;
          }
        }
      },
      data: {
        label: 'Products'
      }
    })
    .state('app.product', {
      url: "products/:id/:brandId/:quantity",
      views: {
        'app': {
          templateUrl: "views/product.html",
          resolve:{
            product: function($stateParams, ProductService){
              return ProductService.getById($stateParams.id).then(function(product) {
                return product[0];
              });
            },
            category: function(product, CategoryService){
              return CategoryService.getById(product.category.id).then(function(category) {
                return category[0];
              });
            },
            productImages: function(product, ProductImageService, BrandService){
              var productImagesArray = [];
              return ProductImageService.getAllProductImagesForAllBrands(product.id).then(function(productImages) {
                angular.forEach(productImages, function(productImage){
                  var productImageObj = {};
                    productImageObj.brandId = productImage.attributes.brand.id;
                    productImageObj.id = productImage.id;
                    productImageObj.name = product.attributes.name;
                    productImageObj.price = product.attributes.price;
                    productImageObj.image = productImage.attributes.image._url;
                    productImageObj.productId = product.id;
                    productImagesArray.push(productImageObj);
                  })
                return productImagesArray;
              });
            },
            productsWithBrandInfo: function(productImages, BrandService){
              var productWithBrandsArray = [];
              return angular.forEach(productImages, function(product){
                var productBrandImageObj = product;
                return BrandService.getById(product.brandId).then(function(brand) {
                  productBrandImageObj.brandName = brand[0].attributes.name;
                  productWithBrandsArray.push(productBrandImageObj);
                })
                return productWithBrandsArray;
              })
            },
            allProducts: function(product, productsWithBrandInfo){
              var allProducts = [];
              var productObject = {};
              productObject.productId = product.id;
              productObject.brandId = 0;
              productObject.name = product.attributes.name;
              productObject.price = product.attributes.price;
              productObject.brandName = "Select a brand:";
              if (!product.attributes.hasOwnProperty('image')){
                productObject.image = "img/no_product_image.svg";
              } else {
                productObject.image = product.attributes.image._url;
              }
              allProducts.push(productObject);
              if (productsWithBrandInfo.length > 0){
                return allProducts.concat(productsWithBrandInfo)
              } else {
                return allProducts;
              }
               
            },
            selectedBrandIndex: function(allProducts, $stateParams, lodash){
              if (!$stateParams.brandId ||  $stateParams.brandId && $stateParams.brandId == 0){
                return 0;
              } else {
                return lodash.findIndex(allProducts, { 'brandId': $stateParams.brandId});
              }
            },
            quantityOptions: function(){
              return [1000, 1250, 1500];
            },
            selectedQuantityIndex: function($stateParams, lodash, quantityOptions){
              if ($stateParams.quantity){
                var quantityParams = parseInt($stateParams.quantity);
                return lodash.indexOf(quantityOptions, quantityParams);
              } else {
                return 0;
              }
            },
            productsInCategory: function(ProductService, product){
              var productsArray = [];
              return ProductService.getInCategory(product.attributes.category.id).then(function(products) {
                angular.forEach(products, function(categoryProduct){
                  if (categoryProduct.id == product.id){
                    return;
                  }
                  var productObj = {};
                  productObj.name = categoryProduct.attributes.name;
                  productObj.id = categoryProduct.id;
                  if (categoryProduct.attributes.hasOwnProperty('image')){
                    productObj.image = categoryProduct.attributes.image._url
                  } else {
                    productObj.image = "img/no_product_image.svg";
                  }
                  productsArray.push(productObj);
                })
                return productsArray;
              });
            }
          },
          controller: function($scope,$rootScope, $state, category, allProducts, selectedBrandIndex, quantityOptions, selectedQuantityIndex, CartService, productsInCategory, brands){
            $scope.overlayBrands = {
              selected: null,
              brands: brands
            };
            console.log(brands);
            $scope.quantity = {
              selected: quantityOptions[selectedQuantityIndex],
              quantityOptions: quantityOptions
            };
            $scope.brandDropdown = {
              selected: allProducts[selectedBrandIndex],
              brands: allProducts
            };

            $scope.product = allProducts[0];
            $scope.productsInCategory = productsInCategory;
            $scope.category = category;

            $scope.addToCart = function(product){
              //clone product object so we can change brandName to N/A
              var cartObject = (JSON.parse(JSON.stringify(product)));
              cartObject.quantity = $scope.quantity.selected;
              if (cartObject.brandId == 0){
                cartObject.brandName = "N/A";
              }
              CartService.addToCart(cartObject);
            }
            $scope.$watch('brandDropdown.selected', function(newValue){
              // console.log(newValue);
            })
            $rootScope.$on('stateChange', function(event, newState){
              if ($state.current.url == "products/:id/:brandId"){
                $rootScope.activeSub = product.id;
              } else {
                $rootScope.activeSub = null;
              }
            })
            if ($state.current.url == "products/:id/:brandId"){
              $rootScope.activeSub = product.id;
            }
          }
        }
      },
      data: {
        abstract: true
      }
    })
    .state('app.checkout', {
      url: "checkout",
      views: {
        'app': {
          templateUrl: "views/checkout.html",
          controller: function($scope, $rootScope, lodash){
            $rootScope.$watch('cart', function(newValue){
              calculateTotal();
            })
            function calculateTotal(){
              $scope.total = 0;
              angular.forEach($rootScope.cart, function(product){
                $scope.total += product.price*product.quantity;
              })
            }
            $scope.removeFromCart = function(product){
              var index = lodash.findIndex($rootScope.cart, { 'id': product.id});
              console.log(index);
              $rootScope.cart.splice(index,1);
              calculateTotal();
            }
            calculateTotal();
          }
        }
      },
      data: {
        label: 'Account'
      }
    })
    $urlRouterProvider.otherwise("/home");
  }])
  .controller('FormController', ['$scope', '$http', function($scope, $http) {
    $scope.input= {};
    $scope.submitForm = function() {
        // Posting data to php file
      var validity = $scope.form.$valid;
      if (validity == false){
        $scope.invalidForm = "Form is invalid";
      } else {
        $http({
          method  : 'POST',
          url     : 'mailer.php',
          data    : $scope.input, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
        .success(function(data) {
          if (data.errors) {
            // Showing errors.
            $scope.errorName = data.errors.name;
            $scope.errorEmail = data.errors.email;
            $scope.errorMessage = data.errors.message;
          } else {
            $scope.successMessage = data.successMessage;
          }
        });
      }
    };
}])
  .filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
})
.filter('capitalize', function() {
  return function(input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
})
.directive('ngBackground', function(){
    return function(scope, element, attrs){

      attrs.$observe("ngBackground",function(n,o){
         if(!n) return;
         element.css({
          'background-image': 'url(' + n + ')',
          'background-size' : 'cover'
        });

      },true);

    };
  })
})();
