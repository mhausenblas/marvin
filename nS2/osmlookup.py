#!/usr/bin/env python

"""
OSM Lookup nanoservice

@author: Michael Hausenblas, http://mhausenblas.info/#i
@since: 2016-05-29
"""

import logging
import os
import hashlib
import argparse
import json
import tornado.ioloop
import tornado.web
import osmapi

from tornado.escape import json_encode

DEBUG = True
api = osmapi.OsmApi()



if DEBUG:
  FORMAT = "%(asctime)-0s %(levelname)s %(message)s [at line %(lineno)d]"
  logging.basicConfig(level=logging.DEBUG, format=FORMAT, datefmt="%Y-%m-%dT%I:%M:%S")
else:
  FORMAT = "%(asctime)-0s %(message)s"
  logging.basicConfig(level=logging.INFO, format=FORMAT, datefmt="%Y-%m-%dT%I:%M:%S")

class LookupAPIHandler(tornado.web.RequestHandler):
    def get(self, location):
        """
        Handles amenities lookup via `/closeby/$LOCATION?radius=$RADIUS` resource.
        """
        try:
            radius = self.get_query_argument(name="radius", default=100, strip=True) # default to 100m radius
            logging.debug("Got location '%s' with radius %dm" %(location, int(radius)))
            
            amenity = api.NodeGet(123)
            if amenity:
                self.set_header("Content-Type", "text/plain")
                self.write(amenity)
                self.finish()
            else:
                self.set_status(404)
        except:
            self.set_status(404)

def _make_app():
    """
    Set up the API handler.
    """
    return 

if __name__ == "__main__":
    app = tornado.web.Application([
        (r"/closeby/(.*)", LookupAPIHandler)
    ])
    app.listen(8989)
    tornado.ioloop.IOLoop.current().start()