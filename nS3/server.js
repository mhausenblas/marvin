'use strict';

const express = require('express');

const PORT = 8787;

const TEST_RESPONSE = [{
  'title': 'test',
  'start': '2016-06-02T15:00:00Z',
  'end': '2016-06-02T15:30:00Z',
  'loc': 'Solingen\\, Germany',
  'closeby': [{
    'id': 144913426,
    'kind': 'bus_stop',
    'lat': 50.8720864,
    'lon': 4.4774319,
    'name': 'Zaventem De Vlemincklaan'
  }]
}];

const app = express();

// CORS enable the API for ease of consumption from a browser app
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/rec', function(req, res) {
  var events = getEvents();
  res.json(events);
});

function getEvents() {
  var lookupDate = new Date().toISOString().slice(0,10);
  var events;
  // var pfts = getCloseByPTFs();
  console.log('Looking up events for today, that is: ' + lookupDate);
  
}

app.listen(PORT);
console.log('This is MARVIN recommender running on http://localhost:' + PORT);
