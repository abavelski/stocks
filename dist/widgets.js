/*! widgets - v0.0.1-SNAPSHOT - 2014-11-27 */
angular.module('app', [ 'templates.app', 'templates.common', 'security','layouts', 'widget', 'widgets'])

.controller('AppCtrl', ['$scope', function($scope) {}])

.controller('HeaderCtrl', function ($scope, $location, security) {
  		$scope.isActive = function(str){ return $location.path().search(str)>-1; };
  		$scope.isAuthenticated = security.isAuthenticated;
  		$location.path('/instruments');
})
.run(function(security, $window){
	$window.addToHomescreen();
	security.updateCurrentUser();
})
angular.module('widgets.assetoverview', [])

.controller('AssetOverviewCtrl', function($scope, $http, $routeParams, ngTableParams){
  $scope.tableParams = new ngTableParams({
        page: 1,            
        count: 10           
    }, {
        getData: function($defer, params) {
            $http.get('/auth/custodies/'+$routeParams.id).success(function(data){
              $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });            
        }
    });
});
angular.module('widgets.cashaccounts', ['storage'])

.controller('CashAccountsCtrl', function($scope, $http, storage, ngTableParams){
  $scope.cashAccounts = storage.getCashAccounts();
  $scope.cashAccount = {
    currency : 'DKK'
  };
  $scope.tableParams = new ngTableParams({
    count: $scope.cashAccounts.length 
    },{
    counts: [] 
    });
  $scope.addCashAccount = function() {
  	if (!$scope.cashAccount.name) {
  		$scope.error = "Name should not be empty";
  		return;
  	}
    $http.post('/auth/cash-account', $scope.cashAccount)
        .success(function(cashAccount) {
                console.log(cashAccount);
                $scope.cashAccounts.push(cashAccount)
                storage.addCashAccount(cashAccount);
                $scope.cashAccount = { currency: 'DKK'};
            })
            .error(function(err) {
                    $scope.error = err.error;
            });
  }

  $scope.isAddCashAccountAllowed = function() {
  	return $scope.cashAccounts.length<5;
  }
});
angular.module('widgets.custodies', ['storage'])

.controller('CustodiesCtrl', function($scope, $http, storage, ngTableParams){
  $scope.custody = {};
  $scope.custodies = storage.getCustodies();  
  $scope.custodiesTotal = 0;
  $scope.tableParams = new ngTableParams({
        page: 1,            
        count: 5
    }, {
        total : 5,
        counts : [],
        getData: function($defer, params) {
          var custodies = storage.getCustodies();  
          $http.get('/auth/instruments').success(function(instruments) {
          console.log(instruments);
          custodies = custodies.map(function(custody) {
                custody.total = 0;
                for( var i =0; i<custody.holdings.length; i++) {
                  var instr = instruments[custody.holdings[i].symbol];
                  custody.total+=(instr.lastTradePrice*custody.holdings[i].amount);
                }
                $scope.custodiesTotal+=custody.total;
                return custody;
              });
          $defer.resolve(custodies);
          });            
        }
    });

  $scope.addCustody = function() {
  	if (!$scope.custody.name) {
  		$scope.error = "Name should not be empty";
  		return;
  	}
    $http.post('/auth/custody', $scope.custody)
        .success(function(custody) {
                console.log(custody);
                $scope.custodies.push(custody)
                storage.addCustody(custody);
                $scope.custody = {};
            })
            .error(function(err) {
                    $scope.error = err.error;
            });
  }

  $scope.isAddCustodyAllowed = function() {
  	return $scope.custodies.length<5;
  }
});
angular.module('widgets.custodyselector', ['storage'])

.controller('CustodySelectorCtrl', function($scope, storage, $routeParams){
  $scope.custodies = storage.getCustodies();
  
  $scope.custodies.unshift({_id: 'ALL', name: 'ALL'});
  $scope.custody = $scope.custodies[0];
    
  $scope.custodies.forEach(function(custody){
    if (custody._id==$routeParams.id) {
      $scope.custody = custody;
    }
  });

  $scope.status = {
    isopen: false
  };


});
angular.module('widgets.graph', [])

.directive('graph', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          scope.getData(function(data){
            element.highcharts('StockChart', {
              credits: {
                enabled: false
              },
              series : [{
                name : 'Stock',
                data : data
              }]
            });
          });
      }
    }
})

.controller('GraphCtrl', function($scope, $http, $routeParams){
  $scope.getData = function(callback) {
    $http.get('/api/companies/history/'+$routeParams.symbol).success(callback);
  }

});
angular.module('widgets', [
  'widgets.graph',
  'widgets.instrumentlist',
  'widgets.search',
  'widgets.stockinfo',
  'widgets.register',
  'widgets.custodies',
  'widgets.cashaccounts',
  'widgets.assetoverview',
  'widgets.tradeflow',
  'widgets.custodyselector']);
angular.module('widgets.instrumentlist', [])

.controller('InstrumentListCtrl', function($scope, $http, ngTableParams){
  $scope.tableParams = new ngTableParams({
        page: 1,            
        count: 10           
    }, {
        getData: function($defer, params) {
            $http.get('/api/companies').success(function(data){
              $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });            
        }
    });
});
angular.module('widgets.register', [])
    .controller('RegisterUserCtrl', function ($scope, $http, $location, security) {
        $scope.user = {};
        $scope.register = function() {
            $http.post('/api/register', $scope.user)
            .success(function(data) {
                $location.path('/registerok');
            })
            .error(function(err) {
                    $scope.error = err.error;
            });
        };
    });


angular.module('widgets.search', ['ui.bootstrap.typeahead', 'ui.bootstrap.tpls'])

.controller('SearchCtrl', function ($scope, $http, $location) {
  $scope.getCompanies = function(val) {
    return $http.get('/api/companies/lookup/'+val).then(function(response){
      return response.data;
    });
  };

  $scope.onSelect = function (item) {
    $location.path('/instrument/'+item.symbol+'/details');
  };
});
angular.module('widgets.stockinfo', ['ngTable'])

.factory('StockInfoLabels', function() {
	return {
    	ask : "Ask",
    	bid : "Bid",
    	lastTradeDate: "Last Traded Date",
    	lastTradePrice: "Last Traded Price",
    	daysLow : "Days Low",
    	daysHigh: "Days High",
    	yearLow : "Years Low",
    	yearHigh: "Years High",
    	symbol : "Symbol",
    	name : "Name",
    	volume : "Volume",
    	exchange : "Exchange",
    	change : "Change",
    	changePercent : "Change Percent",
    	marketCap : "Market Capitalization",
    	priceBook : "Price Book",
    	yearTargetPrice : "Year Target Price"
	};
})

.controller('StockInfoCtrl', function($scope, $http, ngTableParams, $routeParams, StockInfoLabels){
  $scope.symbol = $routeParams.symbol;
  $scope.tableParams = new ngTableParams({
        count: 12           // count per page
    }, {
        total: 12, 
        counts: [],
        getData: function($defer, params) {
            $http.get('/api/companies/'+$routeParams.symbol).success(function(data){

              var result = [];
              for (var prop in data) {
                if(data.hasOwnProperty(prop)){
                result.push({name : StockInfoLabels[prop], value: data[prop]});
                }
              }
              $defer.resolve(result);
            });            
        }
    });
});
angular.module('widgets.tradeflow', ['mgo-angular-wizard', 'storage'])

.controller('TradeFlowCtrl', function($scope, WizardHandler, $routeParams, $http, storage, $location){
	$scope.instrument = {};
	$http.get('/api/companies/'+$routeParams.symbol).success(function(data){
  		$scope.instrument = data;
    }); 
    $scope.nextBtn = 'Next';
    $scope.currentStep = '';
	$scope.orderTypes = ['Instant'];
	$scope.custodies = storage.getCustodies();
	$scope.cashAccounts = storage.getCashAccounts();
	$scope.order = {
		action : $routeParams.action,
		symbol : $routeParams.symbol,
		orderType : $scope.orderTypes[0],
		custody : $scope.custodies[0],
		cashAccount : $scope.cashAccounts[0],
		amount : 1
	};
	var updateBuyTotal = function() {
		$scope.total = $scope.order.amount * $scope.instrument.ask + $scope.commission;
	};
	var updateSellTotal = function() {
		$scope.total = $scope.order.amount * $scope.instrument.bid + $scope.commission;
	};
	var updateTotal = function() {
		if ($scope.order.orderType=='buy') {
			updateBuyTotal();
		} else {
			updateSellTotal();
		}
	};
	$scope.next = function() {
		if ($scope.currentStep=='select') {
			updateTotal();
			WizardHandler.wizard().next();
		}
		if ($scope.currentStep=='confirm') {
			$scope.nextBtn = 'Finish';
			$http.post('/auth/order', $scope.order)
			 .success(function(res) {
                console.log(res);
                storage.saveUser(res);
                WizardHandler.wizard().next();
            })
            .error(function(err) {
                    $scope.error = err.error;
            });
		} 
		if ($scope.currentStep=='reciept') {
			$location.path('/home');
		}		
  		
  	};

  	$scope.commission = 29;
  	$scope.total = 0;

  
})

angular.module('layouts', ['ngRoute'])

.factory('WidgetFactory', function() {
    return {
      search : 'widgets/search/search.tpl.html',
      instrumentList : 'widgets/instrumentlist/instrumentList.tpl.html',
      graph : 'widgets/graph/graph.tpl.html',
      stockInfo : 'widgets/stockinfo/stockInfo.tpl.html',
      register : 'widgets/register/registerUser.tpl.html',
      registerOk : 'widgets/register/registerOk.tpl.html',
      custodies : 'widgets/custodies/custodies.tpl.html',
      cashAccounts : 'widgets/cashaccounts/cashaccounts.tpl.html',
      tradeFlow : 'widgets/tradeflow/tradeflow.tpl.html',
      assetOverview : 'widgets/assetoverview/assetoverview.tpl.html',
      custodySelector : 'widgets/custodyselector/custodyselector.tpl.html'
    }
})

.config( function($routeProvider) {
  var routes = {
    twelveSixSix : 'layouts/twelveSixSix.tpl.html',
    twelveZeroZero : 'layouts/twelveZeroZero.tpl.html',
    zeroSixSix : 'layouts/zeroSixSix.tpl.html'
  }
 
    var myConfig = window.myAppConfig;
      for (var i=0; i<myConfig.views.length; i++) {
      $routeProvider.when(myConfig.views[i].path, {
                            templateUrl: routes[myConfig.views[i].type], 
                            controller: 'ViewCtrl' });
                            }
      $routeProvider.otherwise({redirectTo: myConfig.views[0].path});
})

.controller('ViewCtrl', function($scope, WidgetFactory, $location, $route, $window) {
    var setupView = function(widgets) {
      if (widgets.north) {
        $scope.northItems = [];
        for (var i = 0; i < widgets.north.length; i++) {
          $scope.northItems.push(WidgetFactory[widgets.north[i]]);
        };
      }

      if (widgets.east) {
        $scope.eastItems=[];
        for (var i = 0; i < widgets.east.length; i++) {
          $scope.eastItems.push(WidgetFactory[widgets.east[i]]);
        };
      }

      if (widgets.west) {
        $scope.westItems=[];
        for (var i = 0; i < widgets.west.length; i++) {
          $scope.westItems.push(WidgetFactory[widgets.west[i]]);
        };
      }
    };
    var myViews = $window.myAppConfig.views;
    for (var i=0; i<myViews.length; i++) {
      if (myViews[i].path === $route.current.$$route.originalPath) {
        setupView(myViews[i].widgets)
      }
    }
  });
angular.module('security', [
  'security.service',
  'security.login']);

angular.module('security.login.form', [])

.controller('LoginFormController', function($scope, $modalInstance, security) {
  $scope.user = {};
  $scope.authError = null;

  $scope.login = function() {
    $scope.authError = null;

    security.login($scope.user.username, $scope.user.password, function(err) {
        console.log('err');
      if (err) {
        $scope.authError = err;
      }
    });
  };

  $scope.cancelLogin = function() {
    $modalInstance.dismiss();
  };
});

angular.module('security.login', ['security.login.form', 'security.login.toolbar']);
angular.module('security.login.toolbar', [])

.directive('loginToolbar', function(security) {
  var directive = {
    templateUrl: 'security/login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: {},
    link: function($scope) {
      $scope.isAuthenticated = security.isAuthenticated;
      $scope.login = security.showLogin;
      $scope.logout = security.logout;
      $scope.$watch(function() {
        return security.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  };
  return directive;
});
angular.module('security.service', ['security.login','ui.bootstrap', 'storage'])

.factory('security', function($http, $q, $location, $modal, storage) {

  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  var modalInstance;

  function openLoginDialog() {
      modalInstance = $modal.open({
          templateUrl: 'security/login/form.tpl.html',
          controller: 'LoginFormController'
      });
  }

  var service = {
    showLogin: function() {
      openLoginDialog();
    },

    login: function(username, password, callback) {
      $http.post('/api/login', {username: username, password: password})
          .success(function(data){
              service.currentUser = data.user.login;
              storage.saveUser(data.user);
              storage.saveToken(data.token);
              if ( service.isAuthenticated() ) {
                  modalInstance.close(true);
              }
          })
          .error(function(){
            storage.clearStorage();
            service.currentUser = null;
            callback('Invalid credentials');
          });
    },
    logout: function(redirectTo) {
      storage.clearStorage();
      service.currentUser = null;
      redirect(redirectTo);      
    },

    isAuthenticated: function(){
      return !!storage.getToken();
    },
    updateCurrentUser : function() {
      service.currentUser =  storage.getUserName();
    },
    currentUser : null
  };

  return service;
})

.factory('authInterceptor', function ($rootScope, $q, storage) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (storage.getToken()) {
        config.headers.Authorization = 'Bearer ' + storage.getToken();
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});


angular.module('storage', [])

.factory('storage', function($window) {
    var storage = {
        updateSymbols : function(instruments) {
            $window.sessionStorage.instruments = JSON.stringify(instruments);
        },
        getInstruments : function() {
            return JSON.parse($window.sessionStorage.instruments);
        },
    	saveUser : function(user) {
    		$window.sessionStorage.user = JSON.stringify(user);
          },
         saveToken : function(token) {
         	$window.sessionStorage.token = token;
         },
         clearStorage : function() {
         	delete $window.sessionStorage.user;
         	delete $window.sessionStorage.token;
         },
         getToken : function() {
         	return $window.sessionStorage.token;
         },
         getUser : function() {
         	return $window.sessionStorage.user ? JSON.parse($window.sessionStorage.user): null;
         },
         getCustodies : function() {
            var user = storage.getUser();
            var custodies = [];
            if (user) {
                custodies = user.custodyAccounts;
            } 
            return custodies;
         },
         getCashAccounts: function() {
            var user = storage.getUser();
            var cashAccounts = [];
            if (user) {
                cashAccounts = user.cashAccounts;
            } 
            return cashAccounts;
         },
         addCustody : function(custody) {
            var user = storage.getUser();
            user.custodyAccounts.push(custody);
            storage.saveUser(user);
         },         
         addCashAccount : function(cashAccount) {
            var user = storage.getUser();
            user.cashAccounts.push(cashAccount);
            storage.saveUser(user);
         },
         getUserName : function() {
         	var user = storage.getUser();
         	if (user) {
         		return user.login;
         	} else {
         		return null;
         	}
         }
    }
    return storage;
})
angular.module('widget', [])
  .directive('widget', function() {
    return {
    restrict: 'E',
    transclude: true,
    scope: { title:'@',
    		 minimizable: '=',
    		 removable: '=' 
    		},
    template:
    	'<div class="panel panel-primary">' +
			'<div class="panel-heading">' +
				'<h3 class="panel-title">{{title}}</h3>' +
				'<span class="pull-right clickable">'+
				'<i class="glyphicon {{state}}" ng-click="toggle()" ng-show="{{minimizable}}"></i>'+
				'<i class="glyphicon glyphicon-remove" ng-click="remove()" ng-show="{{removable}}"></i></span>' +
			'</div>' +
			'<div class="panel-body" ng-transclude>'+
			'</div>' +
		'</div>',
     link: function(scope, element, attrs) {
      scope.state = "glyphicon-minus";
      scope.toggle = function() {
      	if (scope.state=='glyphicon-minus') {
      		element.find('.panel-body').slideUp(function() {});
      		scope.state = 'glyphicon-plus';
      	} else {	
      		element.find('.panel-body').slideDown();
      		scope.state = 'glyphicon-minus';

      	}
      };
      scope.remove = function() {
      	element.hide();
      }
    }
    }
  });
angular.module('templates.app', ['header.tpl.html', 'widgets/assetoverview/assetoverview.tpl.html', 'widgets/assetoverview/pager.tpl.html', 'widgets/cashaccounts/cashaccounts.tpl.html', 'widgets/custodies/custodies.tpl.html', 'widgets/custodyselector/custodyselector.tpl.html', 'widgets/graph/graph.tpl.html', 'widgets/instrumentlist/instrumentList.tpl.html', 'widgets/instrumentlist/pager.tpl.html', 'widgets/register/registerOk.tpl.html', 'widgets/register/registerUser.tpl.html', 'widgets/search/search.tpl.html', 'widgets/search/typeahead.tpl.html', 'widgets/stockinfo/stockInfo.tpl.html', 'widgets/tradeflow/confirm.tpl.html', 'widgets/tradeflow/reciept.tpl.html', 'widgets/tradeflow/select.tpl.html', 'widgets/tradeflow/tradeflow.tpl.html']);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    " <div class=\"header\" ng-controller=\"HeaderCtrl\">\n" +
    " <div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n" +
    "      <div class=\"container\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "          <button type=\"button\" class=\"navbar-toggle\" ng-init=\"navCollapsed = true\" ng-click=\"navCollapsed = !navCollapsed\">\n" +
    "            <span class=\"sr-only\">Toggle navigation</span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "          </button>\n" +
    "         <!--  <a class=\"navbar-brand\" href=\"#\">Test</a> -->\n" +
    "        </div>\n" +
    "        <div class=\"collapse navbar-collapse\" ng-class=\"!navCollapsed && 'in'\" ng-click=\"navCollapsed=true\">\n" +
    "          <ul class=\"nav navbar-nav\">\n" +
    "            <li ng-class=\"{active: isActive('instruments')}\"><a href=\"#/instruments\">Instruments</a></li>\n" +
    "            <li ng-show=\"isAuthenticated()\" ng-class=\"{active: isActive('home')}\"><a id=\"home\" href=\"#/home\">Home</a></li>\n" +
    "          </ul>\n" +
    "          <login-toolbar></login-toolbar>\n" +
    "        </div><!--/.nav-collapse -->\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>  ");
}]);

angular.module("widgets/assetoverview/assetoverview.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/assetoverview/assetoverview.tpl.html",
    "<widget title=\"Instruments\" minimizable=\"true\">\n" +
    "	<div ng-controller=\"AssetOverviewCtrl\">\n" +
    "	<table ng-table=\"tableParams\" template-pagination=\"widgets/assetoverview/pager.tpl.html\" class=\"table\">\n" +
    "        <tr ng-repeat=\"holding in $data\">            \n" +
    "            <td data-title=\"'Name'\"><a href=\"#/instrument/{{holding.symbol}}/details\">{{holding.name}}</a></td>\n" +
    "            <td data-title=\"'Symbol'\">{{holding.symbol}}</td>\n" +
    "            <td data-title=\"'Last'\">{{holding.last}}</td>\n" +
    "            <td data-title=\"'Amount'\">{{holding.amount}}</td>\n" +
    "            <td data-title=\"'Avg. purchase price'\">{{holding.avgPurchasePrice}}</td>\n" +
    "        </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</widget>\n" +
    "");
}]);

angular.module("widgets/assetoverview/pager.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/assetoverview/pager.tpl.html",
    "        <ul class=\"pager ng-cloak\">\n" +
    "          <li ng-repeat=\"page in pages\"\n" +
    "                ng-class=\"{'disabled': !page.active, 'previous': page.type == 'prev', 'next': page.type == 'next'}\"\n" +
    "                ng-show=\"page.type == 'prev' || page.type == 'next'\" ng-switch=\"page.type\">\n" +
    "            <a ng-switch-when=\"prev\" ng-click=\"params.page(page.number)\" href=\"\">&laquo; Previous</a>\n" +
    "            <a ng-switch-when=\"next\" ng-click=\"params.page(page.number)\" href=\"\">Next &raquo;</a>\n" +
    "          </li>\n" +
    "        </ul>");
}]);

angular.module("widgets/cashaccounts/cashaccounts.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/cashaccounts/cashaccounts.tpl.html",
    "<widget title=\"Cash Accounts\" minimizable=\"true\">\n" +
    "	<div ng-controller=\"CashAccountsCtrl\">\n" +
    "		<div ng-show=\"error\" class=\"alert alert-danger\" role=\"alert\">{{error}}</div>\n" +
    "		<table ng-table=\"tableParams\" class=\"table\">\n" +
    "			<tr ng-repeat=\"cashAccount in cashAccounts\">\n" +
    "				<td data-title=\"'Name'\">{{cashAccount.name}}</td>\n" +
    "				<td data-title=\"'Currency'\">{{cashAccount.currency}}</td>\n" +
    "				<td data-title=\"'Balance'\">{{cashAccount.balance | number:2}}</td>\n" +
    "			</tr>\n" +
    "		</table>\n" +
    "		\n" +
    "		<div ng-show=\"isAddCashAccountAllowed()\">\n" +
    "		<h4>Add new cash account</h4>\n" +
    "		<form class=\"form-inline\" role=\"form\">\n" +
    "			<div class=\"form-group\">\n" +
    "				<label class=\"sr-only\" for=\"cashAccountName\">Name</label>\n" +
    "				<input type=\"text\" ng-model=\"cashAccount.name\" class=\"form-control\" id=\"cashAccountName\" placeholder=\"Enter cash account name\">\n" +
    "			</div>\n" +
    "			<button type=\"submit\" ng-click=\"addCashAccount()\" class=\"btn btn-default\">Add</button>\n" +
    "		</form>\n" +
    "	</div>\n" +
    "\n" +
    "	</div>	\n" +
    "\n" +
    "\n" +
    "</widget>");
}]);

angular.module("widgets/custodies/custodies.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/custodies/custodies.tpl.html",
    "<widget title=\"Custodies\" minimizable=\"true\">\n" +
    "	<div ng-controller=\"CustodiesCtrl\">\n" +
    "		<div ng-show=\"error\" class=\"alert alert-danger\" role=\"alert\">{{error}}</div>\n" +
    "		<table ng-table=\"tableParams\" class=\"table\">\n" +
    "			<tr ng-repeat=\"custody in $data\">\n" +
    "				<td data-title=\"'Name'\"><a href=\"#/assetoverview/{{custody._id}}\">{{custody.name}}</a></td>\n" +
    "				<td data-title=\"'Total'\">{{custody.total | number:2}}</td>\n" +
    "			</tr>\n" +
    "			<tr>\n" +
    "    			<td></td>\n" +
    "    			<td><b>{{custodiesTotal | number:2}}</b></td>\n" +
    "			</tr>\n" +
    "		</table>\n" +
    "		\n" +
    "		<div ng-show=\"isAddCustodyAllowed()\">\n" +
    "		<h4>Add new custody</h4>\n" +
    "		<form class=\"form-inline\" role=\"form\">\n" +
    "			<div class=\"form-group\">\n" +
    "				<label class=\"sr-only\" for=\"custodyName\">Name</label>\n" +
    "				<input type=\"text\" ng-model=\"custody.name\" class=\"form-control\" id=\"custodyName\" placeholder=\"Enter custody name\">\n" +
    "			</div>\n" +
    "			<button id=\"add-custody\" type=\"submit\" ng-click=\"addCustody()\" class=\"btn btn-default\">Add</button>\n" +
    "		</form>\n" +
    "	</div>\n" +
    "\n" +
    "	</div>	\n" +
    "\n" +
    "\n" +
    "</widget>");
}]);

angular.module("widgets/custodyselector/custodyselector.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/custodyselector/custodyselector.tpl.html",
    "<div ng-controller=\"CustodySelectorCtrl\">\n" +
    "    <!-- Single button -->\n" +
    "    <div class=\"clearfix margin-bottom-20\">\n" +
    "\n" +
    "    	    <div class=\"pull-right btn-group\" dropdown is-open=\"status.isopen\">\n" +
    "      <button type=\"button\" class=\"btn btn-primary dropdown-toggle\" ng-disabled=\"disabled\">\n" +
    "        {{custody.name}}<span class=\"caret\"></span>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "         <li ng-repeat=\"custody in custodies\">\n" +
    "          	<a href=\"#/assetoverview/{{custody._id}}\">{{custody.name}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>");
}]);

angular.module("widgets/graph/graph.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/graph/graph.tpl.html",
    "<widget title=\"Graph\" minimizable=\"true\" removable=\"true\">\n" +
    "	<div ng-controller=\"GraphCtrl\">\n" +
    "		<div graph></div>\n" +
    "	</div>\n" +
    "</widget>");
}]);

angular.module("widgets/instrumentlist/instrumentList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/instrumentlist/instrumentList.tpl.html",
    "<widget title=\"Instruments\" minimizable=\"true\">\n" +
    "	<div ng-controller=\"InstrumentListCtrl\">\n" +
    "	<table ng-table=\"tableParams\" template-pagination=\"widgets/instrumentlist/pager.tpl.html\" class=\"table\">\n" +
    "        <tr ng-repeat=\"company in $data\">\n" +
    "            <td data-title=\"'Name'\"><a href=\"#/instrument/{{company.symbol}}/details\">{{company.name}}</a></td>\n" +
    "            <td data-title=\"'Exchange'\">{{company.exchange}}</td>\n" +
    "            <td data-title=\"'Change'\">{{company.changePercent}}</td>\n" +
    "            <td data-title=\"'Bid'\">{{company.bid}}</td>\n" +
    "            <td data-title=\"'Ask'\">{{company.ask}}</td>\n" +
    "            <td data-title=\"'Last'\">{{company.lastTradePrice}}</td>\n" +
    "        </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</widget>\n" +
    "");
}]);

angular.module("widgets/instrumentlist/pager.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/instrumentlist/pager.tpl.html",
    "        <ul class=\"pager ng-cloak\">\n" +
    "          <li ng-repeat=\"page in pages\"\n" +
    "                ng-class=\"{'disabled': !page.active, 'previous': page.type == 'prev', 'next': page.type == 'next'}\"\n" +
    "                ng-show=\"page.type == 'prev' || page.type == 'next'\" ng-switch=\"page.type\">\n" +
    "            <a ng-switch-when=\"prev\" ng-click=\"params.page(page.number)\" href=\"\">&laquo; Previous</a>\n" +
    "            <a ng-switch-when=\"next\" ng-click=\"params.page(page.number)\" href=\"\">Next &raquo;</a>\n" +
    "          </li>\n" +
    "        </ul>");
}]);

angular.module("widgets/register/registerOk.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/register/registerOk.tpl.html",
    "<h2 id=\"thanks\">Thank you for registration.</h2>\n" +
    "<h2>You can login now.</h2>");
}]);

angular.module("widgets/register/registerUser.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/register/registerUser.tpl.html",
    "<div ng-controller=\"RegisterUserCtrl\">\n" +
    "<div class=\"mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2\">\n" +
    "    <div class=\"panel panel-info\">\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <div class=\"panel-title\">Sign Up</div>\n" +
    "        </div>\n" +
    "        <div class=\"panel-body\" >\n" +
    "            <div ng-show=\"error\" class=\"alert alert-danger\" role=\"alert\">{{error}}</div>\n" +
    "            <form class=\"form-horizontal\" role=\"form\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"col-md-3 control-label\">Email</label>\n" +
    "                    <div class=\"col-md-9\">\n" +
    "                        <input ng-model=\"user.email\" type=\"text\" class=\"form-control\" placeholder=\"Email Address\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"col-md-3 control-label\">First Name</label>\n" +
    "                    <div class=\"col-md-9\">\n" +
    "                        <input ng-model=\"user.firstName\" type=\"text\" class=\"form-control\" placeholder=\"First Name\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"col-md-3 control-label\">Last Name</label>\n" +
    "                    <div class=\"col-md-9\">\n" +
    "                        <input ng-model=\"user.lastName\" type=\"text\" class=\"form-control\" placeholder=\"Last Name\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"col-md-3 control-label\">Password</label>\n" +
    "                    <div class=\"col-md-9\">\n" +
    "                        <input ng-model=\"user.password\" type=\"password\" class=\"form-control\" placeholder=\"Password\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-offset-3 col-md-9\">\n" +
    "                        <button id=\"btn-register\" ng-click=\"register()\" type=\"button\" class=\"btn btn-info\"><i class=\"icon-hand-right\"></i> &nbsp Sign Up</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("widgets/search/search.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/search/search.tpl.html",
    "<div class=\"margin-bottom-20\" ng-controller=\"SearchCtrl\">\n" +
    "	<h4>Search for companies</h4>\n" +
    "    <input type=\"text\" ng-model=\"selected\" typeahead=\"company as company.name for company in getCompanies($viewValue)\" typeahead-loading=\"loadingCompanies\" \n" +
    "    typeahead-min-length=\"3\" \n" +
    "    typeahead-template-url=\"widgets/search/typeahead.tpl.html\" \n" +
    "    typeahead-on-select='onSelect($item, $model, $label)' class=\"form-control\">\n" +
    "    <i ng-show=\"loadingCompanies\" class=\"glyphicon glyphicon-refresh\"></i>\n" +
    "\n" +
    "</div>");
}]);

angular.module("widgets/search/typeahead.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/search/typeahead.tpl.html",
    "  <a>\n" +
    "      <span>{{match.model.name}}</span>\n" +
    "      <span>{{match.model.exch}}</span>\n" +
    "  </a>");
}]);

angular.module("widgets/stockinfo/stockInfo.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/stockinfo/stockInfo.tpl.html",
    "<div ng-controller=\"StockInfoCtrl\">\n" +
    "<widget title=\"Stock Info\" minimizable=\"true\" removable=\"true\">\n" +
    "	<a class=\"btn btn-primary\" href=\"#/tradeflow/buy/instrument/{{symbol}}\">BUY</a>\n" +
    "	<table ng-table=\"tableParams\" class=\"table\">\n" +
    "        <tr ng-repeat=\"row in $data\">\n" +
    "            <td>{{row.name}}</td>\n" +
    "            <td>{{row.value}}</td>\n" +
    "        </tr>\n" +
    "        </table>\n" +
    "</widget>\n" +
    "</div>");
}]);

angular.module("widgets/tradeflow/confirm.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/tradeflow/confirm.tpl.html",
    "<div>\n" +
    "	<h2>Confirm purchase</h2>\n" +
    "	<table class=\"table\">\n" +
    "		<tr>\n" +
    "			<td>Order type:</td>\n" +
    "			<td>{{order.orderType}}</td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td>Paper:</td>\n" +
    "			<td>{{instrument.name}}</td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td>Custody:</td>\n" +
    "			<td>{{order.custody.name}}</td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td>Cash account:</td>\n" +
    "			<td>{{order.cashAccount.name}}</td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td>Amount:</td>\n" +
    "			<td>{{order.amount}}</td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td>Commission:</td>\n" +
    "			<td>{{commission}}</td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td>Estimated total:</td>\n" +
    "			<td>{{total}}</td>\n" +
    "		</tr>	\n" +
    "\n" +
    "	</table>\n" +
    "</div>");
}]);

angular.module("widgets/tradeflow/reciept.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/tradeflow/reciept.tpl.html",
    "<div>\n" +
    "<h1>Reciept</h1>\n" +
    "</div>");
}]);

angular.module("widgets/tradeflow/select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/tradeflow/select.tpl.html",
    "<div>\n" +
    "	<br>\n" +
    "<form class=\"form-horizontal\" role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "    <label for=\"orderType\" class=\"col-sm-3 control-label\">Order type</label>\n" +
    "    <div class=\"col-sm-9\">\n" +
    "      <select class=\"form-control\" id=\"orderType\" ng-model=\"order.orderType\" ng-options=\"type for type in orderTypes\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"custody\" class=\"col-sm-3 control-label\">Custody</label>\n" +
    "    <div class=\"col-sm-9\">\n" +
    "      <select class=\"form-control\" id=\"custody\" ng-model=\"order.custody\" ng-options=\"custody.name for custody in custodies\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"cashAcc\" class=\"col-sm-3 control-label\">Cash Account</label>\n" +
    "    <div class=\"col-sm-9\">\n" +
    "      <select class=\"form-control\" id=\"cashAcc\" ng-model=\"order.cashAccount\" ng-options=\"cashAccount.name for cashAccount in cashAccounts\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"amount\" class=\"col-sm-3 control-label\">Amount</label>\n" +
    "    <div class=\"col-sm-9\">\n" +
    "      <input type=\"number\" class=\"form-control\" id=\"amount\" ng-model=\"order.amount\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("widgets/tradeflow/tradeflow.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/tradeflow/tradeflow.tpl.html",
    "<div ng-controller=\"TradeFlowCtrl\">\n" +
    "\n" +
    "  <div class=\"panel panel-primary\">\n" +
    "    <div class=\"panel-heading text-uppercase\">{{order.action}} {{instrument.name}}</div>\n" +
    "    <div class=\"panel-body\" style=\"min-height:300px;\">\n" +
    "      <wizard current-step=\"currentStep\" template='wizard/wizard.tpl.html'> \n" +
    "        <wz-step title=\"select\">\n" +
    "        <div ng-include=\"'widgets/tradeflow/select.tpl.html'\"></div>\n" +
    "      </wz-step>\n" +
    "      <wz-step title=\"confirm\">\n" +
    "      <div ng-include=\"'widgets/tradeflow/confirm.tpl.html'\"></div>\n" +
    "    </wz-step>\n" +
    "    <wz-step title=\"reciept\">\n" +
    "    <div ng-include=\"'widgets/tradeflow/reciept.tpl.html'\"></div>\n" +
    "  </wz-step>  \n" +
    "</wizard>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"panel-footer\">  \n" +
    "  <div class=\"pull-right\">\n" +
    "    <a type=\"button\" class=\"btn btn-warning\" href=\"#\">Cancel</a>\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"next()\">{{nextBtn}}</button>\n" +
    "  </div>\n" +
    "  <div class=\"clearfix\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>");
}]);

angular.module('templates.common', ['layouts/twelveSixSix.tpl.html', 'layouts/twelveZeroZero.tpl.html', 'layouts/zeroSixSix.tpl.html', 'security/login/form.tpl.html', 'security/login/toolbar.tpl.html', 'wizard/wizard.tpl.html']);

angular.module("layouts/twelveSixSix.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("layouts/twelveSixSix.tpl.html",
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12 col-sm-12\">\n" +
    "	<div ng-repeat=\"item in northItems\">\n" +
    "		<div ng-include=\"item\"></div>\n" +
    "	</div>\n" +
    "</div>	\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-6 col-sm-6\">\n" +
    "		<div ng-repeat=\"item in eastItems\">\n" +
    "			<div ng-include=\"item\"></div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"col-md-6 col-sm-6\">\n" +
    "		<div ng-repeat=\"item in westItems\">\n" +
    "			<div ng-include=\"item\"></div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("layouts/twelveZeroZero.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("layouts/twelveZeroZero.tpl.html",
    "\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-12 col-sm-12\">\n" +
    "		<div ng-repeat=\"item in northItems\">\n" +
    "			<div ng-include=\"item\"></div>\n" +
    "		</div>	\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("layouts/zeroSixSix.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("layouts/zeroSixSix.tpl.html",
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-6 col-sm-6\">\n" +
    "		<div ng-repeat=\"item in eastItems\">\n" +
    "			<div ng-include=\"item\"></div>\n" +
    "		</div>	\n" +
    "	</div>\n" +
    "	<div class=\"col-md-6 col-sm-6\">		\n" +
    "		<div ng-repeat=\"item in westItems\">\n" +
    "			<div ng-include=\"item\"></div>\n" +
    "		</div>	\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("security/login/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/form.tpl.html",
    "<div class=\"mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2\">\n" +
    "    <div class=\"panel panel-info\" >\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <div class=\"panel-title\">Sign In</div>\n" +
    "            <div style=\"float:right; font-size: 80%; position: relative; top:-10px\"><a href=\"#\">Forgot password?</a></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div style=\"padding-top:30px; margin-left: 5px; margin-right: 5px\" class=\"panel-body\" >\n" +
    "            <div id=\"auth-error\" class=\"alert alert-danger col-sm-12\" ng-show=\"authError\">\n" +
    "                {{authError}}\n" +
    "            </div>\n" +
    "            <form class=\"form-horizontal\" role=\"form\">\n" +
    "                <div style=\"margin-bottom: 25px\" class=\"input-group\">\n" +
    "                    <span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-user\"></i></span>\n" +
    "                    <input class=\"form-control\" name=\"login\" type=\"text\" ng-model=\"user.username\" autofocus>\n" +
    "                </div>\n" +
    "\n" +
    "                <div style=\"margin-bottom: 25px\" class=\"input-group\">\n" +
    "                    <span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-lock\"></i></span>\n" +
    "                    <input name=\"pass\" class=\"form-control\" type=\"password\" ng-model=\"user.password\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div style=\"margin-top:10px\" class=\"form-group\">\n" +
    "                    <div class=\"col-sm-12 controls\">\n" +
    "                        <button id=\"btn-login\" class=\"btn btn-success\" ng-click=\"login()\">Login</button>\n" +
    "                        <button class=\"btn btn-warning\" ng-click=\"cancelLogin()\">Cancel</button>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-12 control\">\n" +
    "                        <div style=\"border-top: 1px solid#888; padding-top:15px; font-size:85%\" >\n" +
    "                            Don't have an account!\n" +
    "                            <a href=\"#\">Sign Up Here</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("security/login/toolbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/toolbar.tpl.html",
    "<ul class=\"nav navbar-nav navbar-right\">\n" +
    "  <li ng-show=\"isAuthenticated()\">\n" +
    "    <p class=\"navbar-text\"><span class=\"glyphicon glyphicon-user\"></span>{{currentUser}}</p>\n" +
    "  </li>\n" +
    "    <li ng-show=\"isAuthenticated()\">\n" +
    "          <a href ng-click=\"logout()\">Log out</a>\n" +
    "  </li>\n" +
    "  <li ng-hide=\"isAuthenticated()\">\n" +
    "          <a id=\"toolbar-login\" href ng-click=\"login()\">Log in</a>\n" +
    "  </li>\n" +
    "    <li ng-hide=\"isAuthenticated()\">\n" +
    "          <a id=\"toolbar-register\" href=\"#/register\">Register</a>\n" +
    "  </li>\n" +
    "\n" +
    "</ul>");
}]);

angular.module("wizard/wizard.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("wizard/wizard.tpl.html",
    "<div>    \n" +
    "    <ul class=\"steps-indicator steps-{{steps.length}}\" ng-if=\"!hideIndicators\">\n" +
    "      <li ng-class=\"{default: !step.completed && !step.selected, current: step.selected && !step.completed, done: step.completed && !step.selected, editing: step.selected && step.completed}\" ng-repeat=\"step in steps\">\n" +
    "        <a ng-click=\"goTo(step)\">{{step.title || step.wzTitle}}</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "    <div class=\"steps\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);
