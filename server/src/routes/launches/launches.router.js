const express = require("express");

const launchesRoute = express.Router();

const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require("./launches.controller");

launchesRoute.post('/', httpAddNewLaunch);
launchesRoute.get('/', httpGetAllLaunches);
launchesRoute.delete('/:id', httpAbortLaunch);

module.exports = launchesRoute;