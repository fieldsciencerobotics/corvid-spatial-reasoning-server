/* ZeroMQ */ 
var zmq = require('zmq')
  , sock = zmq.socket('sub');
 
sock.connect('tcp://192.168.1.16:5001');
//sock.subscribe('kitty cats');
console.log('Subscriber connected to port 5001');
 
sock.on('message', function(topic, message) {
  console.log('received a message related to:', topic, 'containing message:', message);
});


//var sock2 = zmq.socket('pub'); 
//sock2.bindSync('tcp://127.0.0.1:5001');
//console.log('Publisher bound to port 5001');



// ZMQ methods for sorting out what devices are connected


// ZMQ Listner for Perch events


// ZMQ sender for Meat Drop Commands


// ZMQ sender for turning a light on


// ZMQ sender for turning all the lights off



// Methods to be exported
var exports = module.exports = {};

// Test method to be removed...
exports.sendMessage = function() {
	console.log('sending a multipart message envelope');
  sock2.send(['kitty cats', 'meow!']);
};


// Meat Events
exports.dropMeat = function(experimentalNodeID) {

};

exports.getRemainingMeat = function(experimentalNodeID) {

};


// Light Events
exports.turnLightOn = function(experimentalLightID) {

};

exports.turnLightsOFF = function() {

};


// subscribe to perch events... look up javascript patterns for how this can work....




// Detect all connected devices

// Detect new detected device, device that has left? device that has changed?


// Polling of devices to remain confident as to their connection states?



// How to setup the initial mappings



