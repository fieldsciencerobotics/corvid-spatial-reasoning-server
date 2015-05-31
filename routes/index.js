var express = require('express');
var request = require('request')
var router = express.Router();
//var FSM = require('./experimentalFSM');
var controller = require('./controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* Control Flow Routes */

router.post('/control/initialize', function(req, res, next) {
  
  controller.experiment.initializeDevices();

  // Now, to use it:
  // This call causes the FSM to transition from uninitialized -> green
  // & queues up pedestrianWaiting input, which replays after the timeout
  // causes a transition to green-interruptible....which immediately
  // transitions to yellow since we have a pedestrian waiting. After the
  // next timeout, we end up in "red".
  //FSM.vehicleSignal.pedestrianWaiting();
  // Once the FSM is in the "red" state, we can reset it to "green" by calling:
  //FSM.vehicleSignal.reset();

  res.send('Initialized');
});

router.post('/control/startExperiment', function(req, res, next) {
  
  console.log(req.body.birdID, req.body.stageID);
  controller.experiment.startExperiment();

  res.send('Experiment Started');  
});

router.post('/control/cancelExperiment', function(req, res, next) {
  
  controller.experiment.cancelExperiment();

  //request('http://192.168.1.14:8080', function (error, response, body) {
  //  if (!error && response.statusCode == 200) {
  //    console.log(body) // Show the HTML for the Google homepage. 

      res.send('Experiment Canceled');
  //  }
  //})
  
});

router.post('/control/startSession', function(req, res, next) {
  
  controller.experiment.startSession();


  res.send('Session Started');
});

router.post('/control/endSession', function(req, res, next) {
  
  controller.experiment.endSession();

  res.send('Session Ended');
});

router.post('/control/wrapUpSession', function(req, res, next) {
  
  controller.experiment.WrapUpSession();

  res.send('Session Wrapped Up');
});


/* Add New Items */

router.post('/addNew/bird', function(req, res, next) {
  


  res.send('Bird Added');
});

router.post('/addNew/stageDefinition', function(req, res, next) {
  res.send('Stage  Definition Added');
});


/* Freeform Mode Commands */

router.post('/freeForm/dropMeat', function(req, res, next) {
  
  controller.experiment.dropMeat();

  res.send('Meat Dropped');
});

router.post('/freeForm/lightOn', function(req, res, next) {
  
  controller.experiment.lightOn();

  res.send('Light Turned On');
});

router.post('/freeForm/lightsOff', function(req, res, next) {
  
  controller.experiment.lightsOff();

  res.send('Lights turned Off');
});


/* Data Retrieval Methods */

router.post('/data/getBirds', function(req, res, next) {
  res.send('Bird Data');
});

router.post('/data/getStages', function(req, res, next) {
  res.send('Stage Data');
});


module.exports = router;
