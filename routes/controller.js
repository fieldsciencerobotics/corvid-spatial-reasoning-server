var machina = require('machina');
var request = require('request');
var lagarto = require('./devices');
var data = require('./data');

// Global Variables to the experiment
var currentBlock = [];
var currentNumOfTrials = 0;
var currentTrialNum = 0;
var timeOutLeadsToFail = false;
var timeoutValue = 0;
var delayValue = 0;
var currentBirdID = "";
var currentStage = null;

var initialTrialID = 1;

// Call backs for the data functions below
function setLagartoToDevice(result) {
    console.log("lagartoToDevice", result);
    lagartoToDevice = result;
}

function setExpNodeToDeviceName(result) {
    console.log("expNodeToDeviceName", result);
    expNodeToDeviceName = result;
}

function setDeviceNameToExpNode(result) {
    console.log("deviceNameToExpNode", result);
    deviceNameToExpNode = result;
}

function setExpToDevice(result) {
    console.log("expToDevice", result);
    expToDevice = result;
}

// Mappings between Experiment Nodes, Device ID's, and Lagarto ID's
onlineDeviceList = {};

data.getDeviceToLagartoMapping(setLagartoToDevice);
data.getExpNodeToDeviceName(setExpNodeToDeviceName);
data.getDeviceNameToExpNode(setDeviceNameToExpNode);
data.getDeviceMapping(setExpToDevice);

// Map these onto the data functions




// get the online list
    // tie this to the UI event, so it has given enough time to get a handle on what is currently online
// add the mapping to that online list (get the device mapping)


// reset all values
var resetAllValues = function() {
    currentBirdID = 0;
    currentStage = null;
    currentNumOfTrials = 0;
    currentBlock = [];
    currentTrialNum = 0;
    timeoutValue = 0;
    timeOutLeadsToFail = false;
    delayValue = 0;
}

var generateNextTrialIDInAdvance = function(newID){
    console.log("generate ID", newID);
    initialTrialID = newID;
}

var trialGenerator = function() {

    // Filled from the stage object
    stageID = currentStage.name;
    timeoutValue = currentStage.autoEndTime * 1000;
    delayValue = currentStage.delay * 1000;
    timeOutLeadsToFail = currentStage.autoEnd;

    birdID = currentBirdID;
    numOfTrials = currentNumOfTrials;

    
    availableFeeders = [];
    
    // take only the selected feeders to add to the bucket
    function fillBucket() {
        
        // Old method - kept for bug checking
        //for (var i=1;i<=numOfAvailableFeeders;i++) {
        //    availableFeeders.push(i);
        //}

        for (var i=0; i <= currentStage.feederArrangement.length; i++) {
            if (currentStage.feederArrangement[i] == true) {
                availableFeeders.push(i+1);
            }
        }
        numOfAvailableFeeders = availableFeeders.length;
    }

    // Will be replaced with recopying the initital stage.feeders
    fillBucket();

    //Sample without replacement
    function getRandomFromBucket() {
       var randomIndex = Math.floor(Math.random()*availableFeeders.length);
       return availableFeeders.splice(randomIndex, 1)[0];
    }

    // Generate Trials
    var block = [];
    for (id=initialTrialID; id < initialTrialID + numOfTrials; id++) {
        block.push({'trialID': id, 'bird': birdID, 'stage': stageID, 
                        'intended': getRandomFromBucket(), 'actual': '', 'success': null, 
                        'startTime': '', 'endTime': '', 'totalTime': '', 'videoFilePath': '', 'notes': ''});
        //console.log((id - initialTrialID + 1) % (numOfAvailableFeeders) == 0);
        if ((id - initialTrialID + 1) % (numOfAvailableFeeders) == 0) {
            //console.log(availableFeeders.length);
            fillBucket();
            //console.log(availableFeeders.length);
        }
    }

    // requires additional check to see if there is enough meat to support this session!

    return block;
}


var experiment = new machina.Fsm( {

    // the initialize method is called right after the FSM
    // instance is constructed, giving you a place for any
    // setup behavior, etc. It receives the same arguments
    // (options) as the constructor function.
    initialize: function( options ) {
        // your setup code goes here...
    },

    namespace: "controller",

    // The initial State the FSM will be started in
    initialState: "uninitialized",

    // Experimental States
    states: {
        uninitialized: {
            _onEnter: function() {
                
            },

            "*": function() {

            },

            _onExit: function() {

            },

            initialize: function() {
                this.transition( "freeForm" );
            }

        },

        freeForm: {
            _onEnter: function() {
                console.log("entered freeform mode")
            },

            "*": function() {

            },

            _onExit: function() {

            },

            dropMeat: function(feederID) {
                console.log(feederID);

                // Transform experimental Feeder ID into the actual device Name
                deviceNameID = expNodeToDeviceName[feederID];

                // DEVICEMAPPING
                lagarto.dropMeat(deviceNameID);
            },

            lightOn: function(lightID) {
                //Hardwired for Node 1, TO-DO make general case
                console.log("turn light on: ", lightID);

                // DEVICEMAPPING
                lagarto.turnLightOn(lightID);

            },

            lightOff: function(lightID) {
                console.log("turn lights off");

                // DEVICEMAPPING
                lagarto.turnLightOff(lightID);

            },

            startExperiment: function(birdID, stage) {
                currentBirdID = birdID;
                currentStage = stage;
                console.log("before create next trial ID");
                data.getNextTrialID(birdID, stageID, generateNextTrialIDInAdvance);
                this.transition( "experiment" );

            },

            reInitialize: function(){
                // Reset the feeder mappings
                this.transition( "uninitialized" );
            },

            perchEvent: function(perchID) {
                console.log("perch event occured inside freeForm", perchID);
            }

        },

        experiment: {
            _onEnter: function() {

            },

            "*": function() {
                console.log("caught event inside experiment");
            },

            _onExit: function() {

            },

            startSession: function(numOfTrials) {
                currentNumOfTrials = numOfTrials;
                currentBlock = trialGenerator();
                this.transition( "session" );

            },

            cancelExperiment: function() {
                // reset all values
                resetAllValues();
                this.transition("freeForm");
            },

        },

        session: {
            _onEnter: function() {
                console.log("In session");

                // Are there still trials remaining to be run?
                if (currentTrialNum < currentBlock.length) {
                    // Delay before running next trial
                    console.log("Delaying Trial Start by:", delayValue);
                    currentBlock[currentTrialNum].totalTime = "[Delaying by " + (delayValue/1000) + "sec ...]";
                    this.timer = setTimeout( function() {
                        this.handle( "delayEnded" );
                    }.bind( this ), delayValue );
                    
                } else {
                    this.transition("endedSession");
                }
                
            },

            delayEnded: function() {
                console.log("delayed ended, trial starting");
                currentBlock[currentTrialNum].totalTime = "[running...]";
                this.transition( "trial" );
            },

            "*": function() {

            },

            _onExit: function() {

            },

            endSession: function() {
                this.transition("endedSession");
            },



        },

        trial: {
            _onEnter: function(randomNumber) {
                console.log("In trial ", currentTrialNum);
                currentBlock[currentTrialNum].startTime = new Date().getTime();


                // DEVICEMAPPING
                lagarto.turnLightOn(currentBlock[currentTrialNum].intended);


                this.timer = setTimeout( function() {
                    this.handle( "timeout" );
                }.bind( this ), timeoutValue );
                
            },

            timeout: function() {
                currentBlock[currentTrialNum].endTime = new Date().getTime();
                currentBlock[currentTrialNum].totalTime = currentBlock[currentTrialNum].endTime - currentBlock[currentTrialNum].startTime
                currentBlock[currentTrialNum].actual = 'timeout';
                currentBlock[currentTrialNum].success = false;

                // DEVICEMAPPING
                lagarto.turnLightOff(currentBlock[currentTrialNum].intended);

                console.log(currentBlock[currentTrialNum]);

                if (timeOutLeadsToFail) {
                    this.transition( "failedSession" );
                } else {
                    // Carry on with the block
                    // If finished, go to ended session, not session
                    if (currentTrialNum+1 >= currentBlock.length) {
                        this.transition('endedSession');
                    }
                    //else 

                    // Log the trial outcome
                    data.logTrial(currentBlock[currentTrialNum]);
                    currentTrialNum = currentTrialNum + 1;
                    this.transition('session');
                }
                
            },

            "*": function() {

            },

            _onExit: function() {

            },

            perchEvent: function(perchID) {
                clearTimeout( this.timer );
                console.log("Perch event inside trial", perchID);

                currentBlock[currentTrialNum].endTime = new Date().getTime();
                currentBlock[currentTrialNum].totalTime = currentBlock[currentTrialNum].endTime - currentBlock[currentTrialNum].startTime
                



                // Mapping from device ID to experimental ID required
                currentBlock[currentTrialNum].actual = perchID;

                // DEVICEMAPPING
                lagarto.turnLightOff(currentBlock[currentTrialNum].intended);

                if (currentBlock[currentTrialNum].intended == currentBlock[currentTrialNum].actual) {
                    currentBlock[currentTrialNum].success = true;
                    console.log(currentBlock[currentTrialNum]);

                    // Time to reward the bird for sending the dropMeat Command to the revlant feeder

                    // feederID is the same as the perchID, as they are the same device

                    // Transform experimental Feeder ID into the actual device Name
                    deviceNameID = expNodeToDeviceName[currentBlock[currentTrialNum].intended];

                    // Drop the Meat
                    // DEVICEMAPPING
                    lagarto.dropMeat(deviceNameID);

                    // If finished, go to ended session, not session
                    if (currentTrialNum+1 >= currentBlock.length) {
                        this.transition('endedSession');
                    } else {
                        // Log the trial outcome
                        data.logTrial(currentBlock[currentTrialNum]);

                        currentTrialNum = currentTrialNum + 1;
                        this.transition('session');
                    }

                    
                } else {
                    currentBlock[currentTrialNum].success = false;
                    console.log(currentBlock[currentTrialNum]);

                    // If finished, go to ended session, not session
                    if (currentTrialNum+1 >= currentBlock.length) {
                        this.transition('endedSession');
                    } else {
                        // Log the trial outcome
                        data.logTrial(currentBlock[currentTrialNum]);

                        currentTrialNum = currentTrialNum + 1;
                        this.transition('session');
                    }
                }

                
            },

            endSession: function() {
                clearTimeout( this.timer );
                // deal with the current trial

                this.transition("endedSession");
            },

        },

        failedSession: {
            _onEnter: function() {
                console.log("failed session!");
            }, 

            wrapUpSession: function (note) {
                console.log(currentBlock);

                // Log the trial with the related note
                currentBlock[currentTrialNum].notes = note;
                data.logTrial(currentBlock[currentTrialNum]);

                resetAllValues();
                this.transition('freeForm');
            },

            "*": function() {

            },

            _onExit: function() {

            },

        },

        endedSession: {
            _onEnter: function() {
                console.log("Inside ended session");
            },

            wrapUpSession: function (note) {
                console.log(currentBlock);

                // Log the trial with the related note
                currentBlock[currentTrialNum].notes = note;
                data.logTrial(currentBlock[currentTrialNum]);

                resetAllValues();
                this.transition('freeForm');
            },

            "*": function() {

            },

            _onExit: function() {

            },

        },


    },
    // External Facing API

    initializeDevices: function(newDeviceMapping) {
        console.log("initialize API");
        experiment.setDeviceMapping(newDeviceMapping);
        this.handle( "initialize" );
    },

    startExperiment: function(birdID, stage) {
        console.log("startExperiment API", birdID, stage);
        this.handle("startExperiment", birdID, stage);
    },

    cancelExperiment: function() {
        console.log("cancelExperiment API");
        this.handle( "cancelExperiment" );
    },

    startSession: function(numOfTrials) {
        console.log("startSession API", numOfTrials);
        this.handle("startSession", numOfTrials);
    },

    endSession: function() {
        console.log("endSession API");
        this.handle( "endSession" );
    },

    wrapUpSession: function(note) {
        console.log("wrapUpSession API");
        this.handle( "wrapUpSession", note);
    },

    // FreeForm Action Methods
    dropMeat: function(feederID) {
        console.log("dropMeat API", feederID);
        this.handle("dropMeat", feederID);
        //lagarto.sendMessage();
    },

    lightOn: function(lightID) {
        console.log("lightOn API", lightID);
        this.handle("lightOn", lightID);
    },

    lightOff: function(lightID) {
        console.log("lightOff API");
        this.handle( "lightOff", lightID);
    },

    perchEvent: function(perchID) {
        console.log("perchEvent API");
        this.handle("perchEvent", perchID);
    },

    // Experimental Methods
    meatDropped: function(feederID) {
        console.log("meatDropped API");
        this.handle("meatDroppedEvent", feederID);
    },

    lightChanged: function(lightID) {
        console.log("perchEvent API");
        this.handle("lightChangedEvent", lightID);
    },


    // Feeder Stages Methods
    stopFeeder: function(feederID) {
        console.log("stopFeeder API", feederID);

        // Transform experimental Feeder ID into the actual device Name
        deviceNameID = expNodeToDeviceName[feederID];
        lagarto.stopFeeder(deviceNameID);

        // Consider the interaction with the state machine later
        //this.handle("stopFeeder", feederID);
    },

    resetFeeder: function(feederID) {
        console.log("resetFeeder API", feederID);
        // Transform experimental Feeder ID into the actual device Name
        deviceNameID = expNodeToDeviceName[feederID];
        lagarto.resetFeeder(deviceNameID);

        // Consider the interaction with the state machine later
        //this.handle("resetFeeder", feederID);
    },

    primeFeeder: function(feederID) {
        console.log("primeFeeder API", feederID);
        // Transform experimental Feeder ID into the actual device Name
        deviceNameID = expNodeToDeviceName[feederID];
        lagarto.primeFeeder(deviceNameID);

        // Consider the interaction with the state machine later
        //this.handle("primeFeeder", feederID);
    },


    // End Experimental Methods

    addNewBird: function(newBird, res) {
        console.log("addNewBird API", newBird);
        data.newBird(newBird, res, experiment.getBirds);
        //return data.getBirds();
    },

    addNewStage: function(newStage, res) {
        console.log("addNewStage API", newStage);
        data.newStage(newStage,res, experiment.getStages);
        //return data.getStages()
    },

    // Data Methods
    getCurrentSessionProgress: function() {

        // accept row value
        // filer the 'currentBlock' by that value onwards
        // return that block of data

        return currentBlock;
    },

    getBirds: function(res) {
        data.getBirds(res);
    },

    getStages: function(res) {
        data.getStages(res);
    },

    getOnlineDeviceListFreeform: function() {

        // But should I also change the current state?
        this.handle( "reInitialize" );
        return experiment.getOnlineDeviceList();
    },

    getOnlineDeviceList: function() {

        console.log("Insider getDevicesList in controller");
        onlineDeviceList = lagarto.getOnlineDeviceList();

        console.log(expToDevice);
        console.log(onlineDeviceList);
        console.log(lagartoToDevice);
        console.log("Retrived values from devices in controller");
        // reverse list

        feeders = {'feederList': [
            {'id': 1, 'mappedTo': expToDevice[0].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[0].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[0].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[0].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[0].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' }, 
            {'id': 2, 'mappedTo': expToDevice[1].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[1].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[1].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[1].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[1].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' },
            {'id': 3, 'mappedTo': expToDevice[2].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[2].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[2].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[2].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[2].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' },
            {'id': 4, 'mappedTo': expToDevice[3].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[3].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[3].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[3].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[3].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' },
            {'id': 5, 'mappedTo': expToDevice[4].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[4].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[4].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[4].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[4].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' },
            {'id': 6, 'mappedTo': expToDevice[5].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[5].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[5].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[5].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[5].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' },
            {'id': 7, 'mappedTo': expToDevice[6].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[6].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[6].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[6].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[6].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' },
            {'id': 8, 'mappedTo': expToDevice[7].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[7].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[7].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[7].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[7].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' },
            {'id': 9, 'mappedTo': expToDevice[8].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[8].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[8].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[8].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[8].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black' },
            {'id': 10, 'mappedTo': expToDevice[9].deviceID, 
            'batteryLevel': onlineDeviceList[lagartoToDevice[expToDevice[9].deviceID]].batteryLevel, 
            'meatRemaining': onlineDeviceList[lagartoToDevice[expToDevice[9].deviceID]].meatRemaining, 
            'state': onlineDeviceList[lagartoToDevice[expToDevice[9].deviceID]].state, 
            'connected': onlineDeviceList[lagartoToDevice[expToDevice[9].deviceID]].online, 
            'colour': 'red', 'perch-colour': 'black'}],
                    'onlineList': [
                    {'id': 'a', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[0].deviceID]].online}, 
                    {'id': 'b', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[1].deviceID]].online}, 
                    {'id': 'c', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[2].deviceID]].online}, 
                    {'id': 'd', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[3].deviceID]].online}, 
                    {'id': 'e', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[4].deviceID]].online},
                    {'id': 'f', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[5].deviceID]].online}, 
                    {'id': 'g', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[6].deviceID]].online}, 
                    {'id': 'h', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[7].deviceID]].online}, 
                    {'id': 'i', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[8].deviceID]].online}, 
                    {'id': 'j', 'connected': onlineDeviceList[lagartoToDevice[expToDevice[9].deviceID]].online},
                    ]};

            for (var i=0; i<10; i++) {
                if (feeders['feederList'][i].connected == true){
                    feeders['feederList'][i].colour = 'green';
                }
            }

        console.log(feeders);
        return feeders;
    },

    getDeviceMapping: function() {
        return expNodeToDeviceName;
    },

    setDeviceMapping: function(newDeviceMapping) {
        

        // Take what is passed through to update the data.setDeviceMapping
        // and also whatever temp variable that is required during the course of this session

        // This is what is returned, turn this into
        


        deviceNameToExpNode1 = {'a': '1', 
                            'b': '2', 
                            'c': '3', 
                            'd': '4', 
                            'e': '5',
                            'f': '6', 
                            'g': '7', 
                            'h': '8', 
                            'i': '9', 
                            'j': '10'};


        expNodeToDeviceName1 = {'1': 'a', 
                            '2': 'b', 
                            '3': 'c', 
                            '4': 'd', 
                            '5': 'e',
                            '6': 'f', 
                            '7': 'g', 
                            '8': 'h', 
                            '9': 'i', 
                            '10': 'j'};

        /*
        deviceMapping = [{nodeID: 1, deviceID: 'a'}, 
                        {nodeID: 2, deviceID: 'b'}, 
                        {nodeID: 3, deviceID: 'c'}, 
                        {nodeID: 4, deviceID: 'd'}, 
                        {nodeID: 5, deviceID: 'e'},
                        {nodeID: 6, deviceID: 'f'}, 
                        {nodeID: 7, deviceID: 'g'}, 
                        {nodeID: 8, deviceID: 'h'}, 
                        {nodeID: 9, deviceID: 'i'}, 
                        {nodeID: 10, deviceID: 'j'}];
        */

        for (var i=0; i<10; i++) {
            deviceNameToExpNode1[newDeviceMapping[i].deviceID] = newDeviceMapping[i].nodeID;

            expNodeToDeviceName1[i+1] = newDeviceMapping[i].deviceID;
        }

        deviceNameToExpNode = deviceNameToExpNode1;
        expNodeToDeviceName = expNodeToDeviceName1;
        expToDevice = newDeviceMapping;
        console.log("deviceNameToExpNode: ",deviceNameToExpNode);
        console.log("expNodeToDeviceName: ", expNodeToDeviceName)


        data.setDeviceMapping(newDeviceMapping);
    },

    getLeaderBoard: function() {
        return data.getLeaderBoard();
    },

    getTrialsOfBirdInStage: function(birdID, stageID, res) {
        data.getTrialsOfBirdInStage(birdID, stageID, res);
    },

    getCurrentBatteryLife: function() {
        return lagarto.getCurrentBatteryLife();
    },

} );

// Logging for any handeler event and state change
experiment.on("*", function (eventName, data){
    // uncomment to see all the stage changes printed to console
    //console.log("this thing happened:", eventName, data);
});


// create an instance of the Meerkat class
var meerkat = new lagarto.Meerkat();

// add an 'perch' event listener
meerkat.on('perchEvent', function(perchID) {
    console.log('perch event listenter: "%s"', perchID);

    // Parse deviceID to experimental nodeID

    expNode = deviceNameToExpNode[perchID];
    console.log(expNode);

    experiment.perchEvent(expNode);
});

// add a 'meatDropped' event listener
meerkat.on('meatDropped', function(feederID) {
    console.log('meatDropped event listenter: "%s"', feederID);

    // Parse deviceID to experimental nodeID

    experiment.meatDropped(feederID);
});

// add a 'lightChange' event listener
meerkat.on('lightChanged', function(lightID) {
    console.log('lightChanged event listenter: "%s"', lightID);

    // Parse deviceID to experimental nodeID

    experiment.lightChanged(lightID);
});

// add a 'device offline' event listener
meerkat.on('feederOfline', function(feederID) {
    console.log('Feeder went offline: "%s"', feederID);

    // Parse deviceID to experimental nodeID

    //experiment.perchEvent(perchID);
});

// add a 'feeder online' event listener
meerkat.on('feederOnline', function(feederID) {
    console.log('Feeder went online: "%s"', feederID);

    // Parse deviceID to experimental nodeID

    //experiment.perchEvent(perchID);
});

// add a 'meat levels updated' event listener - - - this could be combine with meat dropped perhaps
meerkat.on('meatUpdate', function(feederID, meatLeft) {
    console.log('Meat levels changed: "%s %s"', feederID, meatleft);

    // Parse deviceID to experimental nodeID

    //experiment.perchEvent(perchID);
});

// add a 'lightChange' event listener
meerkat.on('dunno', function(perchID) {
    console.log('[dunno] perch event listenter: "%s"', perchID);

    // Parse deviceID to experimental nodeID

    //experiment.perchEvent(perchID);
});


// What other actions should be listened for

// Meat levels changed

// Battery levels changed

// devices going online / offline




// Start with: get all available devices (called from when a state changes, prompted by UI)

// Then subscribe to updates after that




// get state

// battery lists
// meat left lists
// device on list


// devices can be stateless, controller keeps it all up-to-date

// setup phases loads in the list
// calls devices to get the initial list
//      - what is on, what the battery levels are, how much meat is left, what the deviceID's are
//  devices doesnt really care what the experimental nodes are, or what is being used, its just an interface




module.exports.experiment = experiment;