# Development and Testing

## Prerequisites 

Below is not using the containerized versions so your environment needs the following:

- Go in version 1.6
- Python in version 2.7
- Node.js in version 5.10

In addition, I'm using [http](http://httpie.org) and [jq](https://stedolan.github.io/jq/) below but you can use `curl` and `grep` as well, instead.

## Testing

You'll needs four terminals to run the MARVIN components.

**Terminal 1—nS1: Calendar Proxy**

    ~/Documents/repos/mhausenblas/marvin/nS1/src/github.com/mhausenblas/marvin-calproxy $ ../../../../bin/marvin-calproxy
    This is the MARVIN nanoservice [Calendar Proxy] in version 0.2.0 listening on port 9999
    Proxying the following calendar:
    https://calendar.google.com/calendar/ical/r5sj91351jcgb0gul5h0tvou7o%40group.calendar.google.com/public/basic.ics
    INFO[0010] Pulled events from https://calendar.google.com/calendar/ical/r5sj91351jcgb0gul5h0tvou7o%40group.calendar.google.com/public/basic.ics  handle=/sync
    INFO[0024] Got day param 2016-05-30                      handle=/events
    INFO[0024] Looking up events for 2016-05-30 00:00:00 +0000 UTC  handle=/
    INFO[0024] Got 1 event(s)                                handle=/events
    ...

**Terminal 2—nS2: OpenStreetMap Lookup**

    ~/Documents/repos/mhausenblas/marvin/nS2 $ python osmlookup.py
    This is  MARVIN nanoservice [OpenStreetMap Lookup] v0.1.0 listening on port 8989
    2016-05-30T10:06:16 Starting new HTTP connection (1): overpass-api.de
    2016-05-30T10:06:35 200 GET /closeby/Zaventem (127.0.0.1) 19189.78ms
    ...

**Terminal 3—nS3: Close-by Public Transport Recommender**

    ~/Documents/repos/mhausenblas/marvin/nS3 $ node server.js
    This is MARVIN nanoservice [Close-by Public Transport Recommender] listening on port 8787
    Looking up events for today, that is: 2016-05-30
    [{"title":"Lunch","start":"2016-05-30T13:00:00Z","end":"2016-05-30T14:00:00Z","loc":"Zaventem"}]
    Looking at event #1
    Looking up close-by public transport facilities for: Zaventem
    Done with lookups

**Terminal 4—Front-end mocking**

    ~/Documents/repos/mhausenblas/marvin $ http localhost:8787/rec
    HTTP/1.1 200 OK
    Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 7581
    Content-Type: application/json; charset=utf-8
    Date: Mon, 30 May 2016 09:52:19 GMT
    ETag: W/"1d9d-iPMcR2GqFLcVmg6rujt8ig"
    X-Powered-By: Express
    
    [
        {
            "closeby": [
                {
                    "id": 144913426,
                    "kind": "bus_stop",
                    "lat": 50.8720864,
                    "lon": 4.4774319,
                    "name": "Zaventem De Vlemincklaan"
                },
                ...
                {
                    "id": 3202274132,
                    "kind": "bus_stop",
                    "lat": 50.8981377,
                    "lon": 4.4818365,
                    "name": "Brussels Airport"
                }
            ],
            "end": "2016-05-30T14:00:00Z",
            "loc": "Zaventem",
            "start": "2016-05-30T13:00:00Z",
            "title": "Lunch"
        }
    ]
