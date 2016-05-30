# nS3: Close-by Public Transport Recommender Nano Service

This nS is written in Node.js and produces a list of events with recommendations for close-by public transport facilities:

    --> (event, (close-by-ptf)*)

With: `event: {title, start, end, loc}`

The response of nS3 is a JSON document in the following format:

    [
      ...
    ]

This nS uses [Express](http://expressjs.com/en/4x/api.html).

## Build & Execute

You will need Node.js installed; I've been using `v5.10.1` in development. As a preparation, you need to do an `npm install`. Then you can execute the nS like so:

    $ node server.js
    This is MARVIN recommender running on http://localhost:8787

Or the containerized version:

    $ docker run -P mhausenblas/marvin-rec

## Usage

To get the event list with recommendations (fixed to today's date):

    $ http localhost:8787/rec
