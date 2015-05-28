/* Event Emitter */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/* ZeroMQ */ 
var zmq = require('zmq')
  , sock = zmq.socket('sub')
  , sock2 = zmq.socket('pub');

sock2.bindSync('tcp://127.0.0.1:5001');

/* Request */  
var request = require('request');
 

// The EventEmitter Object that will report events back to the controller
var Meerkat = function() {

    // we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
    // using `this` in the setTimeout functions will refer to those funtions, not the Radio class
    var self = this;
    
    // Connect to Lagarto over ZMQ to subscrbe to events
	sock.connect('tcp://127.0.0.1:5001');
	sock.subscribe('');
	console.log('Subscriber connected to port 5001');
	 
	sock.on('message', function(topic, message) {
	  console.log('received a message related to:', topic, 'containing message:', message);

	  switch ( topic ) {
	    case 'perchEvent':
	        //Parse the message
	        console.log("PerchEvent");

	        self.emit('perchEvent', message)


	        break; 
	    case 'MeatFinishedDropping':
	        //Parse the message
	        console.log("MeatFinishedDropping");


	        self.emit('MeatDropped', message)

	        break;
	    case 'LightChanged':
	        //Parse the message
	        console.log("LightChanged");


	        self.emit('LightChanged', message)

	        break; 
	    default: 
	        console.log("unhandled event");

	        self.emit('dunno', message)


		}
	});

    
    // EventEmitters inherit a single event listener, see it in action
    this.on('newListener', function(listener) {
        console.log('Event Listener: ' + listener);
    });
    
};

// extend the EventEmitter class using our Meerkat class
util.inherits(Meerkat, EventEmitter);


// Methods to be exported
var exports = module.exports = {};

// we specify that this module is a refrence to the Meerkat class
exports.Meerkat = Meerkat;

// Test method to be removed...
exports.sendMessage = function() {
  console.log('sending a multipart message envelope');
  sock2.send(['', 'meow!']);
};

//
// Detecting Devices Methods
//
exports.getDevices = function() {

	//Perhaps this should pre cache??

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=7.11.0&value=true', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent")
      }
    })
};


//
// Meat Events
//
exports.dropMeat = function(experimentalNodeID) {

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=7.11.0&value=true', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent")
      }
    })
};

exports.getRemainingMeat = function(experimentalNodeID) {

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=7.11.0&value=true', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent")
      }
    })

};


//
// Light Events
//
exports.turnLightOn = function(experimentalLightID) {

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=7.11.0&value=true', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent")
      }
    })

};

exports.turnLightsOff = function() {

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=7.11.0&value=true', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent")
      }
    })

};