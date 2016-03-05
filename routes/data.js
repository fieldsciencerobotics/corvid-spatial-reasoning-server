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
//
// SQLite Database Methods
//
//


//
// Birds
//
function insertBird(bird, res, getBirds) {
    db.run("INSERT INTO birds VALUES (?, ?, ?, ?)", [bird.id, bird.gender, bird.age, bird.notes], function(err){
    	getBirds(res);
    });
}

function insertBirds(birds) {
	for (var i = 0; i < birds.length; i++) {
		insertBird(birds[i]);
	}
}

function getBirds(res) {

	console.log("Print out all birds");
	var sql = "SELECT * FROM birds";
	// Print the records as JSON
    db.all(sql, function(err, rows) {
    	//console.log(JSON.stringify(rows))
    	birds = rows; //JSON.stringify(rows);
    	res.send(birds);
    });
}

function removeBird(birdID) {

}

function removeBirds() {

}

// END OF BIRD METHODS



//
// Stages
//

function insertStage(stage, res, getStages) {
    db.run("INSERT INTO stages VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [stage.name , stage.desc , stage.delay , stage.autoEnd , stage.autoEndTime, stage.feederArrangement[0], stage.feederArrangement[1], stage.feederArrangement[2], stage.feederArrangement[3], stage.feederArrangement[4], stage.feederArrangement[5], stage.feederArrangement[6], stage.feederArrangement[7], stage.feederArrangement[8], stage.feederArrangement[9] ], function(err) {
    		getStages(res);
    })
}

function insertStages(stages) {
	for (var i = 0; i < stages.length; i++) {
		insertStage(stages[i]);
	}
}

function getStages(res) {
	console.log("Print out all stages");
    var sql = "SELECT * FROM stages";
    // Print the records as JSON
    db.all(sql, function(err, rows) {
      stages = rows; //JSON.stringify(rows);

      for (var i = 0; i < stages.length; i++) {
      	//console.log(stages[i]);
	  	stages[i].feederArrangement = [];
	    stages[i].feederArrangement.push(stages[i].feeder1); 
	    delete stages[i].feeder1;
	    stages[i].feederArrangement[1] = stages[i].feeder2; 
	    delete stages[i].feeder2;
	    stages[i].feederArrangement[2] = stages[i].feeder3; 
	    delete stages[i].feeder3;
	    stages[i].feederArrangement[3] = stages[i].feeder4; 
	    delete stages[i].feeder4;
	    stages[i].feederArrangement[4] = stages[i].feeder5; 
	    delete stages[i].feeder5;
	    stages[i].feederArrangement[5] = stages[i].feeder6; 
	    delete stages[i].feeder6;
	    stages[i].feederArrangement[6] = stages[i].feeder7; 
	    delete stages[i].feeder7;
	    stages[i].feederArrangement[7] = stages[i].feeder8; 
	    delete stages[i].feeder8;
	    stages[i].feederArrangement[8]= stages[i].feeder9; 
	    delete stages[i].feeder9;
	    stages[i].feederArrangement[9]= stages[i].feeder10; 
	    delete stages[i].feeder10;
	  }

	  res.send(stages);
    });
}

function removeStage(stageID) {

}

function removeStages() {

}

// END OF STAGES METHODS



//
// Device Mappings
//

// The formatting of the results varies depending on the called methods, the callback function handles this
function getDeviceMappings(format, res) {
    var sql = "SELECT * FROM device_mapping";
    console.log(sql);
    // Print the records as JSON
    db.all(sql, function(err, rows) {
    	myRows = rows;
    	format(res, myRows);
    });
}

function addDeviceMapping(deviceMapping) {
	db.serialize(function() {

		db.run("DELETE FROM device_mapping");
		//var stmt = db.prepare("INSERT INTO device_mapping VALUES (?, ?)");
		var stmt = db.prepare("INSERT OR REPLACE INTO device_mapping (device, expNode) VALUES (?, ?)");

		for (var i = 0; i < 10; i++) {
		    stmt.run(deviceMapping[i].deviceID, deviceMapping[i].nodeID);
		}
		stmt.finalize();
	});
}

// END OF DEVICE MAPPINGS


//
// Trials
//

function insertTrial(trial) {
    db.run("INSERT INTO trials VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [trial.trialID , trial.bird , trial.stage , trial.intended , trial.actual , trial.success , trial.startTime , trial.endTime , trial.totalTime , trial.videoFilePath , trial.notes])
}

function insertTrials(trials) {
	for(var i = 0; i < trials.length; i++) {
		insertTrial(trials[i]);
	}
}

// get trials is slightly more complicated and involves a few seperate methods

function getAllTrialsByBird(birdID) {
	console.log("Print out all trials for:" + birdID);
    var sql = "SELECT * FROM trials WHERE bird = ? ";
    // Print the records as JSON
    db.all(sql, birdID, function(err, rows) {
      trials = rows; //JSON.stringify(rows);
    });
}

function getLast20TrialsByBird(birdID) {
	console.log("Print out last 20 trials for:" + birdID);
    var sql = "SELECT * FROM trials WHERE bird = ? "; // order by, restrict count
    // Print the records as JSON
    db.all(sql, birdID, function(err, rows) {
      trials = rows; //JSON.stringify(rows);
    });
}


function getAllTrialsInStageByBird(birdID, stageID, res) {
	console.log("Print out trials for:" + birdID + " and stage: " + stageID);
    var sql = "SELECT * FROM trials WHERE bird = ? AND stage = ?"; // order by, restrict count
    // Print the records as JSON
    db.all(sql, birdID, stageID, function(err, rows) {
      trials = rows; //JSON.stringify(rows);
      res.send(trials);
    });
}

function getRangeOfTrialsInStageByBird(birdID, stageID, start, stop) {
	console.log("Print out trials for:" + birdID + " and stage: " + stageID);
    var sql = "SELECT * FROM trials WHERE bird = ? AND stage = ?"; // order by, restrict count
    // Print the records as JSON
    db.all(sql, birdID, stageID, function(err, rows) {
      trials = rows; //JSON.stringify(rows);
    });
}

// Used for generating the next TrialID
function getNextTrialIDFromDB(birdID, stageID, res) {
	console.log("Inside the database method");
	// finds the highest trial id, for the filtered set of that birdID and stageID
	var sql = "SELECT * FROM trials WHERE bird = ? AND stage = ?"; // order by, restrict count

    db.all(sql, birdID, stageID, function(err, rows) {
    	console.log("Inside SQL");
    	if (rows.length > 0){
    		console.log("rows greater than zero");
    		nextTrialID = 1;
    		for (var i = 0; i < rows.length; i++) {
			   if (rows[i].trialID > nextTrialID) {
			   	nextTrialID = rows[i].trialID;
			   }
			}
			console.log(nextTrialID + 1);
			res(nextTrialID + 1);
    	} else {
    		console.log("rows not greater than zero")
    		nextTrialID = 1;
    		console.log(nextTrialID);
			res(nextTrialID);
    	}
      	
      	
		
    });

}

function removeTrialsOfBird(BirdID) {

}

function removeTrialsOfStage(StageID) {

}

function removeTrailsOfBirdAndStage(BirdID, StageID) {

}

function removeAllTrials(){

}


// Still required some thoughts - def needs some counts....
// getLeaderBoard()



//
//
// END OF THE DATABASE FUNCTIONS
//
//






function runInserts() {
	existingBirds1 = [
                    {'id': 'Green', 'gender': 'male', 'age': 'adult', 'notes': ""},
                    {'id': 'Blue', 'gender': 'female', 'age': 'juvenile', 'notes': ""},
                    {'id': 'Red', 'gender': 'female', 'age': 'juvenile', 'notes': ""},
                    {'id': 'Red-Yellow', 'gender': 'female', 'age': 'juvenile', 'notes': ""},
                    {'id': 'Red-Blue', 'gender': 'female', 'age': 'juvenile', 'notes': ""},
                    ];

    existingStages1 = [
                    {'name': 'first 5 feeders', 'desc': "This is training part one", 'delay': 20, 'autoEnd': false, 'autoEndTime': 180, 
                    'feederArrangement': [true, true, true, true, true, false, false, false, false, false]},
                    {'name': 'last 5 feeders', 'desc': "This is experiment part one", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 
                    'feederArrangement': [false, false, false, false, false, true, true, true, true, true]},
                    {'name': 'every second', 'desc': "This is experiment part two", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 
                    'feederArrangement': [true, false, true, false, true, false, true, false, true, false]},
                    {'name': 'first three', 'desc': "This is experiment part three", 'delay': 15, 'autoEnd': true, 'autoEndTime': 120, 
                    'feederArrangement': [true, true, true, false, false, false, false, false, false, false]},
                    ];

    expNodeToDeviceName = {'1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e',
	                        '6': 'f', '7': 'g', '8': 'h', '9': 'i', '10': 'j'};

	deviceMappingReset = [{nodeID: 1, deviceID: 'a'}, 
                            {nodeID: 2, deviceID: 'b'}, 
                            {nodeID: 3, deviceID: 'c'}, 
                            {nodeID: 4, deviceID: 'd'}, 
                            {nodeID: 5, deviceID: 'e'},
                            {nodeID: 6, deviceID: 'f'}, 
                            {nodeID: 7, deviceID: 'g'}, 
                            {nodeID: 8, deviceID: 'h'}, 
                            {nodeID: 9, deviceID: 'i'}, 
                            {nodeID: 10, deviceID: 'j'}];

    //insertBirds(existingBirds1);
    //insertStages(existingStages1);
    addDeviceMapping(deviceMappingReset);
}

// Ensures that the restarting of the server puts it into a good state
runInserts();




//
// Module Export Code Below
//


var exports = module.exports = {};

//
// To be removed, just as soon as I connect the insert functions up
//
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

// * * * *

var existingTrials = [];



/* Set methods */

exports.logTrial = function(trial) {
	console.log("Saving Trial: ", trial);

	insertTrial(trial);

}

exports.newBird = function(newBird, res, getBirds) { 
	//birdID, gender, age, notes) {
	insertBird(newBird, res, getBirds);
}

exports.newStage = function(newStage, res, getStages) { 
	//name, desc, delay, autoEnd, autoEndTime, feederArrangement) {
	insertStage(newStage, res, getStages);
}


exports.setDeviceMapping = function(newMapping) {
	
	// {'1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e',
	// '6': 'f', '7': 'g', '8': 'h', '9': 'i', '10': 'j'};
	console.log("inside setDeviceMapping: ", newMapping);
	addDeviceMapping(newMapping)
}


/* Get methods */

	


// Callback methods - link up to the actual database

// This doesn't have to be in the database, it's fairly set in stone... (I think...)
exports.getDeviceToLagartoMapping = function(res) {
	deviceToLagartoMapping = {'a': '1', 
	                            'b': '2', 
	                            'c': '3', 
	                            'd': '4', 
	                            'e': '5',
	                            'f': '6', 
	                            'g': '7', 
	                            'h': '8', 
	                            'i': '9', 
	                            'j': '10'};

	res(deviceToLagartoMapping);
} 

function formatDeviceMapping(res, rows){

	//console.log(rows);
	/*
	deviceMapping = [{nodeID: 1, deviceID: 'a'}, 
					{nodeID: 2, deviceID: 'b'}, 
					{nodeID: 3, deviceID: 'c'}, 
					{nodeID: 4, deviceID: 'd'}, 
					{nodeID: 5, deviceID: 'e'},
					{nodeID: 6, deviceID: 'f'}, 
			 		{nodeID: 7, deviceID: 'g'}, 
			 		{nodeID: 8, deviceID: 'h'}, 
			 		{nodeID: 9, deviceID: 'i'}, 
			 		{nodeID: 10, deviceID: 'j'}];
	*/
	
	deviceMapping = [];
	for (var i = 0; i < rows.length; i++) {
	    deviceMapping.push({'nodeID': rows[i].expNode, 'deviceID': rows[i].device});


	    //deviceMapping[i].deviceID
	}

	//console.log(deviceMapping);
	res(deviceMapping);
}

exports.getDeviceMapping = function(res) {
	getDeviceMappings(formatDeviceMapping, res);
}


function formatDeviceNameToExpNode(res, rows){

	/*
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
    */

    // currently returns nothing!! for why?!

	deviceNameToExpNode = {}
	for (var i = 0; i < rows.length; i++) {
	    deviceNameToExpNode[rows[i].device] = rows[i].expNode;
	}

	res(deviceNameToExpNode);
}

exports.getDeviceNameToExpNode = function(res) {
	getDeviceMappings(formatDeviceNameToExpNode, res);
} 

function formatExpNodeToDeviceName(res, rows){

	/*
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
    */

	expNodeToDeviceName = {}
	for (var i = 0; i < rows.length; i++) {
	    expNodeToDeviceName[rows[i].expNode] = rows[i].device;
	}

	res(expNodeToDeviceName);
}

exports.getExpNodeToDeviceName = function(res) {
	getDeviceMappings(formatExpNodeToDeviceName, res);
} 




// Change all of the below to getters rather than insert methods
exports.getTrials = function() {
	db.collection('trials').insert({trialID: "15", result: "success" }, function(err, result) {
    	if (err) throw err;
    	if (result) console.log('Logged Trail!');
	});
}

exports.getNextTrialID = function(birdID, stageID, res) {
	console.log("inside data");
	getNextTrialIDFromDB(birdID, stageID, res);
}


exports.getLeaderBoard = function() {
	return {'birdies': 'data'};
}

exports.getTrialsOfBirdInStage = function(birdID, stageID, res) {
	getAllTrialsInStageByBird(birdID, stageID, res);
}



exports.getBirds = function(res) {

	getBirds(res);
}

exports.getStages = function(res) {

	getStages(res);
}

// Deletion Methods
exports.deleteBird = function(bird, res) {

	removeBird(bird, res);
}

exports.deleteStag = function(stage, res) {

	removeStage(stage, res);
}

