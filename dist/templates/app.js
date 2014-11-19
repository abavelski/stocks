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
    "            <td data-title=\"'Symbol'\">{{holding.symbol}}</td>\n" +
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
    "				<td data-title=\"'Name'\"><a href=\"#/cashaccount/{{cashAccount._id}}/details\">{{cashAccount.name}}</a></td>\n" +
    "				<td data-title=\"'Currency'\">{{cashAccount.currency}}</td>\n" +
    "				<td data-title=\"'Balance'\">{{cashAccount.balance}}</td>\n" +
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
    "			<tr ng-repeat=\"custody in custodies\">\n" +
    "				<td data-title=\"'Name'\"><a href=\"#/assetoverview/{{custody._id}}\">{{custody.name}}</a></td>\n" +
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
