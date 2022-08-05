const express = require("express");
const path = require("path");
const cors = require('cors');
const morgan = require("morgan");

const planetsRoute = require("./routes/planets/planets.router");
const launchesRoute = require("./routes/launches/launches.router");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(morgan("combined"));

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'pub')));
app.use('/planets', planetsRoute);
app.use('/launches', launchesRoute);

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pub', 'index.html'));
});

module.exports = app;