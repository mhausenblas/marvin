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
import overpass

from tornado.escape import json_encode

DEBUG = True
VERSION = "0.2.0"
PORT = 8989
api = overpass.API()

if DEBUG:
  FORMAT = "%(asctime)-0s %(levelname)s %(message)s [at line %(lineno)d]"
  logging.basicConfig(level=logging.DEBUG, format=FORMAT, datefmt="%Y-%m-%dT%I:%M:%S")
else:
  FORMAT = "%(asctime)-0s %(message)s"
  logging.basicConfig(level=logging.INFO, format=FORMAT, datefmt="%Y-%m-%dT%I:%M:%S")

class LookupAPIHandler(tornado.web.RequestHandler):
    def get(self, location):
        """
        Handles lookup of public transport via `/closeby/$LOCATION?radius=$RADIUS` resource.
        """
        try:
            radius = self.get_query_argument(name="radius", default=100, strip=True) # default to 100m radius
            logging.debug("Got location '%s' with radius %dm" %(location, int(radius)))
            oql = "node[\"name\"~\"%s\"]; node(around:%d)[\"public_transport\"=\"platform\"];" %(location,int(radius))
            logging.debug("OQL: %s" %(oql))
            lres = api.Get(oql)
            if lres:
                self.set_header("Content-Type", "application/json")
                ptfs = [] # the public transport facility list
                for f in lres["features"]:
                    p = f["properties"]
                    desc = ""
                    if "highway" in p:
                        desc = p["highway"]
                    if "operator" in p:
                        desc = desc + " " + p["operator"]
                    g = f["geometry"]
                    c = g["coordinates"]
                    ptf = { 
                        "id" : f["id"], 
                        "name" : p["name"], 
                        "kind" : desc, 
                        "lat" : c[1], 
                        "lon" : c[0]
                    }
                    logging.debug("PTF name: %s kind: %s" %(p["name"], desc))
                    ptfs.append(ptf)
                self.write(json_encode(ptfs))
                self.finish()
            else:
                logging.debug("No close-by things found")
                self.set_status(404)
        except Exception, e:
            logging.debug(e)
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
    print("This is  MARVIN nanoservice [OpenStreetMap Lookup] v%s listening on port %s" %(VERSION, PORT))
    tornado.ioloop.IOLoop.current().start()