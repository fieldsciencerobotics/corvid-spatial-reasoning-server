/* ZeroMQ */ 
var zmq = require('zmq')
  , sock = zmq.socket('sub');
 
sock.connect('tcp://127.0.0.1:5001');
sock.subscribe('kitty cats');
console.log('Subscriber connected to port 3000');
 
sock.on('message', function(topic, message) {
  console.log('received a message related to:', topic, 'containing message:', message);
});