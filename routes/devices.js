/* Event Emitter */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/* ZeroMQ */ 
var zmq = require('zmq')
  , sock = zmq.socket('sub')
  , sock2 = zmq.socket('pub');

//sock2.bindSync('tcp://127.0.0.1:5001');

/* Request */  
var request = require('request');
 
// Mapping from Human Readable names to lagarto assigned ID's
// Not to be confussed with the experimental node ID, which will be unique to the arrangement of each session

// Feeder Devices
var feederNameToLagartoID = {'a': '7', 'b': '0', 'c': '0', 'd': '0', 'e': '0',
							'f': '0', 'g': '0', 'h': '0', 'i': '0', 'j': '0'};
var feederFunctionToLagartoDotReference = {'dropMeat': '11.0'}; // battery, reset etc etc etc

// Indicator device
var indicatorToLagartoID = {'name': 'indicator1', 'lagartoID': '0'};
var indicatorFunctionToLagartoDotReference = {};


// The EventEmitter Object that will report events back to the controller
// Like a Meerkat, it is good at keeping watch : )
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

	  	parsedMessage = JSON.parse(message);
	  	console.log(parsedMessage['lagarto']['status']);

	  	//for (var i=0; i<arr.length; i++)
	    //    if (arr[i] === val)                    
	    //        return i;
	    //return false;

		// all the parsing work should take place here

		// Reset
		// "{"lagarto": 
				//{
				//"status": 
					//[{"direction": "out", "name": "Reset_7", "timestamp": "28 May 2015 06:00:17", "value": "on", "location": "SWAP", "type": "bin", "id": "7.12.0"}], 
				//"procname": "Lagarto-SWAP", 
				//"httpserver": "10.1.1.6:8001"
				//}
			//}"

		// Perch off
		//"{"lagarto": 
			//{"status": 
				//[{"direction": "inp", "name": "Perch_triggered_7", "timestamp": "28 May 2015 05:59:34", "value": "off", "location": "SWAP", "type": "bin", "id": "7.17.0"}], 
			//"procname": "Lagarto-SWAP", "httpserver": "10.1.1.6:8001"}}"

		// Perch event to parse
		//"{"lagarto": 
			//{"status": 
				//[{"direction": "inp", "name": "Perch_triggered_7", "timestamp": "28 May 2015 05:59:34", "value": "on", "location": "SWAP", "type": "bin", "id": "7.17.0"}], 
			//"procname": "Lagarto-SWAP", "httpserver": "10.1.1.6:8001"}}"


		//Get the event name
		//message.lagarto.status [get the array element].name

		//Get the event lagarto dot prefix
		//message.lagarto.status [get the array element].id

		//Get the event value
		//message.lagarto.status [get the array element].value

		// Event Type
	  	eventType = 'perchEvent2'; // or meatDropped, or battery, or light or etc...
	  	deviceID = 1; // get this from
	  	perchID = 1;
	  	value = 'on';


	  	switch (eventType) {
	    	case 'perchEvent':
	        	console.log("PerchEvent", deviceID, value);

	        	// Pasrse message, and topic

	        	perchID = 1; //set this based on the contents of the message
	        	self.emit('perchEvent', perchID);


	        	break; 
	    	case 'MeatFinishedDropping':
		        console.log("MeatFinishedDropping", deviceID, value);

		        // Pasrse message, and topic

		        feederID = 1; //set this based on the contents of the message
		        self.emit('MeatDropped', feederID)

	        	break;
	    	case 'LightChanged':
		        console.log("LightChanged", lightID);

		        // Pasrse message, and topic

		        lightID = 1; //set this based on the contents of the message
		        self.emit('LightChanged', lightID)

		        break;
	    	case 'BatteryUpdate':
		        console.log("BatteryUpdated", deviceID);

		        // Pasrse message, and topic

		        lightID = 1; //set this based on the contents of the message
		        self.emit('BatteryUpdated', deviceID)

		        break; 
	    	default: 
		        console.log("unhandled event");

		        perchID = 1; //set this based on the contents of the message
		        self.emit('dunno', perchID);
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
  //sock2.send(['', 'meow!']);
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
exports.dropMeat = function(deviceName) {

	// map device name, and the function to below
	deviceID = feederNameToLagartoID[deviceName];
	functionID = feederFunctionToLagartoDotReference.dropMeat; //maps to 11.0
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = 'true';

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent drop meat command")
      }
    })
};

exports.getRemainingMeat = function(deviceName) {

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