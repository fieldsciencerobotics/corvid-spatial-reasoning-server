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
            // Input handlers are usually functions. They can
            // take arguments, too (even though this one doesn't)
            // The "*" handler is special (more on that in a bit)
            "*": function() {
                //this.deferUntilTransition();
                // the `transition` method takes a target state (as a string)
                // and transitions to it. You should NEVER directly assign the
                // state property on an FSM. Also - while it's certainly OK to
                // call `transition` externally, you usually end up with the
                // cleanest approach if you endeavor to transition *internally*
                // and just pass input to the FSM.
                
                //this.transition( "green" );
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
                console.log("MEAT DROPPED");
            }

        },

        experiment: {
            _onEnter: function() {

            },

            "*": function() {

            },

            _onExit: function() {

            },

        },

        session: {
            _onEnter: function() {

            },

            "*": function() {

            },

            _onExit: function() {

            },

        },

        trial: {
            _onEnter: function() {

            },

            "*": function() {

            },

            _onExit: function() {

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

    initialize: function() {
        console.log("initialize API");
        this.handle( "__handler_name" );
    },

    startExperiment: function() {
        console.log("startExperiment API");
        this.handle( "__handler_name" );
    },

    startSession: function() {
        console.log("startSession API");
        this.handle( "__handler_name" );
    },

    endSession: function() {
        console.log("endSession API");
        this.handle( "__handler_name" );
    },

    dropMeat: function() {
        console.log("dropMeat API");
        this.handle( "dropMeat" );
    },

    lightOn: function() {
        console.log("lightOn API");
        this.handle( "__handler_name" );
    },

    lightsOff: function() {
        console.log("lightsOff API");
        this.handle( "__handler_name" );
    },

    perchEvent: function() {
        console.log("perchEvent API");
        this.handle( "__handler_name" );
    },

} );

experiment.on("*", function (eventName, data){
    console.log("this thing happened:", eventName, data);
});

module.exports.experiment = experiment;