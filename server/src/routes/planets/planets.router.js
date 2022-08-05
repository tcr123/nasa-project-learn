const express = require("express");

const { httpGetAllPlanets } = require("./planets.controller");

const planetsRoute = express.Router();

planetsRoute.get('/', httpGetAllPlanets);

module.exports = planetsRoute;