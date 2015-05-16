var db = require('mongoskin').db('mongodb://localhost:27017/spatial_reasoning'); 

var exports = module.exports = {};

/* Set methods */

exports.logTrial = function() {
	db.collection('trials').insert({trialID: "15", result: "success" }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Logged Trail!');
	});

}

exports.newBird = function() {
	db.collection('birds').insert({birdID: "Red", happy: "yes" }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Added Bird!');
	});
}

exports.newStage = function() {
	db.collection('stages').insert({stageID: "6", anyGood: "yes" }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Added Stage!');
	});
}

exports.setDeviceMapping = function() {

}


/* Get methods */

exports.getDeviceMapping = function() {

}

exports.getTrials = function() {

}