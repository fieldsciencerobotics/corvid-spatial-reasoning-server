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


var expNodeToDeviceName = {'1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e',
                            '6': 'f', '7': 'g', '8': 'h', '9': 'i', '10': 'j'};

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

var trialGenerator = function() {

    // Filled from the stage object
    stageID = currentStage.name;
    timeoutValue = stage.autoEndTime;
    delayValue = stage.delay;
    timeOutLeadsToFail = stage.autoEnd;

    birdID = currentBirdID;
    initialTrialID = data.getNextTrialID(bird, stage); // currently will always return 1
    numOfTrials = currentNumOfTrials;

    
    availableFeeders = [];
    
    // take only the selected feeders to add to the bucket
    function fillBucket() {
        
        // Old method - kept for bug checking
        //for (var i=1;i<=numOfAvailableFeeders;i++) {
        //    availableFeeders.push(i);
        //}

        for (var i=0; i <= stage.feeders.length; i++) {
            if (stage.feeders[i] = true) {
                availableFeeders.push(i);
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

                lagarto.dropMeat(deviceNameID);
            },

            lightOn: function(lightID) {
                //Hardwired for Node 1, TO-DO make general case
                console.log("turn light on: ", lightID);
                lagarto.turnLightOn(lightID);

            },

            lightOff: function(lightID) {
                console.log("turn lights off");
                lagarto.turnLightOff(lightID);

            },

            startExperiment: function(birdID, stage) {
                currentBirdID = birdID;
                currentStage = stage;
                this.transition( "experiment" );

            },

            perchEvent: function(perchID) {
                console.log("perch event occured inside freeForm");
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
                console.log("In seesion");

                // Are there still trials remaining to be run?
                if (currentTrialNum < currentBlock.length) {
                    // Delay before running next trial
                    console.log("Delaying Trial Start by:", delayValue);
                    this.timer = setTimeout( function() {
                        this.handle( "delayEnded" );
                    }.bind( this ), delayValue );
                    
                } else {
                    this.transition("endedSession");
                }
                
            },

            delayEnded: function() {
                console.log("delayed ended, trial starting");
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
                lagarto.turnLightOn(currentBlock[currentTrialNum].intended);
                //console.log("passed through number", randomNumber);

                this.timer = setTimeout( function() {
                    this.handle( "timeout" );
                }.bind( this ), timeoutValue );
                
            },

            timeout: function() {
                currentBlock[currentTrialNum].endTime = new Date().getTime();
                currentBlock[currentTrialNum].totalTime = currentBlock[currentTrialNum].endTime - currentBlock[currentTrialNum].startTime
                currentBlock[currentTrialNum].actual = 'timeout';
                currentBlock[currentTrialNum].success = false;

                lagarto.turnLightOff(currentBlock[currentTrialNum].intended);

                console.log(currentBlock[currentTrialNum]);

                if (timeOutLeadsToFail) {
                    this.transition( "failedSession" );
                } else {
                    // Carry on with the block
                    // If finished, go to ended session, not session
                    if (currentTrialNum+1 < currentBlock.length) {
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
                
                currentBlock[currentTrialNum].actual = perchID;

                lagarto.turnLightOff(currentBlock[currentTrialNum].intended);

                if (currentBlock[currentTrialNum].intended == currentBlock[currentTrialNum].actual) {
                    currentBlock[currentTrialNum].success = true;
                    console.log(currentBlock[currentTrialNum]);

                    // Time to reward the bird for sending the dropMeat Command to the revlant feeder

                    // feederID is the same as the perchID, as they are the same device

                    // Transform experimental Feeder ID into the actual device Name
                    deviceNameID = expNodeToDeviceName[currentBlock[currentTrialNum].intended];

                    // Drop the Meat
                    lagarto.dropMeat(deviceNameID);

                    // If finished, go to ended session, not session
                    if (currentTrialNum+1 < currentBlock.length) {
                        this.transition('endedSession');
                    }
                    // else

                    // Log the trial outcome
                    data.logTrial(currentBlock[currentTrialNum]);

                    currentTrialNum = currentTrialNum + 1;
                    this.transition('session');
                } else {
                    currentBlock[currentTrialNum].success = false;
                    console.log(currentBlock[currentTrialNum]);

                    // If finished, go to ended session, not session
                    if (currentTrialNum+1 < currentBlock.length) {
                        this.transition('endedSession');
                    }
                    //else 

                    // Log the trial outcome
                    data.logTrial(currentBlock[currentTrialNum]);

                    currentTrialNum = currentTrialNum + 1;
                    this.transition('session');
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

    initializeDevices: function() {
        console.log("initialize API");
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
    },

    lightOn: function(lightID) {
        console.log("lightOn API", lightID);
        this.handle("lightOn", lightID);
    },

    lightOff: function(lightID) {
        console.log("lightsOff API");
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
    // End Experimental Methods

    addNewBird: function(newBird) {
        console.log("addNewBird API", newBird);
        data.newBird(newBird);
        return data.getBirds();
    },

    addNewStage: function(newStage) {
        console.log("addNewStage API", newStage);
        data.newStage(newStage);
        return data.getStages()
    },

    // Data Methods
    getCurrentSessionProgress: function() {
        return currentBlock;
    },

    getBirds: function() {
        return data.getBirds();
    },

    getStages: function() {
        return data.getStages();
    },

    getDeviceMapping: function() {
        return data.getDeviceMapping();
    }

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

    experiment.perchEvent(perchID);
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

// add a 'lightChange' event listener
meerkat.on('dunno', function(perchID) {
    console.log('[dunno] perch event listenter: "%s"', perchID);

    // Parse deviceID to experimental nodeID

    //experiment.perchEvent(perchID);
});


module.exports.experiment = experiment;