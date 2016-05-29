# nS1: Calendar Proxy Nano Service

This nS is written in Go and takes a day as an input and emits events as timeframe/location key-value pairs:

    day --> (title, start, end, location)*

The response of nS1 is a JSON document, a list of events for a day in the following format:

    [
      {
        "title": "TITLE",
        "start": "YYYY-MM-DDTHH:mm:ssZ",
        "end": "YYYY-MM-DDTHH:mm:ssZ",
        "loc": "SOME CITY AND/OR COUNTRY"
      },
      ...
    ]

## Build & Execute

As a preparation, you need to do:

- `go get github.com/PuloV/ics-golang` to make the ics parser available
- `go get github.com/Sirupsen/logrus` to make the logger available

Then, build and execute:

    $ go install && ../../../../bin/marvin-calproxy

Note that if you want to use a different calendar, other than the [default](https://calendar.google.com/calendar/ical/r5sj91351jcgb0gul5h0tvou7o%40group.calendar.google.com/public/basic.ics) one, use the `MARVIN_CAL_URL` environment variable on startup to specify it:

    $ MARVIN_CAL_URL=http://example.com/mycal.ics marvin-calproxy

## Usage

To pull data from the calendar:

    $ http localhost:9999/sync
    HTTP/1.1 200 OK
    Content-Length: 0
    Content-Type: text/plain; charset=utf-8
    Date: Sun, 29 May 2016 04:41:04 GMT

To get events for a specific day:

    $ http localhost:9999/events?date=2016-06-02
    HTTP/1.1 200 OK
    Content-Length: 181
    Content-Type: application/javascript
    Date: Sun, 29 May 2016 04:42:49 GMT
    
    [{"title":"test","start":"2016-06-02T15:00:00Z","end":"2016-06-02T15:30:00Z","loc":"Solingen\\, Germany"},{"title":"SAP","start":"2016-06-02T10:00:00Z","end":"2016-06-02T12:00:00Z","loc":"Walldorf\\, Germany"}]

