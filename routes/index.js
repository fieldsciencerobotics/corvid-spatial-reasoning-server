var express = require('express');
var request = require('request')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* Control Flow Routes */

router.post('/control/initialize', function(req, res, next) {
  res.send('Initialized');
});

router.post('/control/startExperiment', function(req, res, next) {
  request('http://10.1.1.4:8080', function (error, response, body) {
    (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage. 
    }
  })
  res.send('Experiment Started');
});

router.post('/control/startSession', function(req, res, next) {
  res.send('Session Started');
});

router.post('/control/endSession', function(req, res, next) {
  res.send('Session Ended');
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
  res.send('Meat Dropped');
});

router.post('/freeForm/lightOn', function(req, res, next) {
  res.send('Light Turned On');
});

router.post('/freeForm/lightsOff', function(req, res, next) {
  res.send('Lights turned Off');
});


/* Data Retrieval Methods */

router.post('/data/getBirds', function(req, res, next) {
  res.send('Bird Data');
});


module.exports = router;
