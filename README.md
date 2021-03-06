# MARVIN

![MARVIN logo](img/marvin.jpg)

MARVIN is a simple, non-trivial yet complete nanoservices example on [DC/OS](https://dcos.io/). He got his name from another famous [Marvin](http://hitchhikers.wikia.com/wiki/Marvin). MARVIN provides recommendations for close-by public transport 
facilities such as bus stops for the events in a calendar provided. You can think of it as a sort of very specialized 
spatio-temporal personal assistant. 

## System Architecture

![MARVIN system architecture](img/sysarch.png)

MARVIN comprises:

1. a calendar proxy nanoservice [nS1](nS1/)
1. an OpenStreetMap lookup nanoservice [nS2](nS2/)
1. an public transport facilities (PTF) recommender nanoservice [nS3](nS3/)
1. a frontend, a NGINX-based Web app [frontend](frontend/)
1. [go2](https://github.com/mhausenblas/go2) as a service discovery mechanism

Data sources used in MARVIN:

- a default [Google calendar](https://calendar.google.com/calendar/ical/r5sj91351jcgb0gul5h0tvou7o%40group.calendar.google.com/public/basic.ics)
- OpenStreetMap, to be precise the [Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API/)

## Deployment

In order to use MARVIN you'll have to have a [DC/OS 1.7](https://dcos.io/releases/1.7.0/) cluster set up.

Deploy manually:

    $ cd specs/
    $ dcos marathon app add go2.json
    $ dcos marathon app add marvin-events.json
    $ dcos marathon app add marvin-osmlookup.json
    $ dcos marathon app add marvin-rec.json
    $ dcos marathon app add marvin-frontend.json

Deploy using [dploy](http://dploy.sh): TBD

## Usage

Once MARVIN is deployed you can go to the front-end and get recommendations for public transport facilities that are close-by your today's events:

![MARVIN system architecture](img/frontend.png)

Note that is you want to extend MARVIN, have a look at the [development and testing](dev.md) document.