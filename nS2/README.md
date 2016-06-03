# nS2: OpenStreetMap Lookup Nanoservice

[This nS](../specs/marvin-osmlookup.json) is written in Python and maps a location and radius to close-by public transport facilities:

    (location, radius) --> close-by-ptf*

The response of nS2 is a JSON document (a list of close-by public transport facilities) in the following format:

    [
      {
          "id": ID,
          "kind": "TYPE",
          "lat": 0.000000,
          "lon": 0.000000,
          "name": "SOMENAME"
      },
      ...
    ]


The nS2 uses the [Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API/), for example (in OQL):

    node["name"~"Zaventem"]["public_transport"="platform"];
    node(around:1000)["amenity"="post_box"];
    out body;
    
    node["name"~"Zaventem"];
    node(around:200)["public_transport"="platform"];
    out body;

See also http://overpass-turbo.eu for interactive testing and mapping.


## Build & Execute

There's no build step but you will need Python installed; I've been using `2.7.9` in development. You can execute the nS like so:

    $ python osmlookup.py

Or the containerized version:

    $ docker run -P mhausenblas/marvin-lookup

## Usage

To get close-by public transport facilities for the area called `Zaventem` with a `50m` radius:

    $ http localhost:8989/closeby/Zaventem?radius=50
    HTTP/1.1 200 OK
    Content-Length: 8223
    Content-Type: application/json
    Date: Sun, 29 May 2016 18:03:31 GMT
    Etag: "4230b265ce8123c7be5a903bc70d750a59aa997e"
    Server: TornadoServer/4.3
    
    [
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
    ]

Note that the default radius is 100m, so `closeby/Zaventem` is really the same as `closeby/Zaventem?radius=100`