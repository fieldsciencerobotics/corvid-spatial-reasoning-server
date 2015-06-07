var express = require('express');
var request = require('request')
var router = express.Router();
var controller = require('./controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//
// All routes essentiall pass on handling of the requests to the FSM which controlls the experiment
//

/* Control Flow Routes */
router.post('/control/initialize', function(req, res, next) {
  controller.experiment.initializeDevices();
  res.send('Initialized');
});

router.post('/control/startExperiment', function(req, res, next) {
  controller.experiment.startExperiment(req.body.birdID, req.body.stageID);
  res.send('Experiment Started');  
});

router.post('/control/cancelExperiment', function(req, res, next) {
  controller.experiment.cancelExperiment();
  res.send('Experiment Canceled');

});

router.post('/control/startSession', function(req, res, next) {
  controller.experiment.startSession(req.body.numOfTrials);
  res.send('Session Started');
});

router.post('/control/endSession', function(req, res, next) {
  controller.experiment.endSession();
  res.send('Session Ended');
});

router.post('/control/wrapUpSession', function(req, res, next) {
  controller.experiment.wrapUpSession(req.body.note);
  res.send('Session Wrapped Up');
});

/* Running Experiment Routes */
router.post('/experiment/getCurrentSessionProgress', function(req, res, next) {
  progress = controller.experiment.getCurrentSessionProgress();
  res.send(progress);
});


/* Add New Items */
router.post('/addNew/bird', function(req, res, next) {
  birds = controller.experiment.addNewBird(req.body.newBird);
  res.send(birds);
});

router.post('/addNew/stage', function(req, res, next) {
  stages = controller.experiment.addNewStage(req.body.newStage);
  res.send(stages);
});


/* Freeform Mode Commands */
router.post('/freeForm/dropMeat', function(req, res, next) {
  controller.experiment.dropMeat(req.body.feederID);
  res.send('Meat Dropped');
});

router.post('/freeForm/lightOn', function(req, res, next) {
  controller.experiment.lightOn(req.body.lightID);
  res.send('Light Turned On');
});

router.post('/freeForm/lightsOff', function(req, res, next) {
  controller.experiment.lightsOff();
  res.send('Lights turned Off');
});

router.post('/freeForm/perchEvent', function(req, res, next) {
  controller.experiment.perchEvent(req.body.perchID);
  res.send('Perch event triggered');
});


/* Data Retrieval Methods */
router.post('/data/getBirds', function(req, res, next) {
  birds = controller.experiment.getBirds();
  res.send(birds);
});

router.post('/data/getStages', function(req, res, next) {
  stages= controller.experiment.getStages();
  res.send(stages);
});

router.post('/data/getDeviceMapping', function(req, res, next) {
  mapping = controller.experiment.getDeviceMapping();
  res.send(mapping);
});

// Exports the Routes to the App
module.exports = router;
