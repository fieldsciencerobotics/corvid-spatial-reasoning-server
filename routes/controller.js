var machina = require('machina');
var request = require('request');
var data = require('./data');



var controller = new machina.Fsm( {

    // the initialize method is called right after the FSM
    // instance is constructed, giving you a place for any
    // setup behavior, etc. It receives the same arguments
    // (options) as the constructor function.
    initialize: function( options ) {
        // your setup code goes here...
    },

    namespace: "controller",

    // `initialState` tells machina what state to start the FSM in.
    // The default value is "uninitialized". Not providing
    // this value will throw an exception in v1.0+
    initialState: "uninitialized",

    // The states object's top level properties are the
    // states in which the FSM can exist. Each state object
    // contains input handlers for the different inputs
    // handled while in that state.
    states: {
        uninitialized: {
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


    },
    reset: function() {
        this.handle( "_reset" );
    },

    pedestrianWaiting: function() {
        this.handle( "pedestrianWaiting" );
    }


    // External Facing API

    initialize: function() {
        console.log("initialize API");
        this.handle( "__handler_name" );
    }

    startExperiment: function() {
        console.log("startExperiment API");
        this.handle( "__handler_name" );
    }

    startSession: function() {
        console.log("startSession API");
        this.handle( "__handler_name" );
    }

    endSession: function() {
        console.log("endSession API");
        this.handle( "__handler_name" );
    }

    dropMeat: function() {
        console.log("dropMeat API");
        this.handle( "__handler_name" );
    }

    lightOn: function() {
        console.log("lightOn API");
        this.handle( "__handler_name" );
    }

    lightsOff: function() {
        console.log("lightsOff API");
        this.handle( "__handler_name" );
    }

    perchEvent: function() {
        console.log("perchEvent API");
        this.handle( "__handler_name" );
    }

} );

controller.on("*", function (eventName, data){
    console.log("this thing happened:", eventName, data);
});

module.exports.controller = controller;