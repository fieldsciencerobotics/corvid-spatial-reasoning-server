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
 
// Mapping from Human Readable names to lagarto assigned ID's
// Not to be confussed with the experimental node ID, which will be unique to the arrangement of each session

// Feeder Devices
var lagartoIDtofeederName = {'7': 'a', '6': 'b', '0': 'c', '0': 'd', '0': 'e',
							'0': 'f', '0': 'g', '0': 'h', '0': 'i', '0': 'j'};

var feederNameToLagartoID = {'a': '7', 'b': '6', 'c': '0', 'd': '0', 'e': '0',
							'f': '0', 'g': '0', 'h': '0', 'i': '0', 'j': '0'};

var lagartoDotReferenceToFeederFunction = {'11.0': 'dropMeat', '17.0': 'perchEvent', '0': 'event'}; // battery, reset etc etc etc

var feederFunctionToLagartoDotReference = {'dropMeat': '11.0', 'perchEvent': '17.0', 'event': '0'}; // battery, reset etc etc etc


// Indicator device
var indicatorToLagartoID = {'indicator1': '0'};
var indicatorFunctionToLagartoDotReference = {'1': '0', '2': '0', '3': '0', '4': '0', '5': '0', '6': '0',
											  '7': '0', '8': '0', '9': '0', '10': '0',};


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
	  	console.log('Recieved Message: "%s"', topic);

	  	parsedMessage = String(topic);
	  	jsonMessage = JSON.parse(parsedMessage);
	  	protcolName =jsonMessage['lagarto']['procname'];
	  	httpServer =jsonMessage['lagarto']['httpserver'];
	  	status = jsonMessage['lagarto']['status'];

	  	console.log(status);

	  	if (status.length > 0) { // this is not likely to really work... it will always trigger currently...

	  		// Becuase it may contain multple values to status
	  		for (var i=0; i<status.length; i++) {
	  			name = status['name'];
	  			idAndFunction = status['id'];
	  			id = idAndFunction; //pull out the start
	  			functionID = idAndFunction; //pull out the end
	  			value = status['value'];

	  			console.log("Event details are:", name, idAndFunction, value);

	  			// Hardcoded values - to be removed
			  	eventType = 'perchEvent2';
			  	deviceID = 1; // get this from
			  	perchID = 1;
			  	value = 'on';


	  			// Did it come from the indicator?
	  			if (id == indicatorToLagartoID['indicator1']) {

	  				eventType = indicatorFunctionToLagartoDotReference[functionID];


	  				switch (eventType) {
	  					case '':


	  						break;
	  					case '':


	  						break;
	  					case '':


	  						break;
	  					default:


	  				}
	  			}

	  			// Did it come from a feeder node
	  			if (feederNameToLagartoID[id]) { // is this device ID mapped to a feeder

	  				eventType = feederFunctionToLagartoDotReference[functionID];

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
	  			} 

	  		}
	  	}

	  });
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
  sock2.send(['hello', 'meow!']);
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


exports.getBatteryLife = function() {

	// return all the remaining battery lifes 
	// do some in an arrary like
	return currentBattery = [1,1,1,1,1,1,1,1,1,1];
}

//
// Meat Events
//
exports.dropMeat = function(deviceName) {

	// map device name, and the function to below
	deviceID = feederNameToLagartoID[deviceName];
	functionID = feederFunctionToLagartoDotReference['dropMeat']; //maps to 11.0
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = 'true';

	console.log("Dropping Meat on: ", deviceName);
	console.log("Which mapped onto: ", deviceAndFunctionID);

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

	deviceID = indicatorToLagartoID['indicator1'];
	functionID = indicatorFunctionToLagartoDotReference[experimentalLightID];
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = 'true'; //or perhaps off / on ??

	console.log("Turning Light on: ", experimentalLightID);
	console.log("Which mapped onto: ", deviceAndFunctionID);

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent turn ligh on command")
      }
    })

};

exports.turnLightOff = function(experimentalLightID) {

	deviceID = indicatorToLagartoID['indicator1'];
	functionID = indicatorFunctionToLagartoDotReference[experimentalLightID];
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = 'false'; //or perhaps off / on ??

	console.log("Turning Light off on: ", experimentalLightID);
	console.log("Which mapped onto: ", deviceAndFunctionID);

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent turn light off command")
      }
    })

};