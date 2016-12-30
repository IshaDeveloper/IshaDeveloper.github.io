 var app = angular.module('myApp');
    app.controller('MainCtrl', function($scope, $http, GApi) {
	   	function fetch() { 
	   	  	GApi.executeAuth('sheets', 'spreadsheets.values.get', {
	   	  		spreadsheetId: '1vaYjqp7i5b4UW-1qR-k2iIwm7yTs5YLkULgj4neIZEA',
	          	range: 'checkin!A2:L'
	   	  	}).then(function(response) {
	   	  		console.log(response)
	          var range = response.result;
	          $scope.entries = [];
	          console.log(range);
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
	          } else {

	          }
	        }, function(response) {
	          console.log("ERROR :",response);
	        });
      	}

	    $scope.checkIn  = function (entry) {
			var row = $scope.entries.indexOf(entry) + 2;
			GApi.executeAuth('sheets', 'spreadsheets.values.append', {
				spreadsheetId: '1vaYjqp7i5b4UW-1qR-k2iIwm7yTs5YLkULgj4neIZEA',
	          	range: 'E'+row,
	          	valueInputOption: 'RAW',
	          	insertDataOption: 'OVERWRITE',
	          	includeValuesInResponse: true,
				values: [[ 'True']]
			})
			.then(function(res) {
				console.log(res);
				fetch();
			})
		}
	    $scope.UndoCheckIn  = function (entry) {
			var row = $scope.entries.indexOf(entry)+2;
			GApi.executeAuth('sheets', 'spreadsheets.values.clear', {
				spreadsheetId: '1vaYjqp7i5b4UW-1qR-k2iIwm7yTs5YLkULgj4neIZEA',
	          	range: 'E'+row,
	          	fields: 'clearedRange',
			})
			.then(function(res) {
				console.log(res);
				fetch();
			})
		}
	    
	    fetch();
    })
  