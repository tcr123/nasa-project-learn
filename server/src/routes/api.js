const express = require('express');

const planetsRoute = require("./planets/planets.router");
const launchesRoute = require("./launches/launches.router");

const api = express.Router();

api.use('/planets', planetsRoute);
api.use('/launches', launchesRoute);

module.exports = api;