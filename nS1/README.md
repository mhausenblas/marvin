# nS1: Calendar Proxy Nano Service

This nS is written in Go and takes a day as an input and emits events as timeframe/location key-value pairs:

    day --> (timeframe:location)*

## Build & Execute

As a preparation, you need to do:

- `go get github.com/PuloV/ics-golang` to make the ics parser available
- `go get github.com/Sirupsen/logrus` to make the logger available

Then, build and execute:

    $ go install && ../../../../bin/marvin-calproxy

## Usage

    $ http localhost:9999/events?date=2016-05-31
    HTTP/1.1 200 OK
    Content-Length: 57
    Content-Type: application/javascript
    Date: Sat, 28 May 2016 17:27:58 GMT

    {"tf":"2016-05-31T09:30:00Z","loc":"Brussels\\, Belgium"}