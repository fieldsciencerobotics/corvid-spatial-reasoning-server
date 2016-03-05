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
var lagartoIDtofeederName = {'1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e',
							'6': 'f', '7': 'g', '8': 'h', '9': 'i', '10': 'j'};

var feederNameToLagartoID = {'a': '1', 'b': '2', 'c': '3', 'd': '4', 'e': '5',
							'f': '6', 'g': '7', 'h': '8', 'i': '9', 'j': '10'};

var lagartoDotReferenceToFeederFunction = {'11.0': 'dropMeat', '11.0': 'primeMeat', '11.0': 'resetMeat', '17.0': 'perchEvent', '0': 'event'}; // battery, reset etc etc etc

var feederFunctionToLagartoDotReference = {'dropMeat': '11.0', 'primeMeat': '11.0', 'resetMeat': '11.0', 'stopMeat': '11.0', 'perchEvent': '17.0', 'event': '0'}; // battery, reset etc etc etc


// Indicator device
var indicatorToLagartoID = {'indicator1': '50'};
var indicatorFunctionToLagartoDotReference = {'1': '0', '2': '0', '3': '0', '4': '0', '5': '0', '6': '0',
											  '7': '0', '8': '0', '9': '0', '10': '0',};



var onlineDevices = {'1': {'deviceID': 'a', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false}, 
					'2': {'deviceID': 'b', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false},  
					'3': {'deviceID': 'c', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false}, 
					'4': {'deviceID': 'd', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false},  
					'5': {'deviceID': 'e', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false}, 
					'6': {'deviceID': 'f', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false}, 
					'7': {'deviceID': 'g', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false}, 
					'8': {'deviceID': 'h', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false},  
					'9': {'deviceID': 'i', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false}, 
					'10': {'deviceID': 'j', 'online': false, 'batteryLevel': 0, 'meatRemaining': 0, 'state': 0, 'recheck': false}, 
				};



// get the state

// get the remaining pieces of meat



// Method to poll for heartbeats
	// set recheck value to zero
	// poll all devices
	// aftertime out, if device is still recheck to zero, them assume it is offline


// The EventEmitter Object that will report events back to the controller
// Like a Meerkat, it is good at keeping watch : )
var Meerkat = function() {

    // we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
    // using `this` in the setTimeout functions will refer to those funtions, not the Radio class
    var self = this;
    
    // Connect to Lagarto over ZMQ to subscrbe to events
	sock.connect('tcp://0.0.0.0:5001');
	sock.subscribe('');
	console.log('Subscribed to Lagarto on port 5001');
	 
	sock.on('message', function(topic, message) {
	  	//console.log('Recieved Message: "%s"', topic);

	  	parsedMessage = String(topic);
	  	jsonMessage = JSON.parse(parsedMessage);
	  	protcolName = jsonMessage['lagarto']['procname'];
	  	httpServer = jsonMessage['lagarto']['httpserver'];
	  	status = jsonMessage['lagarto']['status'];

	  	
	  	if (typeof status === "undefined") {
		    console.log("status not defined");
		} else {
			//console.log(status);

	  		// Becuase it may contain multple values to status
	  		for (var i=0; i<status.length; i++) {
	  			name = status[i]['name'];
	  			idAndFunction = status[i]['id'].split(".");
	  			id = idAndFunction[0]; //pull out the start
	  			functionID = idAndFunction[1]+"."+idAndFunction[2]; //pull out the end
	  			value = status[i]['value'];

	  			console.log("***** Event details are:", name, id, functionID, value);

	  			// Hardcoded values - to be removed
			  	//eventType = 'perchEvent2';
			  	//deviceID = 1; // get this from
			  	//perchID = 1;
			  	//value = 'on';


			  	// Listening to Indicator events
			  	if (id == '50') {
			  		//console.log("this is an indicator related message")


			  		switch (functionID) {
				    	case '11.0': //'perchEvent':
				        	console.log("Indicator Heartbeat:", id, value);

				        	if (value == '0' || '1' ) {
				        		//ackIndicator();
				        	}

				        	//set value in particular list
				        	// akin to the way the feeders were done

				        	break;
				        case '12.0': //'perchEvent':
				        	console.log("Indicator Heartbeat Ack Recieved:", id, value);
				        	break;
				        case '13.0': //'perchEvent':
				        	console.log("Flag Raised:", id, value);
				        	break; 
				        case '14.0': //'perchEvent':
				        	console.log("Flag Lowered:", id, value);
				        	break; 

				    	default:
				    		console.log("Unmapped indicator event:", name, id, functionID, value);
				    		//code goes here

				    }


				// Listening to Feeder Events below
			  	} else {
			  		console.log("FEEDER MESSAGE:")


			  		// List of events to handle that come from the feeders

			  		switch (functionID) {
			  			// Perch Events
				    	case '25.0': //'perchEvent':
				        	console.log("PerchEvent", id, value);

				        	// Pasrse message, and topic

				        	perchID = id; //set this based on the contents of the message
				        	//if (value == '1') {
				        	//	self.emit('perchEvent', lagartoIDtofeederName[perchID]);
				        	//}


				        	switch (value) {
				        		case '1':
				        			console.log("Perch Occupied", id);
				        			self.emit('perchEvent', lagartoIDtofeederName[perchID]);
				        			break;
				        		case '0':
				        			console.log("Perch Vaccant", id);
				        			// code for when perch becomes un
				        			break
				        	}
				        	
				        	break; 
				        // Heartbeat events
				        case '19.0': //'perchEvent':
				        	console.log("Feeder Heartbeat:", id, value);

				        	onlineDevices[id].online = true;
				        	//console.log(onlineDevices);

				        	break; 

				        // Meat Action Events
				    	case '12.0':
				    		//Stopped=0,
							//ResetStarted=1,
							//ResetFinished=2,
							//PrimeMeatStarted=3,
							//PrimeMeatFinished=4,
							//DropMeatStarted=5,
							//DropMeatFinished=6,
							//MeatEmpty=7

					        console.log("Feeder Action Event", id, value);

					        switch (value) {
				        		case '0':
				        			console.log("Meat Stopped", id);
				        			break;
				        		case '1':
				        			console.log("Restart Started", id);
				        			// code for when perch becomes un
				        			break
				        		case '2':
				        			console.log("Restart Finished", id);
				        			// code for when perch becomes un
				        			break
				        		case '3':
				        			console.log("Prime Meat Started", id);
				        			break;
				        		case '4':
				        			console.log("Prime Meat Finished", id);
				        			// code for when perch becomes un
				        			break
				        		case '5':
				        			console.log("Drop Meat Started", id);
				        			// code for when perch becomes un
				        			break
				        		case '6':
				        			console.log("Drop Meat Finished", id);
				        			break;
				        		case '7':
				        			console.log("Meat Empty", id);
				        			// code for when perch becomes un
				        			break
				        	}





					        // Pasrse message, and topic

					        //feederID = 1; //set this based on the contents of the message
					        //self.emit('MeatDropped', feederID)

				        	break;

				       	// Configuration Events
				    	case '21.0':
					        console.log("Meat-Loaded-Thresh", id, value);

					        break;
					    case '21.1':
					        console.log("Meat-Dropped-Diff", id, value);

					        break;
					    case '21.2':
					        console.log("Perch-Occupied-Thresh", id, value);

					        break;
					    case '21.3':
					        console.log("Perch-Vaccant-Diff", id, value);

					        break;
					    case '21.4':
					        console.log("Motor Direction", id, value);

					        break;
					    case '21.5':
					        console.log("Max Meat Pieces", id, value);

					        break;

					    // Bettery Events
					    // Cell 1
				    	case '23.0':
					        console.log("BatteryUpdated. ", id, " Cell 1: ", value);
					        //self.emit('BatteryUpdated', deviceID)

					        break;
					    // Cell 2
					    case '23.1':
							console.log("BatteryUpdated. ", id, " Cell 2: ", value);
					        //self.emit('BatteryUpdated', deviceID)

					        break; 
					    //Cell 3
					    case '23.2':
							console.log("BatteryUpdated. ", id, " Cell 3: ", value);
					        //self.emit('BatteryUpdated', deviceID)

					        break;
					    // Meat Peices Left measure
					    case '24.0':
							console.log("Meat Pieces Left: ", id, value);
							onlineDevices[id].meatRemaining = value;
					        //self.emit('BatteryUpdated', deviceID)

					        break;  
				    	default: 
					        console.log("unhandled event");

					        perchID = 1; //set this based on the contents of the message
					        self.emit('dunno', perchID);
					}


			  	}

	  			// Did it come from the indicator?
	  			//if (id == indicatorToLagartoID['indicator1']) {

	  			//	eventType = indicatorFunctionToLagartoDotReference[functionID];


	  			//	switch (eventType) {
	  			//		case '':


	  			//			break;
	  			//		case '':


	  			//			break;
	  			//		case '':


	  			//			break;
	  			//		default:


	  			//	}
	  			//}
	  			/*
	  			// Did it come from a feeder node
	  			if (true) { //(feederNameToLagartoID[id]) { // is this device ID mapped to a feeder

	  				eventType = feederFunctionToLagartoDotReference[functionID];
	  				console.log(eventType);

	  				switch (functionID) {
				    	case '17.0': //'perchEvent':
				        	console.log("PerchEvent", id, value);

				        	// Pasrse message, and topic

				        	perchID = id; //set this based on the contents of the message
				        	if (value == 'on') {
				        		self.emit('perchEvent', lagartoIDtofeederName[perchID]);
				        	}
				        	


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

	  			*/

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
        //records when new event listeners subscribe
        //console.log('Event Listener: ' + listener);
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
  sock2.send(["{'lagarto': 'hello'}", 'meow!']);
};


//
// Detecting Devices Methods
//
exports.getDevices = function() {

	//Perhaps this should pre cache??



	for (var i = 0; i < 10; i++) {


	}


	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=7.11.0&value=true', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent")
      }
    })
};

exports.getOnlineDeviceList = function () {

	return onlineDevices;
}


exports.getBatteryLife = function() {

	// return all the remaining battery lifes 
	// do some in an arrary like
	return currentBattery = [1,1,1,1,1,1,1,1,1,1];
}



//
// Meat Events
//

// Prime Meat
exports.stopFeeder = function(deviceName) {

	// map device name, and the function to below
	deviceID = feederNameToLagartoID[deviceName];
	functionID = feederFunctionToLagartoDotReference['stopMeat']; //maps to 11.0
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = 0; // enum for primming meat

	console.log("Stop Meat on: ", deviceName);
	console.log("Which mapped onto: ", deviceAndFunctionID);

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent stop meat command")
      }
    })
};

// Prime Meat
exports.resetFeeder = function(deviceName) {

	// map device name, and the function to below
	deviceID = feederNameToLagartoID[deviceName];
	functionID = feederFunctionToLagartoDotReference['resetMeat']; //maps to 11.0
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = 1; // enum for primming meat

	console.log("Reset Meat on: ", deviceName);
	console.log("Which mapped onto: ", deviceAndFunctionID);

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent reset meat command")
      }
    })
};

// Prime Meat
exports.primeFeeder = function(deviceName) {

	// map device name, and the function to below
	deviceID = feederNameToLagartoID[deviceName];
	functionID = feederFunctionToLagartoDotReference['primeMeat']; //maps to 11.0
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = 2; // enum for primming meat

	console.log("Priming Meat on: ", deviceName);
	console.log("Which mapped onto: ", deviceAndFunctionID);

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent prime meat command")
      }
    })
};

// Drop Meat
exports.dropMeat = function(deviceName) {

	// map device name, and the function to below
	deviceID = feederNameToLagartoID[deviceName];
	functionID = feederFunctionToLagartoDotReference['dropMeat']; //maps to 11.0
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = 3; // enum for dropping meat

	console.log("Dropping Meat on: ", deviceName);
	console.log("Which mapped onto: ", deviceAndFunctionID);

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent drop meat command")
      }
    })
};

// This can't be asked for, it is just given after the other meat events. This method should just look up a saved varied that represents there last known state of meat remaining
exports.getRemainingMeat = function(deviceName) {

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=7.11.0&value=true', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent")
      }
    })

};



//
// Indicator (Light) Events
//


exports.ackIndicator = function() {

	deviceID = indicatorToLagartoID['indicator1'];
	functionID = '12.0'; 



	deviceAndFunctionID = deviceID + '.' + functionID;
	value = '5'; // value not important, just so long as there is one at all

	console.log("Acknowdging Indicator is Online: ", deviceAndFunctionID);

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent Indicator ACK - ACK function")
      }
    })

};

exports.turnLightOn = function(experimentalLightID) {

	deviceID = indicatorToLagartoID['indicator1'];
	functionID = '13.0'; //indicatorFunctionToLagartoDotReference[experimentalLightID];



	deviceAndFunctionID = deviceID + '.' + functionID;
	value = experimentalLightID; //or perhaps off / on ??

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
	functionID = '14.0'; //indicatorFunctionToLagartoDotReference[experimentalLightID];
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = experimentalLightID; //'false'; //or perhaps off / on ??

	console.log("Turning Light off on: ", experimentalLightID);
	console.log("Which mapped onto: ", deviceAndFunctionID);

	// Sent command to Lagarto
	request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + value, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Sent turn light off command")
      }
    })

};

exports.turnAllLightsOff = function() {

	deviceID = indicatorToLagartoID['indicator1'];
	functionID = '14.0'; //indicatorFunctionToLagartoDotReference[experimentalLightID];
	deviceAndFunctionID = deviceID + '.' + functionID;
	value = experimentalLightID; //'false'; //or perhaps off / on ??

	console.log("Turning Light off on: ", experimentalLightID);
	console.log("Which mapped onto: ", deviceAndFunctionID);

	for (var i = 0; i < 10; i++) {

		// Sent command to Lagarto
		request('http://127.0.0.1:8001/values?id=' + deviceAndFunctionID + '&value=' + i, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log("Sent turn All lights off command")
		  }
		})

	}
};