var myApp = angular.module('myApp', ['ngAnimate', 'ui.bootstrap', 'ui.router']);

// configuring routes 
// =============================================================================
myApp.config(function($stateProvider, $urlRouterProvider) {

    // catch all route 
    $urlRouterProvider.otherwise('experiment');

    $stateProvider 
        // Explore inputs and research tasks
        .state('experiment', {
            url: '/experiment',
            templateUrl: 'partials/experiment.html'
        })

        // Explore outputs
        .state('data', {
            url: '/data',
            templateUrl: 'partials/data.html'
        })
        
        // splash screen
        .state('feeders', {
            url: '/feeders',
            templateUrl: 'partials/feeders.html'
        });
});

myApp.controller('myController', function($scope, $modal, $log, $http) {

    $scope.currentTab = [false, false, true];

    $scope.tabSelect = function(tab) {
        $scope.currentTab = [false, false, false];
        $scope.currentTab[tab] = true;
    }

    $scope.lights = [{'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}, 
                    {'on': true, 'colour': 'yellow'}];

    $scope.feeders = [{'id': 1, 'connected': true, 'colour': 'red', 'perch-colour': 'black' }, 
                    {'id': 2, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 3, 'connected': true, 'colour': 'red', 'perch-colour': 'black'  },
                    {'id': 4, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 5, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 6, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 7, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 8, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 9, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 10, 'connected': true, 'colour': 'red', 'perch-colour': 'black'  }];

    $scope.birds = [
                    {'id': 'RYB', 'gender': 'male', 'age': 'adult'},
                    {'id': 'W', 'gender': 'female', 'age': 'juvenile'}
                    ];


    $scope.stages = [
                    {'name': 'training part one', 'desc': "This is training part one", 'delay': 20, 'autoEnd': false, 'autoEndTime': 180, 'feederArrangement': []},
                    {'name': 'experiment part three', 'desc': "This is experiment part three", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 'feederArrangement': []}
                    ];


    $scope.resetColour = function(feeder) {
        myVar = setTimeout(function(){
            feeder.colour = 'red';
        },300);
    }

    $scope.freeFormDropMeat = function(feeder) {
        feeder.colour = 'green';
        $scope.resetColour(feeder);
    }


    $scope.dropMeat = function() {

        $http({
            url: '/freeForm/dropMeat',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    $scope.selectedBird = {'id': 'red', 'colour': ['red']};

    $scope.lightSwitch = function (light) {
        if(light.on == true){
            light.on = false;
            light.colour = 'black';
        } else {
            light.on = true;
            light.colour = 'yellow';
        }
    }

    // New Bird Modal Window
    $scope.openNewBird = function () {

        // Creates a new Modal Window 
        var NewBirdModalInstance = $modal.open({
            templateUrl: 'newBird.html',
            controller: NewBirdModalInstanceCtrl,
            size: 'md',
        });

        // Handles the Submittion or cancelation of the Modal Window
        NewBirdModalInstance.result.then(function (newBird) {
            // add bird to the existing list
            $scope.birds.push(newBird)
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // New Stage Modal Window
    $scope.openNewStage = function () {

        // Creates a new Modal Window 
        var NewStageModalInstance = $modal.open({
            templateUrl: 'newStage.html',
            controller: NewStageModalInstanceCtrl,
            size: 'md',
        });

        // Handles the Submittion or cancelation of the Modal Window
        NewStageModalInstance.result.then(function (newStage) {
            // add new stage to the existing list
            $scope.stages.push(newStage);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


});


// New Stage Modal Controller
var NewBirdModalInstanceCtrl = function ($scope, $modalInstance) {

    // Create a new Bird
    $scope.newBird = {};

    $scope.ok = function () {
        console.log($scope.newBird);
        $modalInstance.close($scope.newBird);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

// New Stage Modal Controller 
var NewStageModalInstanceCtrl = function ($scope, $modalInstance) {

    $scope.newStage = {};

    $scope.ok = function () {
        console.log($scope.Licenses);
        $modalInstance.close($scope.newStage);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};