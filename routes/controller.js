var machina = require('machina');
var request = require('request');
var lagarto = require('./devices');
//var data = require('./data');

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
                this.transition( "freeForm" );
            },

            "*": function() {

            },

            _onExit: function() {

            },

            initialize: function() {

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

            },

            cancelExperiment: function() {

            },

        },

        session: {
            _onEnter: function() {

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

    dropMeat: function() {
        console.log("dropMeat API");
        this.handle( "dropMeat" );
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


// create an instance of the Radio class
var meerkat = new lagarto.Meerkat();

// add an 'open' event listener
meerkat.on('perchEvent', function(message) {
    console.log('"%s" - inside event listener', message);
});

// add a 'close' event listener
meerkat.on('meatDropped', function(message) {
    console.log('"%s" - inside event listener', message);
});

meerkat.on('lightChanged', function(message) {
    console.log('"%s" - inside event listener', message);
});


module.exports.experiment = experiment;