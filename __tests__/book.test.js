const request = require('supertest');
const app = require('../app');
const { generateToken } = require('../middleware/auth');
const sequelize = require('../config/database');
const User = require('../models/user');
const Book = require('../models/book');
const Author = require('../models/author');
const logger = require('../utils/logger')

const mockUser = {
    firstName: "Tirus",
    lastName: "Tendwa",
    email: "tendwa@admin.com",
    username: "Tendwa",
    password: "admin",
    isAdmin: true
}

const mockBook = {
    title: "The Alchemist",
    authorID: 'AU239',
    publishedDate: "1988-01-01",
    isbn: "9780062315007",
    quantity: 10
};

const mockBook2 = {
    title: "The Chemist",
    authorID: 'AU239',
    publishedDate: "1988-01-01",
    isbn: "97800623150100",
    quantity: 10
};

const mockBook3 = {
    title: "The SChemist",
    authorID: 'AU239',
    publishedDate: "1988-01-01",
    isbn: "9780062315107",
    quantity: 10
};

const mockAuthor = {
    firstName: "Paulo",
    lastName: "Coelho",
    authorID: 'AU' + Math.floor(Math.random() * 1000)
}


// Test to get all books
describe('Book Endpoints', () => {
    let token;
    let book;
    let book2;
    let book3;


    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const user = await User.create(mockUser);
        const author = await Author.create(mockAuthor);
        console.log(author);
        mockBook.authorID = author.authorID;
        mockBook2.authorID = author.authorID;
        mockBook3.authorID = author.authorID;
        token = generateToken(user);
        book = await Book.create(mockBook);
    });

    afterAll(async () => {
        await sequelize.close();
    });


    it('should get all books', async () => {
        const response = await request(app)
            .get('/books/')
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toEqual(expect.any(Array));
            });
        console.log(response.body);
    });

    it('should create a new book', async () => {
        const response = await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBook2)
            .expect(201)
            .expect((res) => {
                expect(res.body.data.title).toEqual(mockBook2.title);

            });
        logger.info(response.body);
        console.log("Response body:", response.body);
    });

    it('should return a 409 if the book already exists', async () => {
        const response = await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(409)
            .expect((res) => {
                expect(res.body.message).toEqual('Book already exists');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book title is not provided', async () => {
        mockBook.title = "";

        const response = await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book authorID is not provided', async () => {
        mockBook.authorID = "";

        const response = await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book publishedDate is not provided', async () => {
        mockBook.publishedDate = "";

        const response = await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book isbn is not provided', async () => {
        mockBook.isbn = "";

        const response = await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return 404 if author does not exist', async () => {
        mockBook2.authorID = 'AU01';

        const response = await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBook2)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual(`Author with the authorID: ${mockBook2.authorID} does not exist`);
            });
        console.log(response.body);
    });

    it('should return a book with the specified ISBN', async () => {
        const response = await request(app)
            .get(`/books/${book.isbn}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.title).toEqual(expect.any(String));
            });
        console.log(response.body);
    });

    it('should return a 404 if the book does not exist', async () => {
        const response = await request(app)
            .get('/books/9780062315008')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Book with the specified ISBN does not exist');
            });
        console.log(response.body);
    });

    it('should update a book with the specified ISBN', async () => {
        mockBook.title = "The Alchemist 2";
        const response = await request(app)
            .put(`/books/${book.isbn}`)
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.title).toEqual(mockBook.title);
            });
        console.log(response.body);
    });

    it('should return a 400 if the book title is not provided', async () => {
        mockBook.title = "";

        const response = await request(app)
            .put(`/books/${book.isbn}`)
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book authorID is not provided', async () => {
        mockBook.authorID = "";

        const response = await request(app)
            .put(`/books/${book.isbn}`)
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book publishedDate is not provided', async () => {
        mockBook.publishedDate = "";

        const response = await request(app)
            .put(`/books/${book.isbn}`)
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 404 if the book does not exist', async () => {
        mockBook.isbn = "9780062315008";

        const response = await request(app)
            .put(`/books/${mockBook.isbn}`)
            .set('Authorization', `${token}`)
            .send(mockBook)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Book with the specified ISBN does not exist');
            });
        console.log(response.body);
    });

    it('should delete a book with the specified ID', async () => {
        const response = await request(app)
            .delete(`/books/${book.isbn}`)
            .set('Authorization', `${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toEqual('Book deleted');
            });
        console.log(response.body);

    });

    it('should return a 404 if the book does not exist', async () => {

        const response = await request(app)
            .delete('/books/9780062315100')
            .set('Authorization', `${token}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Book with the specified ISBN does not exist');
            });
        console.log(response.body);
    });

});