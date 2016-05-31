var VERSION = '0.2.0';
var MARVIN_REC_DPID = '/marvin/rec';
var MARVIN_REC_URL = '';
var lookupDate = new Date().toISOString().slice(0, 10);

// main event loop
$(document).ready(function() {
  $('#today').html(lookupDate);
  $('#about').prepend('This is v' + VERSION + '<br>');
  serviceDiscovery();
  $("#getrec").click(function(event) {
    getRecs();
  });
  $("#about").click(function(event) {
    renderResults(getTestData());
  });
});

// Using see also https://github.com/mhausenblas/go2
function serviceDiscovery() {
  var apicall = 'http://' + window.location.hostname + ':6969'; // GO2 endpoint
  console.info('Discovering endpoint for ' + MARVIN_REC_DPID + ' via ' + apicall);
  $.get(apicall, function(d) {
    console.debug("GET " + apicallGET);
    if (d) {
      MARVIN_REC_URL = d;
      console.debug('Resolved MARVIN recommender service with DPID ' + MARVIN_REC_DPID + ' to ' + MARVIN_REC_URL);
     } else {
      $('#out').html('<div class="event">Can not find MARVIN recommender service :(</div>');
    }
  });
}

function renderResults(events){
  var buf = "";
  var ptfs = [];
  $('#out').html('');
  events.forEach(function(event) {
    console.debug('Event: ' + event.title);
    buf = '<div class="event"><h2>' + event.title + '</h2>';
    buf += '<div>Start: <span class="date">' + event.start.split('T')[1] + '</span> ';
    buf += '     End: <span class="date">' + event.end.split('T')[1] + '</span></div>';
    buf += '<div>Location: <span class="loc">' + event.loc + '</span></div>';
    $('#out').append(buf);
    ptfs = event["closeby"];
    if (ptfs) {
      buf = '';
      ptfs.forEach(function(ptf) {
        console.debug('PTF' + ptf.name);
        buf += '<div class="ptf"><h3>' + ptf.name + '</h3>';
        buf += '<div>' + ptf.kind + '</div>';
        buf += '<div><a href="http://www.openstreetmap.org/?mlat=' + ptf.lat + '&mlon=' + ptf.lon + '#map=16/' + ptf.lat + '/' + ptf.lon + '" target="_new" title="view on map">';
        buf += '<img src="img/map.png" alt="view on map" /></a></div>';
        buf += '</div>';
      });
    }
    buf += '</div><div class="cl"></div>';
    $('#out').append(buf);
  });
}

function getRecs() {
  var apicall = BASE_URL + '/rec';
  $('#out').html('<img src="img/wait.gif" width="32px" alt="Getting recommendations, may take some 20sec ..." />');
  $.get(apicall, function(d) {
    console.debug("GET " + apicall);
    if (d) {
      renderResults(d);
     } else {
      $('#out').html('<div class="event">No recommendations available</div>');
    }
  });
}

function getTestData() {
  return [{
    "title": "Something",
    "start": "2016-05-30T13:15:00Z",
    "end": "2016-05-30T14:15:00Z",
    "loc": "Dublin Airport",
    "closeby": [{
      "lat": 53.4280327,
      "kind": " Aircoach",
      "lon": -6.2443653,
      "id": 699782357,
      "name": "Dublin Airport - (Terminal 1 - Arrivals Road)"
    }, {
      "lat": 53.4261769,
      "kind": " Aircoach",
      "lon": -6.2385502,
      "id": 1708361605,
      "name": "Dublin Airport - (Terminal 2 - Departures Road)"
    }, {
      "lat": 53.4270099,
      "kind": " Aircoach",
      "lon": -6.2400023,
      "id": 1708713097,
      "name": "Dublin Airport - (Terminal 2 - Arrivals Road)"
    }]
  }, {
    "title": "A test",
    "start": "2016-05-30T20:30:00Z",
    "end": "2016-05-30T21:30:00Z",
    "loc": "Zaventem",
    "closeby": [{
      "lat": 50.8720864,
      "kind": "bus_stop De Lijn",
      "lon": 4.4774319,
      "id": 144913426,
      "name": "Zaventem De Vlemincklaan"
    }, {
      "lat": 50.8860083,
      "kind": "bus_stop De Lijn",
      "lon": 4.4741722,
      "id": 146627846,
      "name": "Zaventem Watertorenlaan"
    }, {
      "lat": 50.8822554,
      "kind": "bus_stop De Lijn",
      "lon": 4.4637952,
      "id": 309630402,
      "name": "Zaventem Hoogstraat"
    }, {
      "lat": 50.8757169,
      "kind": "bus_stop De Lijn",
      "lon": 4.4705443,
      "id": 310744628,
      "name": "Zaventem Bloemenveld"
    }, {
      "lat": 50.8786302,
      "kind": "bus_stop De Lijn",
      "lon": 4.472668,
      "id": 311740895,
      "name": "Zaventem Vijvers"
    }, {
      "lat": 50.8718477,
      "kind": "bus_stop De Lijn",
      "lon": 4.4761843,
      "id": 311741391,
      "name": "Zaventem De Vlemincklaan"
    }, {
      "lat": 50.8721104,
      "kind": "bus_stop De Lijn",
      "lon": 4.4695247,
      "id": 311741403,
      "name": "Zaventem Grote Daalstraat"
    }, {
      "lat": 50.8720479,
      "kind": "bus_stop De Lijn",
      "lon": 4.4706113,
      "id": 311741563,
      "name": "Zaventem Grote Daalstraat"
    }, {
      "lat": 50.8812455,
      "kind": "bus_stop De Lijn",
      "lon": 4.4809568,
      "id": 312461241,
      "name": "Zaventem Imbroekstraat"
    }, {
      "lat": 50.8814026,
      "kind": "bus_stop De Lijn",
      "lon": 4.4809474,
      "id": 312461247,
      "name": "Zaventem Imbroekstraat"
    }, {
      "lat": 50.8734428,
      "kind": "bus_stop De Lijn",
      "lon": 4.4848815,
      "id": 312461280,
      "name": "Zaventem Sterrebeekstraat"
    }, {
      "lat": 50.8852682,
      "kind": "bus_stop De Lijn",
      "lon": 4.4610829,
      "id": 312544467,
      "name": "Zaventem Maalbeekweg"
    }, {
      "lat": 50.8851285,
      "kind": "bus_stop De Lijn",
      "lon": 4.4610049,
      "id": 312544470,
      "name": "Zaventem Maalbeekweg"
    }, {
      "lat": 50.8710639,
      "kind": "bus_stop De Lijn",
      "lon": 4.511016,
      "id": 315770958,
      "name": "Zaventem Van Ingelgomstraat"
    }, {
      "lat": 50.8697661,
      "kind": "bus_stop De Lijn",
      "lon": 4.5033847,
      "id": 315770972,
      "name": "Zaventem Mercuriusstraat"
    }, {
      "lat": 50.8696707,
      "kind": "bus_stop De Lijn",
      "lon": 4.4984367,
      "id": 315770975,
      "name": "Zaventem Brixtonlaan"
    }, {
      "lat": 50.8806098,
      "kind": "bus_stop De Lijn",
      "lon": 4.4755481,
      "id": 320920144,
      "name": "Zaventem Mariadal"
    }, {
      "lat": 50.8640292,
      "kind": "bus_stop De Lijn",
      "lon": 4.4340846,
      "id": 321573538,
      "name": "Sint-Stevens-Woluwe Harenheide"
    }, {
      "lat": 50.885961,
      "kind": "bus_stop De Lijn",
      "lon": 4.4694914,
      "id": 366167820,
      "name": "Zaventem Station"
    }, {
      "lat": 50.8679096,
      "kind": "bus_stop De Lijn",
      "lon": 4.4512279,
      "id": 492794474,
      "name": "Sint-Stevens-Woluwe Woluwedal"
    }, {
      "lat": 50.8682404,
      "kind": "bus_stop De Lijn",
      "lon": 4.4521744,
      "id": 492794481,
      "name": "Sint-Stevens-Woluwe Woluwedal"
    }, {
      "lat": 50.8922243,
      "kind": "bus_stop De Lijn",
      "lon": 4.4610765,
      "id": 702067767,
      "name": "Zaventem Olmenstraat"
    }, {
      "lat": 50.87575,
      "kind": "bus_stop De Lijn",
      "lon": 4.4707064,
      "id": 785150895,
      "name": "Zaventem Bloemenveld"
    }, {
      "lat": 50.8696873,
      "kind": "bus_stop De Lijn",
      "lon": 4.5030736,
      "id": 842234787,
      "name": "Zaventem Mercuriusstraat"
    }, {
      "lat": 50.8753438,
      "kind": "bus_stop De Lijn",
      "lon": 4.493891,
      "id": 897842483,
      "name": "Zaventem Sint-Martinusweg"
    }, {
      "lat": 50.880092,
      "kind": "bus_stop De Lijn",
      "lon": 4.4695435,
      "id": 1008434248,
      "name": "Zaventem Kleine Daalstraat"
    }, {
      "lat": 50.8800387,
      "kind": "bus_stop De Lijn",
      "lon": 4.4697197,
      "id": 1008434291,
      "name": "Zaventem Kleine Daalstraat"
    }, {
      "lat": 50.8980925,
      "kind": "bus_stop De Lijn",
      "lon": 4.4818724,
      "id": 1014442257,
      "name": "Zaventem Luchthaven Perron B"
    }, {
      "lat": 50.8640946,
      "kind": "bus_stop De Lijn",
      "lon": 4.4348203,
      "id": 1128105196,
      "name": "Sint-Stevens-Woluwe Harenheide"
    }, {
      "lat": 50.8948023,
      "kind": "bus_stop De Lijn",
      "lon": 4.4638923,
      "id": 1161572507,
      "name": "Zaventem B-House"
    }, {
      "lat": 50.8947456,
      "kind": "bus_stop De Lijn",
      "lon": 4.4640785,
      "id": 1161572519,
      "name": "Zaventem B-House"
    }, {
      "lat": 50.898045,
      "kind": "bus_stop De Lijn",
      "lon": 4.4819103,
      "id": 1162032825,
      "name": "Zaventem Luchthaven Perron A"
    }, {
      "lat": 50.8760614,
      "kind": "bus_stop De Lijn",
      "lon": 4.4979678,
      "id": 1303255434,
      "name": "Zaventem Hoge Wei"
    }, {
      "lat": 50.8948401,
      "kind": "bus_stop De Lijn",
      "lon": 4.4695243,
      "id": 1303255464,
      "name": "Zaventem Gebouw 9"
    }, {
      "lat": 50.8756869,
      "kind": "bus_stop De Lijn",
      "lon": 4.4961488,
      "id": 1303255468,
      "name": "Zaventem Sint-Martinusweg"
    }, {
      "lat": 50.8818681,
      "kind": "bus_stop De Lijn",
      "lon": 4.4743025,
      "id": 1303255546,
      "name": "Zaventem Kerkplein"
    }, {
      "lat": 50.8962828,
      "kind": "bus_stop De Lijn",
      "lon": 4.4751118,
      "id": 1303255669,
      "name": "Zaventem Technics Noord"
    }, {
      "lat": 50.881767,
      "kind": "bus_stop De Lijn",
      "lon": 4.474196,
      "id": 1303255716,
      "name": "Zaventem Kerkplein"
    }, {
      "lat": 50.8727274,
      "kind": "bus_stop De Lijn",
      "lon": 4.4708457,
      "id": 1303255804,
      "name": "Zaventem Grote Daalstraat"
    }, {
      "lat": 50.8962741,
      "kind": "bus_stop De Lijn",
      "lon": 4.4753342,
      "id": 1303255858,
      "name": "Zaventem Technics Noord"
    }, {
      "lat": 50.8947835,
      "kind": "bus_stop De Lijn",
      "lon": 4.4698794,
      "id": 1303255893,
      "name": "Zaventem Gebouw 9"
    }, {
      "lat": 50.8854944,
      "kind": "bus_stop De Lijn",
      "lon": 4.4741543,
      "id": 1303255912,
      "name": "Zaventem Watertorenlaan"
    }, {
      "lat": 50.8904046,
      "kind": "bus_stop De Lijn",
      "lon": 4.4710511,
      "id": 1303255922,
      "name": "Zaventem Vilvoordelaan"
    }, {
      "lat": 50.8745478,
      "kind": "bus_stop De Lijn",
      "lon": 4.4899428,
      "id": 1303256011,
      "name": "Zaventem Facq - Ikea"
    }, {
      "lat": 50.8744608,
      "kind": "bus_stop De Lijn",
      "lon": 4.4903973,
      "id": 1303256095,
      "name": "Zaventem Facq - Ikea"
    }, {
      "lat": 50.890537,
      "kind": "bus_stop De Lijn",
      "lon": 4.4712072,
      "id": 1303256114,
      "name": "Zaventem Vilvoordelaan"
    }, {
      "lat": 50.8737637,
      "kind": "bus_stop De Lijn",
      "lon": 4.4870276,
      "id": 1304208145,
      "name": "Zaventem Sterrebeekstraat"
    }, {
      "lat": 50.8785352,
      "kind": "bus_stop De Lijn",
      "lon": 4.4728186,
      "id": 1304208193,
      "name": "Zaventem Vijvers"
    }, {
      "lat": 50.8937213,
      "kind": "bus_stop De Lijn",
      "lon": 4.4725294,
      "id": 1327996508,
      "name": "Zaventem Loodsen"
    }, {
      "lat": 50.8946921,
      "kind": "bus_stop De Lijn;STIB/MIVB",
      "lon": 4.4810762,
      "id": 1327996509,
      "name": "Zaventem Technics Zuid"
    }, {
      "lat": 50.8805974,
      "kind": "bus_stop De Lijn",
      "lon": 4.4553926,
      "id": 1335101874,
      "name": "Zaventem Henneau/Excelsior"
    }, {
      "lat": 50.8807778,
      "kind": "bus_stop De Lijn",
      "lon": 4.4556626,
      "id": 1335101875,
      "name": "Zaventem Henneau/Excelsior"
    }, {
      "lat": 50.880601,
      "kind": "bus_stop De Lijn",
      "lon": 4.45269,
      "id": 1335101905,
      "name": "Zaventem Minerva"
    }, {
      "lat": 50.880697,
      "kind": "bus_stop De Lijn",
      "lon": 4.4526341,
      "id": 1335101906,
      "name": "Zaventem Minerva"
    }, {
      "lat": 50.8798107,
      "kind": "bus_stop De Lijn",
      "lon": 4.4723283,
      "id": 1335101935,
      "name": "Zaventem Stationsstraat"
    }, {
      "lat": 50.8798491,
      "kind": "bus_stop De Lijn",
      "lon": 4.4732045,
      "id": 1335101937,
      "name": "Zaventem Stationsstraat"
    }, {
      "lat": 50.8895706,
      "kind": "bus_stop De Lijn",
      "lon": 4.4626957,
      "id": 1505299570,
      "name": "Zaventem Hoekplein"
    }, {
      "lat": 50.8746075,
      "kind": "bus_stop De Lijn",
      "lon": 4.4851932,
      "id": 1541566242,
      "name": "Zaventem Sterrebeekstraat"
    }, {
      "lat": 50.8749508,
      "kind": "bus_stop De Lijn",
      "lon": 4.4849221,
      "id": 1541566243,
      "name": "Zaventem Sterrebeekstraat"
    }, {
      "lat": 50.8840387,
      "kind": "bus_stop De Lijn",
      "lon": 4.4760585,
      "id": 1573948939,
      "name": "Zaventem Atheneum"
    }, {
      "lat": 50.8709156,
      "kind": "bus_stop De Lijn",
      "lon": 4.5108548,
      "id": 1599721107,
      "name": "Zaventem Van Ingelgomstraat"
    }, {
      "lat": 50.88068,
      "kind": "bus_stop De Lijn",
      "lon": 4.4756168,
      "id": 1599721121,
      "name": "Zaventem Mariadal"
    }, {
      "lat": 50.887146,
      "kind": "bus_stop De Lijn",
      "lon": 4.4687992,
      "id": 2129439211,
      "name": "Zaventem Zavo Groenstraat"
    }, {
      "lat": 50.8822223,
      "kind": "bus_stop De Lijn",
      "lon": 4.4636551,
      "id": 2139336700,
      "name": "Zaventem Hoogstraat"
    }, {
      "lat": 50.8697394,
      "kind": "bus_stop De Lijn",
      "lon": 4.4983089,
      "id": 2276034929,
      "name": "Zaventem Brixtonlaan"
    }, {
      "lat": 50.8697135,
      "kind": "bus_stop De Lijn",
      "lon": 4.4927776,
      "id": 2276034940,
      "name": "Zaventem Ikea"
    }, {
      "lat": 50.8698541,
      "kind": "bus_stop De Lijn",
      "lon": 4.4927443,
      "id": 2276034952,
      "name": "Zaventem Ikea"
    }, {
      "lat": 50.8762695,
      "kind": "bus_stop De Lijn",
      "lon": 4.4981335,
      "id": 2346758066,
      "name": "Zaventem Hoge Wei"
    }, {
      "lat": 50.8947414,
      "kind": "bus_stop De Lijn",
      "lon": 4.469737,
      "id": 2469061394,
      "name": "Zaventem Gebouw 9"
    }, {
      "lat": 50.8894702,
      "kind": "bus_stop De Lijn",
      "lon": 4.4630395,
      "id": 2469061397,
      "name": "Zaventem Hoekplein"
    }, {
      "lat": 50.8923961,
      "kind": "bus_stop De Lijn",
      "lon": 4.4611669,
      "id": 2469061398,
      "name": "Zaventem Olmenstraat"
    }, {
      "lat": 50.8860791,
      "kind": "bus_stop De Lijn",
      "lon": 4.4696762,
      "id": 2469061399,
      "name": "Zaventem Station"
    }, {
      "lat": 50.8895141,
      "kind": "bus_stop De Lijn",
      "lon": 4.4590633,
      "id": 2514522789,
      "name": "Zaventem Da Vinci"
    }, {
      "lat": 50.8897414,
      "kind": "bus_stop De Lijn",
      "lon": 4.4588964,
      "id": 2514522790,
      "name": "Zaventem Da Vinci"
    }, {
      "lat": 50.8981377,
      "kind": "bus_stop STIB/MIVB",
      "lon": 4.4818365,
      "id": 3202274132,
      "name": "Brussels Airport"
    }]
  }]
}
