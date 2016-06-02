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
  getEvents(res);
});

// Service discovery using Mesos-DNS directly
// Boils down to something like:
// http://leader.mesos:8123/v1/services/_events-marvin._tcp.marathon.mesos.
function lookup_mesosdns(dpid, callback){
  var dnspart = '';
  var tmp = ' ';
  var comp;
  
  console.log('Looking up service with DPID ' + dpid);
  if(dpid.indexOf('/') >= 0){ // hierachical dpid like '/test/t0'
    dnspart = dpid.substring(1);
    comp = dnspart.split('/');
    for (var i = comp.length-1; i >= 0; i--) {
      tmp += comp[i] + "-";
    }
    dnspart = tmp.substring(0,tmp.length-1); // now it 't0-test'
  }
  else {
    dnspart = dpid;
  }
  console.log('Extracted DNS part ' + dnspart);
  getData('leader.mesos', 8123, '/v1/services/'+encodeURIComponent('_'+dnspart+'._tcp.marathon.mesos.'), function(err, resp){
    var address = 'http://';
    var rec;
    if (err) {
      console.error('Service discovery failed due to ' + err);
      res.status(404).end();
    } 
    else {
      rec = resp[0]; // lazy picking first entry, should be random really
      address += rec.ip + ':' + rec.port;
      console.log('Resolved to address ' + address);
      callback(resp.ip, resp.port);
    }
  });
}

// Service discovery using go2
function lookup(dpid, callback){
  var dnspart = '';
  var tmp = ' ';
  var comp;
  
  console.log('go2: Looking up service with DPID ' + dpid);
  getData(PUBLIC_AGENT, 6969, '/?dpid='+encodeURIComponent(dpid), function(err, address){
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

// JSON HTTP data call
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

// Looks up events and PTFs
function getEvents(res) {
  var lookupDate = new Date().toISOString().slice(0,10); // extract the YYYY-MM-DD part
  var out = [];
  console.info('Looking up events for today, that is: ' + lookupDate);
  lookup('/marvin/events', function(eIP, ePort){
    // getData(eIP, ePort, '/events?date='+lookupDate, function(err, events){
    getData(eIP, 9999, '/events?date='+lookupDate, function(err, events){ // FIXME: shouldn't be a static port, need to figure why this doesn't work ATM
      if (err) res.status(404).end();
      else {
        async.each(events,
          function(event, callback){
            var loc = event["loc"];
            console.info('Looking at event ' + event["title"]);
            if (loc != ''){
              console.log('Looking up close-by public transport facilities for: ' + loc);
              lookup('/marvin/osmlookup', function(oIP, oPort){
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
          });
      }
    });
  });
}


app.listen(PORT);
console.info('This is MARVIN nanoservice [Close-by Public Transport Recommender] listening on port ' + PORT);