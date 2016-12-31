 var app = angular.module('myApp');
    app.controller('MainCtrl', function($scope, $http, GApi) {
	   	function fetch() { 

	   	  	GApi.executeAuth('sheets', 'spreadsheets.values.get', {
	   	  		spreadsheetId: '1Ya5nuFKDJhhQuf9S6XN3TpJeobn6bvP06Z9LLpcYzuA', //'1vaYjqp7i5b4UW-1qR-k2iIwm7yTs5YLkULgj4neIZEA',
	          	range: 'Form Responses 1!A2:L', //'checkin!A2:L' // 'Form Responses 1!A2:L',
	   	  	}).then(function(response) {
	          var range = response.result;
	          $scope.entries = [];
	          if (range.values.length > 0) {
	            var entries = range.values;
	            for(key in entries) {

		            $scope.entries.push({
		                firstName : entries[key][1],
		                lastName : entries[key][2],
		                checkedin : entries[key][4],
		                email : entries[key][6],
		                cityCenter: entries[key][7],
		                kidbetween613: entries[key][8],
		                kidsunder6: entries[key][9],
		            })
	            }
	          }
	        }, function(response) {

	        });
      	}

	    $scope.checkIn  = function (entry) {
	    	var index = $scope.entries.indexOf(entry), 
	    		row = index + 2;
			GApi.executeAuth('sheets', 'spreadsheets.values.append', {
				spreadsheetId: '1Ya5nuFKDJhhQuf9S6XN3TpJeobn6bvP06Z9LLpcYzuA', // '1vaYjqp7i5b4UW-1qR-k2iIwm7yTs5YLkULgj4neIZEA',
	          	range: 'E'+ row,
	          	valueInputOption: 'RAW',
	          	insertDataOption: 'OVERWRITE',
	          	includeValuesInResponse: true,
				values: [[ 'True']]
			})
			.then(function(res) {
				fetch();
			})
		}
	    $scope.UndoCheckIn  = function (entry) {
			
			$scope.undoCheckinEntry = entry;
			$scope.showCofirmation = true;
		}
		$scope.confirmUndo = function () {
			var row = $scope.entries.indexOf($scope.undoCheckinEntry)+2;
			GApi.executeAuth('sheets', 'spreadsheets.values.clear', {
				spreadsheetId: '1Ya5nuFKDJhhQuf9S6XN3TpJeobn6bvP06Z9LLpcYzuA', // '1vaYjqp7i5b4UW-1qR-k2iIwm7yTs5YLkULgj4neIZEA',
	          	range: 'E'+row,
	          	fields: 'clearedRange',
			})
			.then(function(res) {
				$scope.undoCheckinEntry = {};
				$scope.showCofirmation = false;
				fetch();
			})
		}

		$scope.cancelUndo = function () {
			$scope.undoCheckinEntry = {};
			$scope.showCofirmation = false;
			fetch();
		}
	    
	    fetch();
    })
  