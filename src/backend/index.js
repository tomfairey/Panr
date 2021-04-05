#!/usr/bin/env nodejs
import 'dotenv/config';
import express from 'express';
import api from './api';

const app = express();

app.use(express.json());
app.set('trust proxy', 'loopback');

app.use((req, res, next) => {
    console.log("LOG:", req.originalUrl, "-", req.ip);
    next();
});

app.use("/panr", api);

app.get('/', (req, res) => {
	return res.json({
        "status": 200,
        "message": "Service operational!",
        "timestamp": Math.floor(Date.now() / 1000),
        "links": [
            {
                "href": `/`,
                "method": "GET",
                "rel": "self"
            },
            {
                "href": `/panr/`,
                "method": "GET",
                "rel": "panrAPI",
                "links": [
                    {
                        "href": `/panr/location/`,
                        "method": "GET",
                        "rel": "location",
                        "links": [
                            {
                                "href": `/panr/location/:uuid`,
                                "method": "GET",
                                "rel": "locationByUUID"
                            }
                        ]
                    },
                    {
                        "href": `/panr/hotspot/`,
                        "method": "GET",
                        "rel": "hotspot",
                        "links": [
                            {
                                "href": `/panr/hotspot/:uuid`,
                                "method": "GET",
                                "rel": "hotspotByUUID"
                            }
                        ]
                    }
                ]
            }
        ]
    });
});

app.use((req, res) => {
    res.status(404).send({
        uri: req.url,
        host: req.headers.host,
        status: 404,
        message: "Resource not found"
    })
});

app.listen(80, () => {
    console.log("Listening on :80");
});