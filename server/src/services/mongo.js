const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connection.once('open', () => {
    console.log('MongoDb connected');
})

mongoose.connection.on('error', (err) => {
    console.log(err);
});

async function mongoConnect() {
    await mongoose.connect(process.env.MONGO_URL);
}

async function mongoDisconnet() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnet
}