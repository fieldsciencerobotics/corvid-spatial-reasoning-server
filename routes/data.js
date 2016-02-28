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


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/media/crowDriver/crowBase.db');
var check;

device_mapping_length = 0;

birds = null;
stages = null;
trials = null;
deviceMappings = {};

//
// Initialize the Database tables
//
db.serialize(function() {
	// Creates Birds Table (if it doesnt already exist)
	db.run("CREATE TABLE if not exists birds (id TEXT, gender TEXT, age TEXT, notes TEXT)");
	//db.run("DROP TABLE birds")

	// Creates Stages Table (if it doesnt already exist)
	db.run("CREATE TABLE if not exists stages (name TEXT, desc TEXT, delay INTEGER, autoEnd BOOL, autoEndTime INTEGER, feeder1 BOOL, feeder2 BOOL, feeder3 BOOL, feeder4 BOOL, feeder5 BOOL, feeder6 BOOL, feeder7 BOOL, feeder8 BOOL, feeder9 BOOL, feeder10 BOOL)");
	//db.run("DROP TABLE stages");

	// Creating Device Mapping Table (if it doesnt already exist)
	db.run("CREATE TABLE if not exists device_mapping (device VARCHAR, expNode INTEGER)");
	//db.run("DROP TABLE device_mapping");

	// Creates the Trials Table (if it doesnt already exist)
	db.run("CREATE TABLE if not exists trials (trialID INTEGER, bird TEXT, stage TEXT, intended INTEGER, actual INTEGER, success BOOL, startTime INTEGER, endTime INTEGER, totalTime INTEGER, videoFilePath TEXT, notes TEXT)");
	//db.run("DROP TABLE trials");
});



//
// SQLite Database Methods
//


//
// Birds
//
function insertBird(bird) {
    db.run("INSERT INTO birds VALUES (?, ?, ?, ?)", [bird.id, bird.gender, bird.age, bird.notes]);
}

function insertBirds(birds) {
	for (var i = 0; i < birds.length; i++) {
		insertBird(birds[i]);
	}
}

function getBirds(birdsCallback) {

	console.log("Print out all birds");
	var sql = "SELECT * FROM birds";
	// Print the records as JSON
    db.all(sql, function(err, rows) {
    	//console.log(JSON.stringify(rows))
    	birds = rows; //JSON.stringify(rows);
    });
}

function removeBird(birdID) {

}

function removeBirds() {

}

// END OF BIRD METHODS

function runInserts() {
	existingBirds1 = [
                    {'id': 'Green', 'gender': 'male', 'age': 'adult', 'notes': ""},
                    {'id': 'Blue', 'gender': 'female', 'age': 'juvenile', 'notes': ""},
                    {'id': 'Red', 'gender': 'female', 'age': 'juvenile', 'notes': ""},
                    {'id': 'Red-Yellow', 'gender': 'female', 'age': 'juvenile', 'notes': ""},
                    {'id': 'Red-Blue', 'gender': 'female', 'age': 'juvenile', 'notes': ""},
                    ];
    insertBirds(existingBirds1);
}




//const low = require('lowdb');
//const storage = require('lowdb/file-async');
 
//const db = low('/media/crowDriver/db.json', { storage })
//var db = low('/media/crowDriver/db.json', { storage: storage })



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

var deviceMapping = [{nodeID: 1, deviceID: 'a'}, 
					{nodeID: 2, deviceID: 'b'}, 
					{nodeID: 3, deviceID: 'c'}, 
					{nodeID: 4, deviceID: 'd'}, 
					{nodeID: 5, deviceID: 'e'},
					{nodeID: 6, deviceID: 'f'}, 
			 		{nodeID: 7, deviceID: 'g'}, 
			 		{nodeID: 8, deviceID: 'h'}, 
			 		{nodeID: 9, deviceID: 'i'}, 
			 		{nodeID: 10, deviceID: 'j'}];

var deviceToLagartoMapping = {'a': '7', 
	                            'b': '6', 
	                            'c': '37', 
	                            'd': '0', 
	                            'e': '0',
	                            'f': '0', 
	                            'g': '0', 
	                            'h': '0', 
	                            'i': '0', 
	                            'j': '0'};

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


exports.setDeviceMapping = function(newMapping) {
	// finish method - passing in an array is likely not the correct way to do it...
	/*
	db.collection('devices').insert([{nodeID: 1, deviceID: 7}, {nodeID: 2, deviceID: null}, {nodeID: 3, deviceID: null}, {nodeID: 4, deviceID: null}, {nodeID: 5, deviceID: null},
			 {nodeID: 6, deviceID: null}, {nodeID: 7, deviceID: null}, {nodeID: 8, deviceID: null}, {nodeID: 9, deviceID: null}, {nodeID: 10, deviceID: null}], function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Logged Trail!');
	});
	*/
}


/* Get methods */

exports.getDeviceMapping = function() {
	return deviceMapping;
}

exports.getDeviceToLagartoMapping = function() {
	return deviceToLagartoMapping;
} 


exports.getDeviceNameToExpNode = function() {

	deviceNameToExpNode = {'a': '1', 
                            'b': '2', 
                            'c': '3', 
                            'd': '4', 
                            'e': '5',
                            'f': '6', 
                            'g': '7', 
                            'h': '8', 
                            'i': '9', 
                            'j': '10'};

	return deviceNameToExpNode;
} 

exports.getExpNodeToDeviceName = function() {

	expNodeToDeviceName = {'1': 'a', 
                            '2': 'b', 
                            '3': 'c', 
                            '4': 'd', 
                            '5': 'e',
                            '6': 'f', 
                            '7': 'g', 
                            '8': 'h', 
                            '9': 'i', 
                            '10': 'j'};

	return expNodeToDeviceName;
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

exports.getBirds = function(res) {
	//db.collection('birds').insert({birdID: birdID, gender: gender, age: age, notes: notes }, function(err, result) {
    //	if (err) throw err;
    //	if (result) console.log('Added Bird!');
	//});
	res.send(existingBirds);
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


