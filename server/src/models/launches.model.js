const launches = new Map();

let flightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    flightNumber++;
    launches.set(flightNumber, Object.assign(launch, {
        flightNumber: flightNumber,
        customer: ['ZTM', 'NASA'],
        upcoming: true,
        success: true
    }));
}

function existLaunchById(id) {
    return launches.has(id);
}

function abortLaunchById(id) {
    const aborted = launches.get(id);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchById,
    abortLaunchById
};