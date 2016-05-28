# MARVIN

MARVIN is a demonstrator for a nanoservices based application on DC/OS. He got his name from another famous [Marvin](http://hitchhikers.wikia.com/wiki/Marvin) …

![MARVIN logo](img/marvin.jpg)

## Concept & Architecture

![MARVIN system architecture](img/sysarch.jpg)

MARVIN comprises three nanoservices (nS):

1. a calendar proxy service that pulls data from an online calendar and emits: `[(timeframe-:location)*]`
1. an OpenStreetMap lookup service that maps: `(location, radius) --> [close-by-amenity*]`
1. an amenity recommender service producing time and geo-located suggestions for close-by amenities: `(timeframe, location, radius) --> [close-by-amenity*]`

## Installation

In order to use MARVIN you'll have to have a [DC/OS 1.7](https://dcos.io/releases/1.7.0/) cluster set up.

## Usage

TBD
