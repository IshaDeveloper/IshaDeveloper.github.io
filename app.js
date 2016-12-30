var app = angular.module('myApp', ['ui.router', 'angular-google-gapi']);


app.run(['GAuth', 'GApi', 'GData', '$state', '$rootScope',
    function(GAuth, GApi, GData, $state, $rootScope, $cookies) {

        $rootScope.gdata = GData;

        var CLIENT = '833892871350-5edokhvgo89hu77ni36j7dd6snserj33.apps.googleusercontent.com';

        // GApi.load('myApiName','v1',BASE);
        GApi.load('sheets','v4'); // for google api (https://developers.google.com/apis-explorer/)

        GAuth.setClient(CLIENT)
        // default scope is only https://www.googleapis.com/auth/userinfo.email
        GAuth.setScope("https://www.googleapis.com/auth/spreadsheets");

        // load the auth api so that it doesn't have to be loaded asynchronously
        // when the user clicks the 'login' button.
        // That would lead to popup blockers blocking the auth window

        // or just call checkAuth, which in turn does load the oauth api.
        // if you do that, GAuth.load(); is unnecessary
        var currentUser = $cookies.get('userId');
        if(currentUser) {
            GData.setUserId(currentUser);
            GAuth.checkAuth().then(
                function (user) {
                    console.log(user.name + ' is logged in');
                    $state.go('main'); // an example of action if it's possible to
                                            // authenticate user at startup of the application
                },
                function() {
                    console.log("Auth Failed");
                    $state.go('login'); // an example of action if it's impossible to
                                      // authenticate user at startup of the application
                }
            );
        } else {
             $state.go('login');
        }
    }
])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state({
        name: 'login',
        url: '/login',
        templateUrl: '/login/login.html',
        controller: 'LoginCtrl'
    })
    .state({
        name: 'main',
        url: '/main',
        templateUrl: '/main/main.html',
        controller: 'MainCtrl'

    })
}])
.controller('AppCtrl', function ($rootScope, $scope, GAuth, $state) {
    $rootScope.state = $state;

    $scope.logout = function() {
        GAuth.logout().then(function () {
            console.log("Logging Out");
            $state.go('login');
        });
    };
});