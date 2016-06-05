'use strict';

const express = require('express');
const http = require("http");
const https = require("https");
const async = require("async");

const PORT = 8787;

const PUBLIC_AGENT = process.env.PUBLIC_AGENT;

const TEST_RESPONSE = [{
  'title': 'test',
  'start': '2016-06-02T15:00:00Z',
  'end': '2016-06-02T15:30:00Z',
  'loc': 'Solingen, Germany',
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
  syncEvents(res, getEvents);
});

// service discovery using go2
function lookup(res, dpid, callback){
  var dnspart = '';
  var tmp = ' ';
  var comp;
  
  console.log('go2: Looking up service with DPID ' + dpid);
  getPlain(PUBLIC_AGENT, 6969, '/?dpid='+encodeURIComponent(dpid), function(err, address){
    var ip, port;
    if (err) {
      console.error('go2: Service discovery failed due to ' + err);
      res.status(404).end();
    } 
    else {
      console.log('go2: Resolved to address ' + address);
      ip = address.split('/')[2].split(':')[0]
      port = address.split('/')[2].split(':')[1]
      callback(ip, port);
    }
  });
}

// do JSON HTTP data call
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
              callback(err);
          });
}

// do plain HTTP data call
function getPlain(host, port, path, callback){
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
                  callback(null, body);
                });
          }).on('error', function(err) {
              console.error('Error with request: ', err.message);
              callback(err);
          });
}

// looks up events and PTFs
function getEvents(res) {
  var lookupDate = new Date().toISOString().slice(0,10); // extract the YYYY-MM-DD part
  var out = [];
  console.info('Looking up events for today, that is: ' + lookupDate);
  lookup(res, '/marvin/events', function(eIP, ePort){
    getData(eIP, 9999, '/events?date='+lookupDate,
      function(e, events){
        async.each(events,
          function(event, callback){
            var loc = event["loc"];
            console.info('Looking at event ' + event["title"]);
            if (loc != ''){
              console.log('Looking up close-by public transport facilities for: ' + loc);
              lookup(res, '/marvin/osmlookup', function(oIP, oPort){
                getData(oIP, oPort, '/closeby/'+encodeURIComponent(loc.trim()), function(err, closeby){
                  if (err) res.status(404).end();
                  else {
                    if (closeby){
                      event.closeby = closeby;
                    }
                    out.push(event);
                    callback();
                  }
                });
              });
            }
          },
          function(err){
            res.json(out);
            res.end();
          }
        );
      }
    );
  });
}

// syncs calendar proxy with calendar to make today's events available
function syncEvents(res, callback) {
  console.info('Trying to sync calendar ...');
  lookup(res, '/marvin/events', function(eIP, ePort){
    getData(eIP, 9999, '/sync',
      function(e, d){
        console.info('Syncing calendar was successful.');
        callback(res);
      },
      function(err){
        console.info('Syncing calendar was NOT successful!');
        res.status(404).end();
      }
    );
  });
}

app.listen(PORT);
console.info('This is MARVIN nanoservice [Close-by Public Transport Recommender] listening on port ' + PORT);