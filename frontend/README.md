# MARVIN Frontend Web App

This is the [MARVIN frontend](../specs/marvin-frontend.json), an NGINX-based, [containerized](Dockerfile) Web app.

Start it like so:

    $ docker run -p 9876:80 mhausenblas/marvin-frontend:0.2.1

Then, you can head over to a web browser and interact with it via `http://locahost:9876`.
