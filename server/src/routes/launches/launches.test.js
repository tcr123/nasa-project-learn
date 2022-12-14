const request = require("supertest");
const { mongoConnect, mongoDisconnet } = require('../../services/mongo');
const app = require("../../app");
const { loadAllPlanets } = require("../../models/planets.model");

// test for get launches
describe('Launches API', () => {
    beforeAll(async() => {
        await mongoConnect();
        await loadAllPlanets();
    });

    afterAll(async() => {
        await mongoDisconnet();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /launches', () => {
        const completeLaunchData = {
            mission: "Kepler Exploration ZTM",
            rocket: "Explorer IS1",
            launchDate: "December 31, 2030",
            target: "Kepler-442 b"
        };
    
        const launchDataWithoutDate = {
            mission: "Kepler Exploration ZTM",
            rocket: "Explorer IS1",
            target: "Kepler-442 b"
        };
    
        const launchDataWithWrongDate = {
            mission: "Kepler Exploration ZTM",
            rocket: "Explorer IS1",
            launchDate: "root",
            target: "Kepler-442 b"
        }
    
        test('It should respond with 201 success', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('Missing values', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(response.body).toStrictEqual({
                error: "Missing values that important for request",
            });
        });
    
        test('Invalid date', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithWrongDate)
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(response.body).toStrictEqual({
                error: "Invalid date for launching",
            });
        });
    });
});
