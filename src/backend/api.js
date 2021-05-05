import { Router } from 'express';
import database from './database';

const router = Router();

router.get("/", (req, res) => {
    return res.json({
        "links": [
            {
                "href": `/panr/`,
                "method": "GET",
                "rel": "self"
            },
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
    });
});

router.get("/location/", async (req, res) => {
    let locations = {};

    let locationQuery = await database.query('panr', `SELECT * FROM \`location\`;`);
    delete locationQuery.meta;

    let hotspotQuery = await database.query('panr', `SELECT * FROM \`hotspot\`;`);
    delete hotspotQuery.meta;

    for(let location of locationQuery) {
        for(let hotspot of hotspotQuery.filter(h => h.location == location.uuid)) {
            if(!location.hasOwnProperty('hotspots')) location.hotspots = [];

            location.hotspots.push(hotspot);
        }

        locations[location.uuid] = location;
    }

    return res.json({
        locations,
        links: [{
            "href": `/panr/location/`,
            "method": "GET",
            "rel": "self"
        }]
    });
});

router.get("/hotspot/", (req, res) => {
    return res.json({
        links: [{
            "href": `/panr/hotspot/`,
            "method": "GET",
            "rel": "self"
        }]
    });
});

router.get("/meta/", async (req, res) => {
    let meta = [];

    let metaQuery = await database.query('panr', `SELECT * FROM \`metadata\`;`);
    delete metaQuery.meta;

    for(let metadata of metaQuery) {
        if(metadata.global > 0) {
            metadata.global = true;
            delete metadata.campus;
        } else {
            metadata.global = false;
        }

        meta.push(metadata);
    }

    return res.json({
        meta,
        links: [{
            "href": `/panr/meta/`,
            "method": "GET",
            "rel": "self"
        }]
    });
});

export default router;