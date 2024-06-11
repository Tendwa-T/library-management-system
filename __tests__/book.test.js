const request = require('supertest');
const app = require('../app');

// Test to get all books
describe('GET /', () => {
    it('should get all books', async () => {
        const response = await request(app)
            .get('/book/')
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toEqual(expect.any(Array));
            });
        console.log(response.body);
    });

    it('should return a 404 if no books are found', async () => {
        const response = await request(app)
            .get('/book/')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('No Books found');
            });
        console.log(response.body);
    });

});


// Test to Create a Book
describe('POST /create', () => {
    it('should create a new book', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: 'AU872',
            publishedDate: "1988-01-01",
            isbn: "9780062315007"
        }

        const response = await request(app)
            .post('/book/create')
            .send(sampleBook)
            .expect(201)
            .expect((res) => {
                expect(res.body.data.title).toEqual(sampleBook.title);

            });
        console.log(response.body);
    });

    it('should return a 409 if the book already exists', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: 'AU872',
            publishedDate: "1988-01-01",
            isbn: "9780062315007"
        }

        const response = await request(app)
            .post('/book/create')
            .send(sampleBook)
            .expect(409)
            .expect((res) => {
                expect(res.body.message).toEqual('Book already exists');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book title is not provided', async () => {
        const sampleBook = {
            title: "",
            authorID: 'AU872',
            publishedDate: "1988-01-01",
            isbn: "9780062315007"
        }

        const response = await request(app)
            .post('/book/create')
            .send(sampleBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book authorID is not provided', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: '',
            publishedDate: "1988-01-01",
            isbn: "9780062315007"
        }

        const response = await request(app)
            .post('/book/create')
            .send(sampleBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book publishedDate is not provided', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: 'AU872',
            publishedDate: "",
            isbn: "9780062315007"
        }

        const response = await request(app)
            .post('/book/create')
            .send(sampleBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book isbn is not provided', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: 'AU872',
            publishedDate: "1988-01-01",
            isbn: ""
        }

        const response = await request(app)
            .post('/book/create')
            .send(sampleBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return 404 if author does not exist', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: '1',
            publishedDate: "1988-01-01",
            isbn: "9780062315007"
        }

        const response = await request(app)
            .post('/book/create')
            .send(sampleBook)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual(`Author with the authorID: ${sampleBook.authorID} does not exist`);
            });
        console.log(response.body);
    });




});


// Test to get Book by ID / ISBN
describe('GET /:isbn', () => {
    it('should return a book with the specified ISBN', async () => {
        const response = await request(app)
            .get('/book/9780062315007')
            .expect(200)
            .expect((res) => {
                expect(res.body.data.title).toEqual(expect.any(String));
            });
        console.log(response.body);
    });

    it('should return a 404 if the book does not exist', async () => {
        const response = await request(app)
            .get('/book/9780062315008')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Book with the specified ISBN does not exist');
            });
        console.log(response.body);
    });

});

// Test to Update a Book
describe('PUT /:isbn', () => {
    it('should update a book with the specified ISBN', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: 'AU872',
            publishedDate: "1988-01-01",
        };

        const response = await request(app)
            .put('/book/9780062315007')
            .send(sampleBook)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.title).toEqual(sampleBook.title);
            });
        console.log(response.body);
    });

    it('should return a 400 if the book title is not provided', async () => {
        const sampleBook = {
            title: "",
            authorID: 'AU872',
            publishedDate: "1988-01-01",
        };

        const response = await request(app)
            .put('/book/9780062315007')
            .send(sampleBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book authorID is not provided', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: '',
            publishedDate: "1988-01-01",
        };

        const response = await request(app)
            .put('/book/9780062315007')
            .send(sampleBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the book publishedDate is not provided', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: 'AU872',
            publishedDate: "",
        };

        const response = await request(app)
            .put('/book/9780062315007')
            .send(sampleBook)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('All fields are required');
            });
        console.log(response.body);
    });

    it('should return a 404 if the book does not exist', async () => {
        const sampleBook = {
            title: "The Alchemist",
            authorID: 'AU872',
            publishedDate: "1988-01-01",
        };

        const response = await request(app)
            .put('/book/9780062315008')
            .send(sampleBook)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Book with the specified ISBN does not exist');
            });
        console.log(response.body);
    });


});


// Test to Delete a Book
describe('DELETE /:isbn', () => {
    it('should delete a book with the specified ID', async () => {
        const response = await request(app)
            .delete('/book/9780062315007')
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toEqual('Book deleted');
            });
        console.log(response.body);

    });

    it('should return a 404 if the book does not exist', async () => {
        const response = await request(app)
            .delete('/book/9780062315007')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('Book with the specified ISBN does not exist');
            });
        console.log(response.body);
    });

})