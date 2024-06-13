const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Author = require('../models/author');
const sequelize = require('../config/database');
const { generateToken } = require('../middleware/auth');

const mockUser = {
    firstName: "Tirus",
    lastName: "Tendwa",
    email: "tendwa@admin.com",
    username: "Tendwa",
    password: "admin",
    isAdmin: true
}
const mockUserB = {
    firstName: "Jackie",
    lastName: "Chan",
    email: "chan@kungfu.com",
    username: "JackieChan",
    password: "kungfu",
    isAdmin: false
}


// Test to get all users
describe('GET /users', () => {
    let token;
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        token = generateToken(user);
    }
    );
    it('should return 200 if there are users', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toEqual(1);
            });
        console.log(response.body);
    });
    it('should return 404 if there are no users', async () => {
        await User.destroy({ truncate: true });
        const response = await request(app)
            .get('/users')
            .set('Authorization', `${token}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('No Users found');
            });
        console.log(response.body);

    });
    it('should return 403 if the user is not an admin', async () => {
        const user = await User.create(mockUserB);
        const token = generateToken(user);
        const response = await request(app)
            .get('/users')
            .set('Authorization', `${token}`)
            .expect(403)
            .expect((res) => {
                expect(res.body.message).toEqual('Unauthorized');
            });
        console.log(response.body);
    })

    afterAll(async () => {
        await sequelize.close();
    });
}
);

// Test to Create a User
describe('POST /create', () => {
    let token;
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        token = generateToken(user);

    });

    it('should create a new User', async () => {
        const response = await request(app)
            .post('/users/create')
            .set('Authorization', `${token}`)
            .send(mockUserB)
            .expect(201)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });
        console.log(response.body);
    });

    it('should return a 400 if the user name is not provided', async () => {
        mockUser.username = "";
        const response = await request(app)
            .post('/users/create')
            .set('Authorization', `${token}`)
            .send(mockUser)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the user name is invalid', async () => {
        mockUser.username = "Tendwa@";
        const response = await request(app)
            .post('/users/create')
            .set('Authorization', `${token}`)
            .send(mockUser)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('Invalid username');
            });
        console.log(response.body);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});


// Test to get a user by username
describe('GET /:username', () => {
    let token;
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        token = generateToken(user);
    });

    it('should return 200 if the user is found', async () => {
        const response = await request(app)
            .get('/users/Tendwa')
            .set('Authorization', `${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.username).toEqual('Tendwa');
            });
        console.log(response.body);
    });

    it('should return 404 if the user is not found', async () => {
        const response = await request(app)
            .get('/users/JohnDoe')
            .set('Authorization', `${token}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('User with the specified ID does not exist');
            });
        console.log(response.body);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});

// Test to Update a User
describe('PUT /:username', () => {
    let token;
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        token = generateToken(user);
    });

    it('should update a user', async () => {
        const response = await request(app)
            .put('/users/Tendwa')
            .set('Authorization', `${token}`)
            .send({ firstName: "Tirus", lastName: "Tendwa", email: "tend@wawa.com", username: "Tendwa", password: "admin" })
    });

    it('should return a 400 if the user name is not provided', async () => {
        const response = await request(app)
            .put('/users/Tendwa')
            .set('Authorization', `${token}`)
            .send({ firstName: "Tirus", lastName: "Tendwa", email: "tend@wawa.com", username: "", password: "admin" })
    });

    it('should return a 400 if the user name is invalid', async () => {
        const response = await request(app)
            .put('/users/Tendwa')
            .set('Authorization', `${token}`)
            .send({ firstName: "Tirus", lastName: "Tendwa", email: "tend@wawa.com", username: "Tendwa@", password: "admin" })
    });

    afterAll(async () => {
        await sequelize.close();
    });

});

// Test to Delete a User

describe('DELETE /:username', () => {
    let token;
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        token = generateToken(user);
    });

    it('should delete a user', async () => {
        const response = await request(app)
            .delete('/users/Tendwa')
            .set('Authorization', `${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toEqual('User deleted');
            });
        console.log(response.body);
    });

    it('should return a 404 if the user is not found', async () => {
        const response = await request(app)
            .delete('/users/Tendwa')
            .set('Authorization', `${token}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('User with the specified ID does not exist');
            });
        console.log(response.body);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});