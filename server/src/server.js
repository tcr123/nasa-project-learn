const http = require('http');

require('dotenv').config();

const { mongoConnect } = require('./services/mongo');
const app = require('./app');

const PORT = process.env.PORT || 8000;

const { loadAllPlanets } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadLaunchData();
    await loadAllPlanets();

    server.listen(PORT, () => {
        console.log(`Listening to the port ${PORT} ...`);
    });
}

startServer();
