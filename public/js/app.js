
//
// Start of Application - Importing required libraries
// =============================================================================
var myApp = angular.module('myApp', ['ngAnimate', 'ui.bootstrap', 'ui.router']);

//
// configuring routes for main tabs
// =============================================================================
myApp.config(function($stateProvider, $urlRouterProvider) {

    // catch all route (opening screen)
    $urlRouterProvider.otherwise('feeders');

    $stateProvider 
        // Running Experiments
        .state('experiment', {
            url: '/experiment',
            templateUrl: 'partials/experiment.html'
        })

        // Exploring Data
        .state('data', {
            url: '/data',
            templateUrl: 'partials/data.html'
        })
        
        // FreeForm Mode
        .state('feeders', {
            url: '/feeders',
            templateUrl: 'partials/feeders.html'
        });
});

//
// My Monolithic Controll (should be refactored into smaller units)
// =============================================================================
myApp.controller('myController', function($scope, $modal, $log, $http) {

    //
    // View Controls - For determining what to show for each tabbed section
    // =========================================================================

    // Which Main Tab is currently Showing
    $scope.currentTab = [false, false, true]; // (experiments, data, or freeform)

    $scope.tabSelect = function(tab) {
        $scope.currentTab = [false, false, false];
        $scope.currentTab[tab] = true;
    }

    // In the experiment Tab: is the right panel showing Birds or Stages
    $scope.currentBirdOrStage = [true, false]; // (Birds, or Stages)

    $scope.birdStageSelect = function(choice) {
        $scope.currentBirdOrStage = [false, false];
        $scope.currentBirdOrStage[choice] = true;
    }

    // In the experiment tab: what stage of definiting the session are you currently in
    $scope.currentExperimentStage = [true, false, false, false]; // (opening, define session, running, ended)

    $scope.experimentStageSelect = function(stage) {
        $scope.currentExperimentStage = [false, false, false, false];
        $scope.currentExperimentStage[stage] = true;
    }

    // In the data tab: what data is currently being explored
    $scope.currentDataBeingExplored = [true, false]; // (leaderboard, or specific bird)

    $scope.dataExploreSelect = function(stage) {
        $scope.currentDataBeingExplored = [false, false];
        $scope.currentDataBeingExplored[stage] = true;
    }

    //
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

    $scope.feeders = [{'id': 1, 'connected': true, 'colour': 'green', 'perch-colour': 'black' }, 
                    {'id': 2, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 3, 'connected': true, 'colour': 'red', 'perch-colour': 'black'  },
                    {'id': 4, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 5, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 6, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 7, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 8, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 9, 'connected': true, 'colour': 'red', 'perch-colour': 'black' },
                    {'id': 10, 'connected': true, 'colour': 'red', 'perch-colour': 'black'  }];

    $scope.existingBirds = [
                    {'id': 'Green', 'gender': 'male', 'age': 'adult'},
                    {'id': 'Blue', 'gender': 'female', 'age': 'juvenile'},
                    {'id': 'Red', 'gender': 'female', 'age': 'juvenile'},
                    {'id': 'Red-Yellow', 'gender': 'female', 'age': 'juvenile'},
                    {'id': 'Red-Blue', 'gender': 'female', 'age': 'juvenile'},
                    ];


    $scope.existingStages = [
                    {'name': 'training part one', 'desc': "This is training part one", 'delay': 20, 'autoEnd': false, 'autoEndTime': 180, 'feederArrangement': []},
                    {'name': 'exp part one', 'desc': "This is experiment part one", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 'feederArrangement': []},
                    {'name': 'exp part two', 'desc': "This is experiment part two", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 'feederArrangement': []},
                    {'name': 'exp part three', 'desc': "This is experiment part three", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 'feederArrangement': []},
                    ];


    //
    // UI Methods (Called from clicking on various UI elements)
    // =========================================================================


    //
    // Inititalize
    //

    // Initialize
    $scope.initialize = function() {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);
        $scope.sendToServerInitialize();
    }

    //
    // Freeform
    //

    // Part of the Drop meat method (though it is not working currently)
    $scope.resetColour = function(feeder) {
        myVar = setTimeout(function(){
            feeder.colour = 'red';
        },300);
    }

    // Drop meat
    $scope.freeFormDropMeat = function(feeder) {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);
        $scope.sendToServerDropMeat();
    }

    // Toggle Ligh
    $scope.lightSwitch = function (light) {
        if(light.on == true){
            light.on = false;
            light.colour = 'black';
        } else {
            light.on = true;
            light.colour = 'yellow';
        }
    }


    //
    // Data
    //

    // Get Birds
    $scope.getBirds = function() {
        birds = $scope.sendToServerGetBirds();
    }

    // Get Stages
    $scope.getStages = function() {
        stages = $scope.sendToServerGetStages();
    }

    // New Bird
    $scope.newBird = function(newBird) {
        $scope.sendToServerAddNewBird(newBird);
        // add bird to the existing list
        $scope.existingBirds.push(newBird)
    }

    // New Stage
    $scope.newStage = function(newStage) {
        $scope.sendToServerAddNewStage(newStage);
        // add new stage to the existing list
        $scope.existingStages.push(newStage);
    }


    //
    // Experiments
    //

    $scope.selectedBird = {};
    $scope.selectedStage = {};
    $scope.numOfTrials = {};

    // Start Experiment
    $scope.startExperiment = function() {
        // Notify the server
        $scope.sendToServerStartExperiment($scope.selectedBird.id.id, $scope.selectedStage.id.name); 
        // Reset the values
        $scope.selectedBird = {};
        $scope.selectedStage = {};
        // Change the View
        $scope.experimentStageSelect(1);
    }

    // Cancel Experiment
    $scope.cancelExperiment = function() {
        // Notify the server
        $scope.sendToServerCancelExperiment();
        // Change the View
        $scope.experimentStageSelect(0);
    }

    // Start Session
    $scope.startSession = function() {
        // Notify the server
        $scope.sendToServerStartExperimentalSession($scope.numOfTrials.num);
        // Reset the number of trials value
        $scope.numOfTrials = {};
        // Change the View
        $scope.experimentStageSelect(2);
    }

    // End Session
    $scope.endSession = function() {
        // Notify the Server
        $scope.sendToServerEndExperimentalSession();
        // Change the View
        $scope.experimentStageSelect(3);
    }

    // Completed Wrapup
    $scope.finishWrapup = function() {
        // Notify the Server
        $scope.sendToServerWrapUpExperiment();
        // Change the View
        $scope.experimentStageSelect(0);
    }


    //
    // HTTP Methods for communicating with the Server
    // =========================================================================

    //
    // FREEFORM METHODS:
    // 

    // DROP MEAT: Used in Freeform mode to command a particulr Feeder to drop meat
    $scope.sendToServerDropMeat = function(feederID) {
        $http({
            url: '/freeForm/dropMeat',
            method: "POST",
            data: angular.toJson({'feederID': feederID}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //TURN LIGHT ON: Used in FreeForm mode to turn an indicator light on
    $scope.sendToServerTurnLightOn = function(lightID) {
        $http({
            url: '/freeForm/lightOn',
            method: "POST",
            data: angular.toJson({'lightID': lightID}),
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
    $scope.sendToServerAddNewBird = function(newBird) {
        $http({
            url: '/addNew/newBird',
            method: "POST",
            data: angular.toJson(newBird),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //ADD NEW STAGE: Used to add a new experimental stage into the database
    $scope.sendToServerAddNewStage = function(newStage) {
        $http({
            url: '/addNew/newStage',
            method: "POST",
            data: angular.toJson(newStage),
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
    $scope.sendToServerStartExperiment = function(bird, stage) {
        $http({
            url: '/control/startExperiment',
            method: "POST",
            data: angular.toJson({'birdID': bird, 'stageID': stage}),
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
    $scope.sendToServerStartExperimentalSession = function(numOfTrials) {
        $http({
            url: '/control/startSession',
            method: "POST",
            data: angular.toJson({'numOfTrials': numOfTrials}),
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


    //WRAP UP EXPERIMENTAL SESSION: Used to wrap up an experimental session
    $scope.sendToServerWrapUpExperiment = function() {
        $http({
            url: '/control/wrapUpSession',
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







    //
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
            $scope.newBird(newBird);
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
            $scope.newStage(newStage);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // Map Feeders Modal Window
    $scope.openMapFeeders = function () {


        // Get existing Mapping

        // Get connected devices


        // Node -> Device ID + (True or False indicating a match)


        // Checkboxes for what you actually want??
        // Each device needs to be shown as Green if there is a mapping, and that device is connected

        // then perhaps a dropdown under each device to all the mapping to be changed?


        // Creates a new Modal Window 
        var MapFeedersModalInstance = $modal.open({
            templateUrl: 'mapFeeders.html',
            controller: MapFeedersModalInstanceCtrl,
            size: 'lg',
            resolve: {
                feeders: function () {
                    return $scope.feeders;
                }
            }
        });

        // Handles the Submittion or cancelation of the Modal Window
        MapFeedersModalInstance.result.then(function (newStage) {
            // add new stage to the existing list
            $scope.initialize();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.openMapFeeders();


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
        console.log($scope.newStage);
        $modalInstance.close($scope.newStage);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

// New Stage Modal Controller 
var MapFeedersModalInstanceCtrl = function ($scope, $modalInstance, feeders) {

    $scope.mapFeeders = {};
    $scope.feeders = feeders;

    // Feeder can only be assigned to ONE experimental node at a time
    // It must be removed from that node, before it can be assigned to another


    // 1) Array of all feeders
    // 2) filtered array of remaining feeders (that will actually populate the drop downs)
    // 3) That array of filtered items, should have the additional property of being connected (true/false)


    // Mapping: Experimental node -> feeder device
    //  -> this is pulled (and saved) from/to the database (this is automated with page load, and save each time)



    $scope.ok = function () {
        console.log($scope.mapFeeders);
        $modalInstance.close($scope.newStage);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};