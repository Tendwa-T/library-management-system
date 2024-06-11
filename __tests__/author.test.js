const request = require('supertest');
const app = require('../app');
// Test to get all authors

describe('GET /authors', () => {
    it('should get all authors', async () => {
        const response = await request(app)
            .get('/author/')
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toEqual(expect.any(Array));
            });
        console.log(response.body);
    });

});

// Test to Create an Author

describe('POST /create', () => {
    it('should create a new Author', async () => {
        const sampleAuthor = {
            name: "John Cena",
        };

        const response = await request(app)
            .post('/author/create')
            .send(sampleAuthor)
            .expect(201)
            .expect((res) => {
                expect(res.body.data.name).toEqual(sampleAuthor.name);
            });
        console.log(response.body);
    });

});

// Test to get Author by ID


// Test to Update an Author

// Test to Delete an Author

// TODO: Add a test to Ensure user validation before creation of an author

