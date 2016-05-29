# MARVIN

MARVIN is a demonstrator for a nanoservices based application on DC/OS. He got his name from another famous [Marvin](http://hitchhikers.wikia.com/wiki/Marvin) …

![MARVIN logo](img/marvin.jpg)

## Concept & Architecture

![MARVIN system architecture](img/sysarch.jpg)

MARVIN comprises three nanoservices (nS):

1. a [calendar proxy nS](nS1/)
1. an [OpenStreetMap lookup nS](nS2/)
1. an amenity recommender service producing time and geo-located suggestions for close-by amenities: `(timeframe, location, radius) --> close-by-amenity*`

Resources used in MARVIN:

- a default [Google calendar](https://calendar.google.com/calendar/ical/r5sj91351jcgb0gul5h0tvou7o%40group.calendar.google.com/public/basic.ics)

## Installation

In order to use MARVIN you'll have to have a [DC/OS 1.7](https://dcos.io/releases/1.7.0/) cluster set up.

## Usage

Deploy manually

Deploy using `dploy`
