# nS2: OpenStreetMap Lookup Nano Service

This nS is written in python and that maps a location/radius to close-by amenities:

    (location, radius) --> close-by-amenity*

The response of nS2 is a JSON document, a list of close-by amenities for a location in the following format:

    [
      ...
    ]


    import overpass
    api = overpass.API()
    response = api.Get('node["name"="Salt Lake City"]')

    node["name"~"Zaventem"]["public_transport"="platform"];
    node(around:1000)["amenity"="post_box"];
    out body;

    node["name"~"crowne plaza airport belgium"];
    node(around:500)["public_transport"="platform"];
    out body;



## Usage

To get the amenities for a certain location (note that the default radius is 100m, so `closeby/brussels` is really the same as `closeby/brussels?radius=100` ):

    http localhost:8989/closeby/brussels?radius=500

