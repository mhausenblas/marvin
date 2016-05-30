'use strict';

const express = require('express');
const http = require("http");
const https = require("https");
const async = require("async");


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

// CORS-enable the API for ease of consumption from a browser app
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/rec', function(req, res) {
  getEvents(res);
});

function getData(host, port, path, callback){
  return http.get({
            host: host,
            port: port,
            path: path,
            json: true
          }, function(response) {
                var body = '';
                response.setEncoding('utf8');
                response.on('data', function(d) {
                  body += d;
                });
                response.on('end', function() {
                  try {
                    var data = JSON.parse(body);
                  }
                  catch (err) {
                    console.error('Unable to parse data: ', err);
                    return callback(err);
                  }
                  callback(null, data);
                });
          }).on('error', function(err) {
              console.error('Error with request: ', err.message);
              cb(err);
          });
}

function getEvents(res) {
  var lookupDate = new Date().toISOString().slice(0,10); // extract the YYYY-MM-DD part
  var out = [];
  console.info('Looking up events for today, that is: ' + lookupDate);
  getData('localhost', 9999, '/events?date='+lookupDate, function(err, events){
    if (err) res.status(404).end();
    else {
      async.each(events,
        function(event, callback){
          var loc = event["loc"];
          console.info('Looking at event ' + event["title"]);
          if (loc != ''){
            console.log('Looking up close-by public transport facilities for: ' + loc);
            getData('localhost', 8989, '/closeby/'+encodeURIComponent(loc.trim()), function(err, closeby){
              if (err) res.status(404).end();
              else {
                if (closeby){
                  event.closeby = closeby;
                }
                out.push(event);
                callback();
              }
            });
          }
        },
        function(err){
          res.json(out);
          res.end();
        });
      }
    });
}


app.listen(PORT);
console.info('This is MARVIN nanoservice [Close-by Public Transport Recommender] listening on port ' + PORT);