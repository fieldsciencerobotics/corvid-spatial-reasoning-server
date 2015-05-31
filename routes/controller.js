var machina = require('machina');
var request = require('request');
var lagarto = require('./devices');
//var data = require('./data');


var trialGenerator = function(bird, stage, numOfTrials) {

    stageID = stage;
    birdID = bird;
    initialTrialID = 1; //data.getNextTrialID(bird, stage);
    numOfTrials = numOfTrials;
    numOfAvailableFeeders = 5;
    availableFeeders = []; //stages.feeders;

    // assume only using 5 feeders for now, and this will be later replace with directly passing in stage.feeders
    function fillBucket() {
        for (var i=1;i<=numOfAvailableFeeders;i++) {
            availableFeeders.push(i);
        }
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
                        'intended': getRandomFromBucket(), 'actual': '', 
                        'startTime': '', 'endTime': '',});
        //console.log((id - initialTrialID + 1) % (numOfAvailableFeeders) == 0);
        if ((id - initialTrialID + 1) % (numOfAvailableFeeders) == 0) {
            //console.log(availableFeeders.length);
            fillBucket();
            //console.log(availableFeeders.length);
        }
    }

    for (var i=0; i < block.length; i++){
        console.log(block[i].trialID + " " + block[i].intended);
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

            },

            "*": function() {

            },

            _onExit: function() {

            },

            dropMeat: function() {
                //Hardwired for Node 1, TO-DO make general case
                lagarto.dropMeat(1);
            },

            lightOn: function() {
                //Hardwired for Node 1, TO-DO make general case
                lagarto.turnLightOn(1);

            },

            lightsOff: function() {
                //Hardwired for Node 1, TO-DO make general case
                lagarto.turnLightsOff(1);

            },

            startExperiment: function() {
                this.transition( "experiment" );

            },

            perchEvent: function() {
                
            }

        },

        experiment: {
            _onEnter: function() {

            },

            "*": function() {

            },

            _onExit: function() {

            },

            startSession: function() {
                var block = trialGenerator("red", "stage2", 15);

                this.transition( "session" );

            },

            cancelExperiment: function() {

            },

        },

        session: {
            _onEnter: function() {
                console.log("In seesion");

                // How do I pass through variables?
                // How do I keep a pointer to the current trial

                // How then do I transition into the next state, passing in the correct trial?


                this.transition( "trial" );
            },

            "*": function() {

            },

            _onExit: function() {

            },

            endSession: function() {

            },



        },

        trial: {
            _onEnter: function() {
                console.log("In trial");
                this.transition( "freeForm" );
            },

            "*": function() {

            },

            _onExit: function() {

            },

            perchEvent: function() {

            },

        },

        failedSession: {
            _onEnter: function() {

            },

            "*": function() {

            },

            _onExit: function() {

            },

        },

        endedSession: {
            _onEnter: function() {

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

    startExperiment: function() {
        console.log("startExperiment API");
        this.handle( "startExperiment" );
    },

    cancelExperiment: function() {
        console.log("cancelExperiment API");
        this.handle( "cancelExperiment" );
    },

    startSession: function() {
        console.log("startSession API");
        this.handle( "startSession" );
    },

    endSession: function() {
        console.log("endSession API");
        this.handle( "endSession" );
    },

    wrapUpSession: function() {
        console.log("wrapUpSession API");
        //this.handle( "wrapUpSession" );
    },

    dropMeat: function() {
        console.log("dropMeat API");
        this.handle( "dropMeat" );
        //lagarto.sendMessage();
    },

    lightOn: function() {
        console.log("lightOn API");
        this.handle( "lightOn" );
    },

    lightsOff: function() {
        console.log("lightsOff API");
        this.handle( "lightsOff" );
    },

    perchEvent: function() {
        console.log("perchEvent API");
        this.handle( "perchEvent" );
    },

} );

experiment.on("*", function (eventName, data){
    console.log("this thing happened:", eventName, data);
});


// create an instance of the Meerkat class
var meerkat = new lagarto.Meerkat();

// add an 'perch' event listener
meerkat.on('perchEvent', function(message, topic) {
    console.log('"%s" - inside event listener', message);
    experiment.perchEvent();
});

// add a 'meatDropped' event listener
meerkat.on('meatDropped', function(message, topic) {
    console.log('"%s" and "%s" - inside event listener', message, topic);
});

// add a 'lightChange' event listener
meerkat.on('lightChanged', function(message, topic) {
    console.log('"%s" and "%s" - inside event listener', message, topic);
});

// add a 'lightChange' event listener
meerkat.on('dunno', function(message, topic) {
    console.log('"%s" and "%s" - inside event listener', message, topic);
});


module.exports.experiment = experiment;