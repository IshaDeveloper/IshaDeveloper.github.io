var app = angular.module('myApp');

app.controller('LoginCtrl', function ($scope, GAuth, $state, $cookies, GData) {
	if(GData.isLogin()){
		$state.go('main');
	}

    var ifLogin = function() {
        $cookies.put('userId', GData.getUserId());
        $state.go('main');
    };

	$scope.handleAuthClick = function handleAuthClick(event) {
		GAuth.checkAuth().then(
            function () {
                ifLogin();
            },
            function() {
                GAuth.login().then(function(){
                    ifLogin();
                });
            }
        );
	}
});