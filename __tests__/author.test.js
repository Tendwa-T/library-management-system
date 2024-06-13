const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Author = require('../models/author');
const sequelize = require('../config/database');
const { generateToken } = require('../middleware/auth');

const mockAuthor = {
    firstName: "John",
    lastName: "Doe",
    authorID: "AU035"
};

const mockUser = {
    firstName: "Tirus",
    lastName: "Tendwa",
    email: "tendwa@admin.com",
    username: "Tendwa",
    password: "admin",
    isAdmin: true
}

// Test to Create an Author

describe('POST /create', () => {
    let token;
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        token = generateToken(user);
    });

    it('should create a new Author', async () => {

        const response = await request(app)
            .post('/authors/create')
            .set('Authorization', `${token}`)
            .send(mockAuthor)
            .expect(201)
            .expect((res) => {
                expect(res.body.data.firstName).toEqual(mockAuthor.firstName);
            });
        console.log(response.body);
    });

    it('should return a 409 if the author already exists', async () => {
        await Author.create(mockAuthor);

        const response = await request(app)
            .post('/authors/create')
            .set('Authorization', `${token}`)
            .send(mockAuthor)
            .expect(409)
            .expect((res) => {
                expect(res.body.message).toEqual('Author already exists');
            });
        console.log(response.body);
    });

    it('should return a 400 if the author name is not provided', async () => {
        mockAuthor.firstName = "";

        const response = await request(app)
            .post('/authors/create')
            .set('Authorization', `${token}`)
            .send(mockAuthor)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });


});

// Test to get all authors

describe('GET /', () => {
    it('should get all authors', async () => {
        const response = await request(app)
            .get('/authors/')
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toEqual(expect.any(Array));
            });
        console.log(response.body);
    });

});

// Test to get Author by ID
describe('GET /:id', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });
    it('should return a user with the specified ID', async () => {
        const author = await Author.create(mockAuthor);
        const response = await request(app)
            .get(`/authors/${author.authorID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.firstName).toEqual(expect.any(String));
            });
        console.log(response.body);
    });


});


// Test to Update an Author

describe('PUT /:id', () => {
    let token;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        token = generateToken(user);
    });

    it('should update an author with the specified ID', async () => {
        const author = await Author.create(mockAuthor);
        mockAuthor.firstName = "Jane";

        const response = await request(app)
            .put(`/authors/${author.authorID}`)
            .set('Authorization', `${token}`)
            .send(mockAuthor)
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toEqual(expect.any(Object));
                expect(res.body.message).toEqual('Author updated');
            });
        console.log(response.body);
    });

    it('should return a 404 if the author does not exist', async () => {
        const sampleAuthor = {
            firstName: "John",
            lastName: "Xamarin",
        };
        const response = await request(app)
            .put('/authors/AU1000')
            .set('Authorization', `${token}`)
            .send(sampleAuthor)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Author not found');
            });
        console.log(response.body);
    });

    it('should return a 400 if the author name is not provided', async () => {
        mockAuthor.firstName = "";

        const response = await request(app)
            .put(`/authors/${mockAuthor.authorID}`)
            .set('Authorization', `${token}`)
            .send(mockAuthor)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });


});

// Test to Delete an Author

describe('DELETE /:id', () => {
    let token;
    let author;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        token = generateToken(user);
        author = await Author.create(mockAuthor);
    });

    it('should delete an author with the specified ID', async () => {
        const response = await request(app)
            .delete(`/authors/${author.authorID}`)
            .set('Authorization', `${token}`)
            .expect(202)
            .expect((res) => {
                expect(res.body.message).toEqual('Author deleted');
            });
        console.log(response.body);
    });

    it('should return a 404 if the author does not exist', async () => {
        const response = await request(app)
            .delete('/authors/AU1000')
            .set('Authorization', `${token}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Author not found');
            });
        console.log(response.body);
    });

});


