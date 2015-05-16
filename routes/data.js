var db = require('mongoskin').db('mongodb://localhost:27017/spatial_reasoning'); 

var exports = module.exports = {};

/* Get methods */

exports.logTrial = function() {
	db.collection('trials').insert({trialID: "Guns N' Roses", result: "fail" }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Added!');
	});

}

exports.newBird = function() {

}

exports.newStage = function() {

}

exports.setDeviceMapping = function() {

}


/* Setter methods */

exports.getDeviceMapping = function() {

}

exports.getTrials = function() {

}