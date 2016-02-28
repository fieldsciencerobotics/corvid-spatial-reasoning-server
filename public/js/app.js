
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
    $scope.currentDataBeingExplored = [false, true]; // (leaderboard, or specific bird)

    $scope.dataExploreSelect = function(stage) {
        $scope.currentDataBeingExplored = [false, false];
        $scope.currentDataBeingExplored[stage] = true;
    }

    //
    // Data Values (To be factored out and retrived from the server)
    // =========================================================================

    $scope.lights = [{'id': 0, 'on': false, 'colour': 'grey'},
                    {'id': 1, 'on': false, 'colour': 'grey'}, 
                    {'id': 2, 'on': false, 'colour': 'grey'}, 
                    {'id': 3, 'on': false, 'colour': 'grey'}, 
                    {'id': 4, 'on': false, 'colour': 'grey'}, 
                    {'id': 5, 'on': false, 'colour': 'grey'}, 
                    {'id': 6, 'on': false, 'colour': 'grey'}, 
                    {'id': 7, 'on': false, 'colour': 'grey'}, 
                    {'id': 8, 'on': false, 'colour': 'grey'}, 
                    {'id': 9, 'on': false, 'colour': 'grey'}];

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

    $scope.existingBirds = [];
    $scope.existingStages = [];

    $scope.onlineDeviceMapping = [];


    //
    // UI Methods (Called from clicking on various UI elements)
    // =========================================================================


    //
    // Inititalize
    //

    // Initialize
    $scope.initialize = function(mapping) {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);

        //$scope.newDeviceMapping = {'1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e',
        //                    '6': 'f', '7': 'g', '8': 'h', '9': 'i', '10': 'j'};


        // This is where the results need to be set.

        $scope.sendToServerInitialize(mapping);
    }

    //
    // Freeform
    //
    $scope.inFreeformMode = true;

    $scope.enterFreeform = function() {
        $scope.inFreeformMode = true;
    }

    $scope.leaveFreeform = function() {
        $scope.inFreeformMode = false;
    }

    // Reset Devive Configuration
    $scope.resetDeivceConfiguration = function() {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);

        //$scope.newDeviceMapping = {'1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e',
        //                    '6': 'f', '7': 'g', '8': 'h', '9': 'i', '10': 'j'};


        // This is where the results need to be set.
        
        if ($scope.inFreeformMode) {
            $scope.sendToServerGetOnlineDeviceListFreeform();
        } else {
            console.log("must in in freeform mode to rest configurations")
        }
        
    }

    // Part of the Drop meat method (though it is not working currently)
    $scope.resetColour = function(feeder) {
        myVar = setTimeout(function(){
            feeder.colour = 'red';
        },300);
    }

    // Drop meat
    $scope.freeFormDropMeat = function(feederId) {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);
        if ($scope.inFreeformMode) {
            // Freeform action here
            $scope.sendToServerDropMeat(feederId);
        } else {
            console.log("must in in freeform mode to rest configurations")
        }
        
    }


    //
    // Feeder Stages
    //

    // Stop Feeder
    $scope.stopFeeder = function(feederId) {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);
        if ($scope.inFreeformMode) {
            // Freeform action here
            $scope.sendToServerStopFeeder(feederId);
        } else {
            console.log("must in in freeform mode to rest configurations")
        }
        
    }

    // Reset Feeder
    $scope.resetFeeder = function(feederId) {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);
        if ($scope.inFreeformMode) {
            // Freeform action here
            $scope.sendToServerResetFeeder(feederId);
        } else {
            console.log("must in in freeform mode to rest configurations")
        }
        
    }

    // Reset Feeder
    $scope.primeFeeder = function(feederId) {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);
        if ($scope.inFreeformMode) {
            // Freeform action here
            $scope.sendToServerPrimeFeeder(feederId);
        } else {
            console.log("must in in freeform mode to rest configurations")
        }
        
    }

    // Toggle Ligh
    $scope.freeFormLightToggle = function (light) {
        if ($scope.inFreeformMode) {
            // Freeform action here
            if(light.on == true){
                light.on = false;
                light.colour = 'grey';
                $scope.freeFormTurnOffLight(light.id);
            } else {
                light.on = true;
                light.colour = 'yellow';
                $scope.freeFormTurnOnLight(light.id);
            }
        } else {
            console.log("must in in freeform mode to rest configurations")
        }
        
    }

    $scope.freeFormTurnOnLight = function(lightId) {
        $scope.sendToServerTurnLightOn(lightId);
    }

    $scope.freeFormTurnOffLight = function(lightId) {
        $scope.sendToServerTurnLightOff(lightId);
    }

    // Simulate Perch event of node 2 - only used for testing
    $scope.simulatePerchEvent = function(num) {
        //feeder.colour = 'green';
        //$scope.resetColour(feeder);
        $scope.sendToServerPerchEvent(num);
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
        //$scope.existingBirds.push(newBird)
    }

    // New Stage
    $scope.newStage = function(newStage) {

        newFeeders = []

        for (var i=0; i < 10; i++) {
            if (newStage.feederArrangement[i] == true) {
                newFeeders[i] = true;
            } else {
                newFeeders[i] = false;
            }
        }
        newStage.feederArrangement = newFeeders;
        $scope.sendToServerAddNewStage(newStage);
    }

    $scope.leaderBoard = {};
    $scope.currentBirdStageTrials = {};

    $scope.getLeaderBoard = function() {
        $scope.sendToServerGetLeaderBoard();
    }

    $scope.updateCurrentBirdStageTrials = function(birdID, stageID){
        $scope.sendToServerGetTrialsOfBirdInStage(birdID, stageID);
    }


    $scope.dataExploreChangeToBird = function(birdID) {

        // send to server get bird data

        // update the table drawing function
    }


    //
    // Experiments
    //


    //For displaying the progress bar
    $scope.progressBarTotal = 0;
    $scope.progressBarCurrent = 0;

    // Timer methods to poll for progress during experiment
    $scope.progressPoller = null;

    $scope.startProgressPoller = function() {
        $scope.progressPoller = setInterval(function(){ $scope.queryProgress() }, 2000); // 2 seconds
    }

    $scope.queryProgress = function() {
        $scope.getCurrentSessionProgress();
    }

    $scope.stopProgressPoller = function() {
        clearInterval($scope.progressPoller);
    }


    // Timer methods to poll for battery life updates
    $scope.batteryPoller = null;
    $scope.currentBatteryLevels = [];

    $scope.startBatteryPoller = function() {
        $scope.batteryPoller = setInterval(function(){ $scope.queryBattery() }, 120000); // 2 mins (I think)
    }

    $scope.queryBattery = function() {
        $scope.sendToServerGetCurrentBatteryLife();
    }

    $scope.stopBatteryPoller = function() {
        clearInterval($scope.batteryPoller);
    }



    $scope.selectedBird = {};
    $scope.selectedStage = {};
    $scope.numOfTrials = {};
    $scope.currentBlock = [];
    $scope.expFeederArrangement = [];

    $scope.experimentRunning = [true, false];

    // Start Experiment
    $scope.startExperiment = function() {
        // Notify the server
        $scope.sendToServerStartExperiment($scope.selectedBird.id.id, $scope.selectedStage.id); 

        $scope.expFeederArrangement = angular.copy($scope.feeders);

        console.log($scope.selectedStage.id.feederArrangement);
        for (var i=0; i<$scope.selectedStage.id.feederArrangement.length; i++) {


            if($scope.selectedStage.id.feederArrangement[i] == true) {
                if ($scope.expFeederArrangement[i].connected == true) {
                    $scope.expFeederArrangement[i].check = true;
                    $scope.expFeederArrangement[i].colour = 'green';
                } else {
                    $scope.expFeederArrangement[i].check = false;
                    $scope.expFeederArrangement[i].colour = 'red';
                }


            } else {
                if ($scope.expFeederArrangement[i].connected == true) {
                    $scope.expFeederArrangement[i].colour = 'honeydew';
                    $scope.expFeederArrangement[i].check = true;
                } else {
                    $scope.expFeederArrangement[i].colour = 'pink';
                    $scope.expFeederArrangement[i].check = true;
                }
                


            }
            // set this to be $scope.expFeederArrangement = []; and then change the UI code to reflect this
            console.log($scope.expFeederArrangement[i]);
        }

        console.log($scope.expFeederArrangement);
        
        // There is room here to consider whether a warning message should be sent
        // or a check to make sure it is possible to run this session (make absolute rather than being creative with the experiemtnatl planning as a starting point)

        // Reset the values
        $scope.selectedBird = {};
        $scope.selectedStage = {};
        $scope.progressBarTotal = 0;
        $scope.progressBarCurrent = 0;
        $scope.currentBlock = [];
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


    $scope.currentTrial = 0;

    // Start Session
    $scope.startSession = function() {
        // Notify the server

        $scope.sendToServerStartExperimentalSession(parseInt($scope.numOfTrials.num));

        $scope.progressBarTotal = $scope.numOfTrials.num;

        // Reset the number of trials value
        $scope.numOfTrials = {};

        //Ensure the correct button is shown
        $scope.experimentRunning = [true, false];

        // Change the View
        $scope.experimentStageSelect(2);

        $scope.startProgressPoller();
        $scope.currentTrial = 0;
    }

    // End Session
    $scope.endSession = function() {
        // Notify the Server
        $scope.sendToServerEndExperimentalSession();
        // Change the View
        $scope.experimentStageSelect(3);

        $scope.stopProgressPoller();
    }

    // Complete Session
    $scope.completeSession = function() {
        // Change the View
        $scope.experimentStageSelect(3);

        $scope.stopProgressPoller();
    }

    // Completed Wrapup
    $scope.finishWrapup = function(note) {
        
        // Notify the Server
        $scope.sendToServerWrapUpExperiment(note);

        // Change the View
        $scope.experimentStageSelect(0);
        $scope.currentBlock = [];
    }

    $scope.getCurrentSessionProgress = function() {
        //$scope.currentBlock = [];

        // get the length
        // then pass on this value to the server
        // it will decide what value to actuall refresh
        $scope.sendToServerGerCurrentSessionProgress(); // pass row value here
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
    $scope.sendToServerTurnLightOff = function(lightID) {
        $http({
            url: '/freeForm/lightOff',
            method: "POST",
            data: angular.toJson({'lightID': lightID}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    // DROP MEAT: Used in Freeform mode to command a particulr Feeder to drop meat
    $scope.sendToServerPerchEvent = function(perchID) {
        $http({
            url: '/freeForm/perchEvent',
            method: "POST",
            data: angular.toJson({'perchID': perchID}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //
    // Feeder Stages
    //

    
    // STOP FEEDER: Used to stop the feeder just in case
    $scope.sendToServerStopFeeder = function(feederID) {
        $http({
            url: '/freeForm/stopFeeder',
            method: "POST",
            data: angular.toJson({'feederID': feederID}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    // RESET FEEDER: Used to stop the feeder just in case
    $scope.sendToServerResetFeeder = function(feederID) {
        $http({
            url: '/freeForm/resetFeeder',
            method: "POST",
            data: angular.toJson({'feederID': feederID}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    // PRIME FEEDER: Used to stop the feeder just in case
    $scope.sendToServerPrimeFeeder = function(feederID) {
        $http({
            url: '/freeForm/primeFeeder',
            method: "POST",
            data: angular.toJson({'feederID': feederID}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };


    //
    // RUNNING EXPERIMENT METHODS:
    // 

    // DROP MEAT: Used in Freeform mode to command a particulr Feeder to drop meat
    $scope.sendToServerGerCurrentSessionProgress = function() {
        $http({
            url: '/experiment/getCurrentSessionProgress',
            method: "POST",
            data: angular.toJson({'feederID': 0}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);

            // needs testing
            if($scope.currentBlock.length < 1){
                $scope.currentBlock = data;
            }
            

            // Split this up into each field, not a straight copy replace
            $scope.currentBlock[$scope.currentTrial].endTime = data[$scope.currentTrial].endTime;
            $scope.currentBlock[$scope.currentTrial].success = data[$scope.currentTrial].success;
            $scope.currentBlock[$scope.currentTrial].totalTime = data[$scope.currentTrial].totalTime;
            $scope.currentBlock[$scope.currentTrial].actual = data[$scope.currentTrial].actual;
            $scope.currentBlock[$scope.currentTrial].startTime = data[$scope.currentTrial].startTime;


            if (data === parseInt($scope.currentBlock[$scope.currentTrial].totalTime, 10)) {
                $scope.currentBlock[$scope.currentTrial].totalTime = $scope.currentBlock[$scope.currentTrial].totalTime / 1000 + " secs";                
            }

            //Method to determine progress
            
            totalNumberOfTrials = $scope.currentBlock.length;
            completedNumberOfTrials = 0;

            for (var i=0; i < $scope.currentBlock.length; i++) {
                if ($scope.currentBlock[i].success != null) {
                    completedNumberOfTrials = completedNumberOfTrials + 1;
                }
            }

            $scope.progressBarCurrent = completedNumberOfTrials;
            /*
            if (completedNumberOfTrials == totalNumberOfTrials) {
                $scope.experimentRunning = [false, true];
                $scope.stopProgressPoller();
                $scope.currentTrial = 0;

                // Experimental, might need further testing for edge cases
                $scope.stopProgressPoller();
            }
            */
            if ($scope.currentBlock[$scope.currentTrial].success != null) {
                $scope.currentTrial = $scope.currentTrial + 1;

                if ($scope.currentTrial == ($scope.currentBlock.length)) {
                    //$scope.currentBlock[$scope.currentTrial] = data[$scope.currentTrial];
                    $scope.experimentRunning = [false, true];
                    $scope.stopProgressPoller();
                    $scope.currentTrial = 0;

                    // Experimental, might need further testing for edge cases
                    $scope.stopProgressPoller();
                }
                
            }

            console.log($scope.currentTrial);
            

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
            url: '/addNew/bird',
            method: "POST",
            data: angular.toJson({'newBird': newBird}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
            $scope.existingBirds = data;
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //ADD NEW STAGE: Used to add a new experimental stage into the database
    $scope.sendToServerAddNewStage = function(newStage) {
        $http({
            url: '/addNew/stage',
            method: "POST",
            data: angular.toJson({'newStage': newStage}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
            $scope.existingStages = data;
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //
    // STATE CONTROL METHODS:
    // 

    //INITIALIZE: Used to initialize the workbench, primarily selection the available feeders for use
    $scope.sendToServerInitialize = function(newDeviceMapping) {
        $http({
            url: '/control/initialize',
            method: "POST",
            data: angular.toJson({'newDeviceMapping': newDeviceMapping}),
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
            data: angular.toJson({'birdID': bird, 'stage': stage}),
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
    $scope.sendToServerWrapUpExperiment = function(note) {
        $http({
            url: '/control/wrapUpSession',
            method: "POST",
            data: angular.toJson({'note': note}),
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

    //GET ONLINE DEVICES: Query what devices are currently online, and what the mapping currently is
    $scope.sendToServerGetOnlineDeviceList = function() {
        $http({
            url: '/data/getOnlineDeviceList',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
            //$scope.existingStages = data;
            $scope.feeders = data['feederList'];
            $scope.onlineDeviceMapping = data['onlineList'];
            // Now open the Modal
            $scope.openMapFeeders();
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //GET ONLINE DEVICES FROM FREEFORM MODE: Query what devices are currently online, and what the mapping currently is
    $scope.sendToServerGetOnlineDeviceListFreeform = function() {
        $http({
            url: '/data/getOnlineDeviceListFreeform',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
            //$scope.existingStages = data;
            $scope.feeders = data['feederList'];
            $scope.onlineDeviceMapping = data['onlineList'];
            // Now open the Modal
            $scope.openMapFeeders();
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    

    //GET EXISTING BIRDS: Used to retrieve all the existing birds defiend in the database
    $scope.sendToServerGetBirds = function() {
        $http({
            url: '/data/getBirds',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
            $scope.existingBirds = data;
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
            $scope.existingStages = data;
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //GET BIRD's TRIALS IN STAGE: Used to retrieve all of a birds trials in a particular stage
    $scope.sendToServerGetTrialsOfBirdInStage = function(birdID, stageID) {
        $http({
            url: '/data/getTrialsOfBirdInStage',
            method: "POST",
            data: angular.toJson({'birdID': birdID, 'stageID': stageID}),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
            $scope.currentBirdStageTrials = data;
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //GET LEADERBOARD: Used to retrieve the leaderboard
    $scope.sendToServerGetLeaderBoard = function() {
        $http({
            url: '/data/getLeaderBoard',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
            $scope.leaderBoard = data;
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
    };

    //GET CURRENT BATTERY LIFES: Used to retrieve the battery levels
    $scope.sendToServerGetCurrentBatteryLife = function() {
        $http({
            url: '/data/getCurrentBatteryLife',
            method: "POST",
            data: angular.toJson([{'id': 2}]),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(data);
            $scope.currentBatteryLevels = data;
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
                },
                onlineList: function () {
                    return $scope.onlineList;
                }
            }
        });

        // Handles the Submittion or cancelation of the Modal Window
        MapFeedersModalInstance.result.then(function (feeders) {
            // update feeders list
            $scope.feeders = feeders;


            // Pull out the updated device mapping here
            deviceMapping = [{nodeID: 1, deviceID: null}, 
                            {nodeID: 2, deviceID: null}, 
                            {nodeID: 3, deviceID: null}, 
                            {nodeID: 4, deviceID: null}, 
                            {nodeID: 5, deviceID: null},
                            {nodeID: 6, deviceID: null}, 
                            {nodeID: 7, deviceID: null}, 
                            {nodeID: 8, deviceID: null}, 
                            {nodeID: 9, deviceID: null}, 
                            {nodeID: 10, deviceID: null}];

            for (var i=0; i<10; i++) {
                deviceMapping[i].deviceID = feeders[i].mappedTo;
            }


            $scope.initialize(deviceMapping);

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //
    // Methods to call on page load
    //
    $scope.sendToServerGetOnlineDeviceList();

    // Could be broken needs to be tested
    setTimeout(function(){
        $scope.getBirds();
        $scope.getStages();
    }, 3000);




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
var MapFeedersModalInstanceCtrl = function ($scope, $modalInstance, feeders, onlineList) {

    $scope.mapFeeders = {};
    $scope.feeders = feeders;
    $scope.onlineList = onlineList;
    console.log($scope.onlineList);

    // Feeder can only be assigned to ONE experimental node at a time
    // It must be removed from that node, before it can be assigned to another


    // 1) Array of all feeders
    // 2) filtered array of remaining feeders (that will actually populate the drop downs)
    // 3) That array of filtered items, should have the additional property of being connected (true/false)


    // Mapping: Experimental node -> feeder device
    //  -> this is pulled (and saved) from/to the database (this is automated with page load, and save each time)



    $scope.ok = function () {
        console.log($scope.feeders);
        $modalInstance.close($scope.feeders);
    };

    //$scope.cancel = function () {
    //    $modalInstance.dismiss('cancel');
    //};
};