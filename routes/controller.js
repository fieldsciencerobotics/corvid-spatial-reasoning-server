var machina = require('machina');
var request = require('request');
var data = require('./data');



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
                request('http://192.168.1.16:8001/values?id=23.11.0&value=2', function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                    console.log("Sent") // Show the HTML for the Google homepage. 
                  }
                })
                console.log("MEAT DROPPED");
            },

            lightOn: function() {

            },

            lightsOff: function() {

            },

            startExperiment: function() {

            },

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

module.exports.experiment = experiment;