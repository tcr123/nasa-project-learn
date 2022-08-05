const http = require('http');

const app = require('./app');

const PORT = process.env.PORT || 8000;

const { loadAllPlanets } = require("./models/planets.model");

const server = http.createServer(app);

async function startServer() {
    await loadAllPlanets();

    server.listen(PORT, () => {
        console.log(`Listening to the port ${PORT} ...`);
    });
}

startServer();
