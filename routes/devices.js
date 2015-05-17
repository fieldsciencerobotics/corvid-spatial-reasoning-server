/* ZeroMQ */ 
var zmq = require('zmq')
  , sock = zmq.socket('sub');
 
sock.connect('tcp://127.0.0.1:5001');
sock.subscribe('kitty cats');
console.log('Subscriber connected to port 5001');
 
sock.on('message', function(topic, message) {
  console.log('received a message related to:', topic, 'containing message:', message);
});



var sock2 = zmq.socket('pub'); 
sock2.bindSync('tcp://127.0.0.1:5001');
console.log('Publisher bound to port 5001');
 

var sendMessage = function() {
	console.log('sending a multipart message envelope');
  sock2.send(['kitty cats', 'meow!']);
}

module.exports.sendMessage = sendMessage;