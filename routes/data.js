//var db = require('mongoskin').db('mongodb://localhost:27017/spatial_reasoning'); 
//var fs = require("fs");
//var file = "/media/crowDriver/" + "corvidBase.db";
//var exists = fs.existsSync(file);

//if(!exists) {
//  console.log("Creating DB file.");
//  fs.openSync(file, "w");
//}

//var sqlite3 = require("sqlite3").verbose();
//var db = new sqlite3.Database(file);

//db.serialize(function() {
//	  if(!exists) {
//	    db.run("CREATE TABLE Birds (thing TEXT)");
//	  }

//	  if(!exists) {
//	    db.run("CREATE TABLE Stages (thing TEXT)");
//	  }

//	  if(!exists) {
//	    db.run("CREATE TABLE Trials (thing TEXT)");
//	  }
	  
//	  var stmt = db.prepare("INSERT INTO Birds VALUES (?)");
	  
	//Insert random data
//	  var rnd;
//	  for (var i = 0; i < 10; i++) {
//	    rnd = Math.floor(Math.random() * 10000000);
//	    stmt.run("Thing #" + rnd);
//	  }
	  
//	stmt.finalize();
//	  db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
//	    console.log(row.id + ": " + row.thing);
//	  });
//});

//db.close();

const low = require('lowdb');
const storage = require('lowdb/file-async');
 
//const db = low('/media/crowDriver/db.json', { storage })
var db = low('/media/crowDriver/db.json', { storage: storage })

var exports = module.exports = {};


var existingBirds = [
                    {'id': 'Green', 'gender': 'male', 'age': 'adult'},
                    {'id': 'Blue', 'gender': 'female', 'age': 'juvenile'},
                    {'id': 'Red', 'gender': 'female', 'age': 'juvenile'},
                    {'id': 'Red-Yellow', 'gender': 'female', 'age': 'juvenile'},
                    {'id': 'Red-Blue', 'gender': 'female', 'age': 'juvenile'},
                    ];

var existingStages = [
                    {'name': 'first 5 feeders', 'desc': "This is training part one", 'delay': 20, 'autoEnd': false, 'autoEndTime': 180, 
                    'feederArrangement': [true, true, true, true, true, false, false, false, false, false]},
                    {'name': 'last 5 feeders', 'desc': "This is experiment part one", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 
                    'feederArrangement': [false, false, false, false, false, true, true, true, true, true]},
                    {'name': 'every second', 'desc': "This is experiment part two", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 
                    'feederArrangement': [true, false, true, false, true, false, true, false, true, false]},
                    {'name': 'first three', 'desc': "This is experiment part three", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 
                    'feederArrangement': [true, true, true, false, false, false, false, false, false, false]},
                    ];

var deviceMapping = [{nodeID: 1, deviceID: 7}, {nodeID: 2, deviceID: null}, {nodeID: 3, deviceID: null}, 
					{nodeID: 4, deviceID: null}, {nodeID: 5, deviceID: null},{nodeID: 6, deviceID: null}, 
			 		{nodeID: 7, deviceID: null}, {nodeID: 8, deviceID: null}, {nodeID: 9, deviceID: null}, 
			 		{nodeID: 10, deviceID: null}];

var existingTrials = [];



/* Set methods */

exports.logTrial = function(trial) {


	console.log("Saving Trial: ", trial);

	//db.collection('trials').insert({trialID: "15", result: "success" }, function(err, result) {
    //	if (err) throw err;
    //	if (result) console.log('Logged Trail!');
	//});

}

exports.newBird = function(newBird) { //birdID, gender, age, notes) {
	//temp variable
	existingBirds.push(newBird);

	//db.collection('birds').insert({birdID: birdID, gender: gender, age: age, notes: notes }, function(err, result) {
    //	if (err) throw err;
    //	if (result) console.log('Added Bird!');
	//});
}

exports.newStage = function(newStage) { //name, desc, delay, autoEnd, autoEndTime, feederArrangement) {
	//temp variable
	existingStages.push(newStage);

	//db.collection('stages').insert({'name': name, 'desc':desc, 'delay': delay, 'autoEnd': autoEnd, 'autoEndTime': autoEndTime, 'feederArrangement': feederArrangement}, function(err, result) {
    //	if (err) throw err;
    //	if (result) console.log('Added Stage!');
	//});
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
	return deviceMapping;
}

// Change all of the below to getters rather than insert methods
exports.getTrials = function() {
	db.collection('trials').insert({trialID: "15", result: "success" }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Logged Trail!');
	});
}

exports.getNextTrialID = function(birdID, stageID) {

	// connects to the database
	// finds the highest trial id, for the filtered set of that birdID and stageID


	// lowdb work required here

	// hardcoded to return 1 currently
	return 1;
}

exports.getBirds = function() {
	//db.collection('birds').insert({birdID: birdID, gender: gender, age: age, notes: notes }, function(err, result) {
    //	if (err) throw err;
    //	if (result) console.log('Added Bird!');
	//});
	return existingBirds;
}

exports.getStages = function() {
	//db.collection('stages').insert({'name': name, 'desc':desc, 'delay': delay, 'autoEnd': autoEnd, 'autoEndTime': autoEndTime, 'feederArrangement': feederArrangement}, function(err, result) {
    //	if (err) throw err;
    //	if (result) console.log('Added Stage!');
	//});
	return existingStages
}


exports.getLeaderBoard = function() {
	return {'birdies': 'data'};
}

exports.getTrialsOfBirdInStage = function(birdID, stageID) {
	return {'specificBird': 'data'};
}


