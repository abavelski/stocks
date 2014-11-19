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
