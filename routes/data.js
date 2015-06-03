var db = require('mongoskin').db('mongodb://localhost:27017/spatial_reasoning'); 

var exports = module.exports = {};

/* Set methods */

exports.logTrial = function() {
	db.collection('trials').insert({trialID: "15", result: "success" }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Logged Trail!');
	});

}

exports.newBird = function(birdID, gender, age, notes) {
	db.collection('birds').insert({birdID: birdID, gender: gender, age: age, notes: notes }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Added Bird!');
	});
}

exports.newStage = function(name, desc, delay, autoEnd, autoEndTime, feederArrangement) {
	db.collection('stages').insert({'name': name, 'desc':desc, 'delay': delay, 'autoEnd': autoEnd, 'autoEndTime': autoEndTime, 'feederArrangement': feederArrangement}, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Added Stage!');
	});
}


exports.setDeviceMapping = function() {
	// finish method - passing in an array is likely not the correct way to do it...
	db.collection('devices').insert([{nodeID: 1, deviceID: 7}, {nodeID: 2, deviceID: null}, {nodeID: 3, deviceID: null}, {nodeID: 4, deviceID: null}, {nodeID: 5, deviceID: null},
			 {nodeID: 6, deviceID: null}, {nodeID: 7, deviceID: null}, {nodeID: 8, deviceID: null}, {nodeID: 9, deviceID: null}, {nodeID: 10, deviceID: null}], function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Logged Trail!');
	});
}


/* Get methods */

exports.getDeviceMapping = function() {
	return [{nodeID: 1, deviceID: 7}, {nodeID: 2, deviceID: null}, {nodeID: 3, deviceID: null}, {nodeID: 4, deviceID: null}, {nodeID: 5, deviceID: null},
			 {nodeID: 6, deviceID: null}, {nodeID: 7, deviceID: null}, {nodeID: 8, deviceID: null}, {nodeID: 9, deviceID: null}, {nodeID: 10, deviceID: null}]
}

// Change all of the below to getters rather than insert methods
exports.getTrials = function() {
	db.collection('trials').insert({trialID: "15", result: "success" }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Logged Trail!');
	});
}

exports.getBirds = function() {
	db.collection('birds').insert({birdID: birdID, gender: gender, age: age, notes: notes }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Added Bird!');
	});
}

exports.getStages = function() {
	db.collection('stages').insert({'name': name, 'desc':desc, 'delay': delay, 'autoEnd': autoEnd, 'autoEndTime': autoEndTime, 'feederArrangement': feederArrangement}, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Added Stage!');
	});
}