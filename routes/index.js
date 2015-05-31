var express = require('express');
var request = require('request')
var router = express.Router();
var controller = require('./controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* Control Flow Routes */
router.post('/control/initialize', function(req, res, next) {
  controller.experiment.initializeDevices();
  res.send('Initialized');
});

router.post('/control/startExperiment', function(req, res, next) {
  //console.log(req.body);
  console.log('%s  %s', req.body.birdID, req.body.stageID);

  controller.experiment.startExperiment();
  res.send('Experiment Started');  
});

router.post('/control/cancelExperiment', function(req, res, next) {
  controller.experiment.cancelExperiment();
  res.send('Experiment Canceled');

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

// Exports the Routes to the App
module.exports = router;
