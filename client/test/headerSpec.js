'use strict';
describe("Testing the header controller", function(){
	beforeEach(module("app"));
	var headerCtrl, scope;

	beforeEach(inject( function($controller, $rootScope, $location){
		scope = $rootScope;
		spyOn($location, 'path').andReturn('Fake location');
		headerCtrl = $controller("HeaderCtrl", {
			$scope : scope
		})
	}));

	it("should be bla bla bla", function(){
		expect(scope.test).toBe("Bla bla bla");
	});

});