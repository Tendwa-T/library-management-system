const request = require('supertest');
const app = require('../app');
// Test to get all authors

describe('GET /', () => {
    it('should get all authors', async () => {
        const response = await request(app)
            .get('/author/')
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toEqual(expect.any(Array));
            });
        console.log(response.body);
    });

    it('should return a 404 if no authors are found', async () => {
        const response = await request(app)
            .get('/author/')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('No Authors found');
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

    it('should return a 409 if the author already exists', async () => {
        const sampleAuthor = {
            name: "John Cena",
        };

        const response = await request(app)
            .post('/author/create')
            .send(sampleAuthor)
            .expect(409)
            .expect((res) => {
                expect(res.body.message).toEqual('Author already exists');
            });
        console.log(response.body);
    });

    it('should return a 400 if the author name is not provided', async () => {
        const sampleAuthor = {
            name: "",
        };

        const response = await request(app)
            .post('/author/create')
            .send(sampleAuthor)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('Name is required');
            });
        console.log(response.body);
    });


});

// Test to get Author by ID
describe('GET /:id', () => {
    it('should return a user with the specified ID', async () => {
        const response = await request(app)
            .get('/author/AU673')
            .expect(200)
            .expect((res) => {
                expect(res.body.data.name).toEqual(expect.any(String));
            });
        console.log(response.body);
    });

    it('should return a 404 if the author does not exist', async () => {
        const response = await request(app)
            .get('/author/AU1000')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Author with the specified ID does not exist');
            });
        console.log(response.body);
    });

});


// Test to Update an Author

describe('PUT /:id', () => {
    it('should update an author with the specified ID', async () => {
        const sampleAuthor = {
            name: "John Doe",
        };

        const response = await request(app)
            .put('/author/AU673')
            .send(sampleAuthor)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.name).toEqual(sampleAuthor.name);
            });
        console.log(response.body);
    });

    it('should return a 500 if the author does not exist', async () => {
        const sampleAuthor = {
            name: "John Doe",
        };

        const response = await request(app)
            .put('/author/AU1000')
            .send(sampleAuthor)
            .expect(500)
            .expect((res) => {
                expect(res.body.message).toEqual('Author not found');
            });
        console.log(response.body);
    });

    it('should return a 400 if the author name is not provided', async () => {
        const sampleAuthor = {
            name: "",
        };

        const response = await request(app)
            .put('/author/AU673')
            .send(sampleAuthor)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('Name is required');
            });
        console.log(response.body);
    });


});

// Test to Delete an Author

describe('DELETE /:id', () => {
    it('should delete an author with the specified ID', async () => {
        const response = await request(app)
            .delete('/author/AU673')
            .expect(202)
            .expect((res) => {
                expect(res.body.message).toEqual('Author deleted');
            });
        console.log(response.body);
    });

    it('should return a 500 if the author does not exist', async () => {
        const response = await request(app)
            .delete('/author/AU1000')
            .expect(500)
            .expect((res) => {
                expect(res.body.message).toEqual('Author not found');
            });
        console.log(response.body);
    });

});

// TODO: Add a test to Ensure user validation before creation of an author

