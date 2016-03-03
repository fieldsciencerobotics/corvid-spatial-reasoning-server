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
  controller.experiment.initializeDevices(req.body.newDeviceMapping);
  res.send('Initialized');
});

router.post('/control/startExperiment', function(req, res, next) {
  controller.experiment.startExperiment(req.body.birdID, req.body.stage);
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
  birds = controller.experiment.addNewBird(req.body.newBird, res);
  //res.send(birds);
});

router.post('/addNew/stage', function(req, res, next) {
  stages = controller.experiment.addNewStage(req.body.newStage, res);
  //res.send(stages);
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

router.post('/freeForm/lightOff', function(req, res, next) {
  controller.experiment.lightOff(req.body.lightID);
  res.send('Lights turned Off');
});

router.post('/freeForm/perchEvent', function(req, res, next) {
  controller.experiment.perchEvent(req.body.perchID);
  res.send('Perch event triggered');
});

/* Feeder Stages */
router.post('/freeForm/stopFeeder', function(req, res, next) {
  controller.experiment.stopFeeder(req.body.feederID);
  res.send('Meat Dropped');
});

router.post('/freeForm/resetFeeder', function(req, res, next) {
  controller.experiment.resetFeeder(req.body.feederID);
  res.send('Meat Dropped');
});

router.post('/freeForm/primeFeeder', function(req, res, next) {
  controller.experiment.primeFeeder(req.body.feederID);
  res.send('Meat Dropped');
});


/* Data Retrieval Methods */
router.post('/data/getBirds', function(req, res, next) {
  birds = controller.experiment.getBirds(res);
  //res.send(birds);
});

router.post('/data/getStages', function(req, res, next) {
  stages= controller.experiment.getStages(res);
  //res.send(stages);
});

router.post('/data/getDeviceMapping', function(req, res, next) {
  mapping = controller.experiment.getDeviceMapping();
  res.send(mapping);
});

router.post('/data/getOnlineDeviceList', function(req, res, next) {
  onlineDevices = controller.experiment.getOnlineDeviceList();
  res.send(onlineDevices);
});

router.post('/data/getOnlineDeviceListFreeform', function(req, res, next) {
  onlineDevices = controller.experiment.getOnlineDeviceListFreeform();
  res.send(onlineDevices);getOnlineDeviceListFreeformNoReIt
});

router.post('/data/getOnlineDeviceListFreeformNoReIt', function(req, res, next) {
  onlineDevices = controller.experiment.getOnlineDeviceListFreeformNoReIt();
  res.send(onlineDevices);
});

router.post('/data/getTrialsOfBirdInStage', function(req, res, next) {
  trials = controller.experiment.getTrialsOfBirdInStage(req.body.birdID, req.body.stageID, res);
  //res.send(trials);
});

router.post('/data/getLeaderBoard', function(req, res, next) {
  leadBoard = controller.experiment.getLeaderBoard();
  res.send(leadBoard);
});

router.post('/data/getCurrentBatteryLife', function(req, res, next) {
  currentBatteryLife = controller.experiment.getCurrentBatteryLife();
  res.send(currentBatteryLife);
});



// Exports the Routes to the App
module.exports = router;
