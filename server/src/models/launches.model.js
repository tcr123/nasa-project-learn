const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require('axios');

const DEFAULT_FLIGHTNUMBER = 100;
const LAUNCH_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    console.log("Downloading the data from NASA...");
    const response = await axios.post(LAUNCH_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        "name": 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        "customers": 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.log('Problem when downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customer = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customer: customer
        }
        
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
    }
}

async function loadLaunchData() {
    const firstFilter = {
        flightNumber: 1,
        mission: 'FalconSat',
        rocket: 'Falcon 1'
    }

    const result = findLaunch(firstFilter);

    if (result) {
        console.log("Launch data already loaded!");
        return;
    } else {
        await populateLaunches();
    }
}

async function getAllLaunches(skip, limit) {
    return await launchesDatabase.find({}, {
        '_id': 0,
        '__v': 0
    }).sort({
        flightNumber: 1
    }).skip(skip).limit(limit);
}

async function getLatestFlightNumber() {
    const latestFlight = await launchesDatabase.findOne().sort('-flightNumber');

    if (!latestFlight) return DEFAULT_FLIGHTNUMBER;

    return latestFlight.flightNumber;
}

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        kepler_name: launch.target
    });

    if (!planet) {
        throw new Error('Target Not Found');
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customer: ['ZTM', 'NASA'],
        upcoming: true,
        success: true
    });

    await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function existLaunchById(id) {
    return findLaunch({
        flightNumber: id
    });
}

async function abortLaunchById(id) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: id
    }, {
        upcoming: false,
        success: false
    });

    return aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    loadLaunchData,
    scheduleNewLaunch,
    existLaunchById,
    abortLaunchById
};