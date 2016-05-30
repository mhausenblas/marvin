'use strict';

const express = require('express');
const http = require("http");
const https = require("https");

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
  var events = getEvents(res);
});

// lifted from http://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
function getJSON(options, onResult) {
  var prot = options.port == 443 ? https : http;
  var req = prot.request(options, function(res){
    var output = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
            output += chunk;
    });
    res.on('end', function() {
      var obj = JSON.parse(output);
      onResult(res.statusCode, obj);
    });
  });
  req.on('error', function(err) {
  });
  req.end();
};



function getEvents(res) {
  var lookupDate = new Date().toISOString().slice(0,10);
  var events;
  var eventsLookupCall = {
      host: 'localhost',
      port: 9999,
      path: '/events?date='+lookupDate,
      method: 'GET'
  };
  console.log('Looking up events for today, that is: ' + lookupDate);
  getJSON(eventsLookupCall, function(statusCode, result) {
    console.log(JSON.stringify(result));
    if (result[0]["loc"] != "") {
      getCloseByPTFs(res, result[0]["loc"]);
    }
    else {
      res.json(result);
    }
  });
}

function getCloseByPTFs(res, loc) {
  var closebyPTFCall = {
      host: 'localhost',
      port: 8989,
      path: '/closeby/'+loc,
      method: 'GET'
  };
  console.log('Looking up close-by public transport facilities for: ' + loc);
  getJSON(closebyPTFCall, function(statusCode, result) {
    console.log(JSON.stringify(result));
    res.json(result);
  });
}

app.listen(PORT);
console.log('This is MARVIN recommender running on http://localhost:' + PORT);
//TODO: CAL SYNC