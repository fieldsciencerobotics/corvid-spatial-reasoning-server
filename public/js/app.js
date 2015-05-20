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

// My Monolithic Controll (should be refactored into smaller units)
// =============================================================================
myApp.controller('myController', function($scope, $modal, $log, $http) {

    // View Controls - For tabbed sections
    // =========================================================================

    // Which Main Tab is currently Showing
    $scope.currentTab = [false, false, true];

    $scope.tabSelect = function(tab) {
        $scope.currentTab = [false, false, false];
        $scope.currentTab[tab] = true;
    }

    // In the experiment Tab, is the right panel showing Birds or Stages
    $scope.currentBirdOrStage = [true, false];

    $scope.birdStageSelect = function(choice) {
        $scope.currentBirdOrStage = [false, false];
        $scope.currentBirdOrStage[choice] = true;
    }

    // In the experiment tab, what stage of definiting the session are you currently in
    $scope.currentExperimentStage = [true, false, false, false];

    $scope.experimentStageSelect = function(stage) {
        $scope.currentExperimentStage = [false, false, false, false];
        $scope.currentExperimentStage[stage] = true;
    }

    // In the data tab, what data is currently being explored
    $scope.currentDataBeingExplored = [true, false];

    $scope.dataExploreSelect = function(stage) {
        $scope.currentDataBeingExplored = [false, false];
        $scope.currentDataBeingExplored[stage] = true;
    }


    // Data Values (To be factored out and retrived from the server)
    // =========================================================================

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



    // HTTP Methods for communicating with the Server
    // =========================================================================

    //
    // FREEFORM METHODS:
    // 

    // DROP MEAT: Used in Freeform mode to command a particulr Feeder to drop meat
    $scope.sendToServerDropMeat = function() {
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

    //TURN LIGHT ON: Used in FreeForm mode to turn an indicator light on
    $scope.sendToServerTurnLightOn = function() {
        $http({
            url: '/freeForm/lightOn',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //TURN LIGHTS OFF: Used in FreeForm mode to turn all indicator lights off
    $scope.sendToServerTurnLightOn = function() {
        $http({
            url: '/freeForm/lightsOFF',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //
    // ADD NEW ITEMS METHODS:
    // 

    //ADD NEW BIRD: Used to add a new bird into the database
    $scope.sendToServerAddNewBird = function() {
        $http({
            url: '/addNew/newBird',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //ADD NEW STAGE: Used to add a new experimental stage into the database
    $scope.sendToServerAddNewStage = function() {
        $http({
            url: '/addNew/newStage',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //
    // STATE CONTROL METHODS:
    // 

    //INITIALIZE: Used to initialize the workbench, primarily selection the available feeders for use
    $scope.sendToServerInitialize = function() {
        $http({
            url: '/control/initialize',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //START EXPERIMENT: Used to start off an Experiment, primarily selection the bird and the stage
    $scope.sendToServerStartExperiment = function() {
        $http({
            url: '/control/startExperiment',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //CANCEL EXPERIMENT: Used to cancel an Experiment before beginning
    $scope.sendToServerCancelExperiment = function() {
        $http({
            url: '/control/cancelExperiment',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //START EXPERIMENTAL SESSION: Used to start an Experiment Session
    $scope.sendToServerStartExperimentalSession = function() {
        $http({
            url: '/control/startSession',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //END EXPERIMENTAL SESSION: Used to end an Experiment Session, primarily before it would have naturally ended
    $scope.sendToServerEndExperimentalSession = function() {
        $http({
            url: '/control/endSession',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //
    // GET DATA METHODS:
    // 

    //GET EXISTING BIRDS: Used to retrieve all the existing birds defiend in the database
    $scope.sendToServerGetBirds = function() {
        $http({
            url: '/data/getBirds',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //GET EXISTING STAGES: Used to retrieve all the existing stages defiend in the database
    $scope.sendToServerGetStages = function() {
        $http({
            url: '/data/getStages',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };




    // Modal Window Controllers
    // =========================================================================

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


// END OF CONTROLLER
});


// Modal Windows
// =============================================================================

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