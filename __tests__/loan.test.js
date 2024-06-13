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

const mockLoan = {
    memberID: 'US123',
    bookISBN: '9780062315007',
}

const mockMember = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@test.com',
    phoneNumber: '0712345678'
}

const mockBook = {
    title: "The Alchemist",
    authorID: 'AU239',
    publishedDate: "1988-01-01",
    isbn: "9780062315007",
    quantity: 10
};
const mockBookA = {
    title: "The MAtchchemist",
    authorID: 'AU239',
    publishedDate: "1988-01-01",
    isbn: "9780062315080",
    quantity: 10
};
const mockBookB = {
    title: "The PEchemist",
    authorID: 'AU239',
    publishedDate: "1988-01-01",
    isbn: "9780062315090",
    quantity: 10
};
const mockBookC = {
    title: "The Chemist",
    authorID: 'AU239',
    publishedDate: "1988-01-01",
    isbn: "97800623150100",
    quantity: 10
};

// Test to Create a loan
describe('Loan Endpoints', () => {
    let token;
    let book
    let bookA;
    let bookB;
    let bookC;
    let mockLoanA;
    let mockLoanB;
    let mockLoanC;
    let author;
    let member;
    let loan;
    let returnMockLoan;
    let deleteMockLoan;

    beforeAll(async () => {
        await sequelize.sync({ force: true })
        const user = await User.create(mockUser);
        token = generateToken(user);
        author = await Author.create(mockAuthor);
        mockBookA.authorID = author.authorID;
        mockBookB.authorID = author.authorID;
        mockBookC.authorID = author.authorID;

        // Create books

        await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBookA)
            .expect(201)
            .expect((res) => {
                expect(res.body.data.title).toEqual(mockBookA.title);
                bookA = res.body.data;
            });

        await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBookB)
            .expect(201)
            .expect((res) => {
                expect(res.body.data.title).toEqual(mockBookB.title);
                bookB = res.body.data;
            });

        await request(app)
            .post('/books/create')
            .set('Authorization', `${token}`)
            .send(mockBookC)
            .expect(201)
            .expect((res) => {
                expect(res.body.data.title).toEqual(mockBookC.title);
                bookC = res.body.data;
            });



        // Create members
        await request(app)
            .post('/members/create')
            .set('Authorization', `${token}`)
            .send(mockMember)
            .expect(201)
            .expect((res) => {
                expect(res.body.data.firstName).toEqual(mockMember.firstName);
                member = res.body.data;
            });

        // Create Loans
        mockLoanA = {
            memberID: member.memberID,
            bookISBN: bookA.isbn
        }

        mockLoanB = {
            memberID: member.memberID,
            bookISBN: bookB.isbn
        }

        mockLoanC = {
            memberID: member.memberID,
            bookISBN: bookC.isbn
        }

        deleteMockLoan = {
            memberID: member.memberID,
            bookISBN: bookB.isbn
        }

        returnMockLoan = {
            memberID: member.memberID,
            bookISBN: bookA.isbn
        }

        await request(app)
            .post('/loans/create')
            .set('Authorization', `${token}`)
            .send(mockLoanA)
            .expect(201)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });


        await request(app)
            .post('/loans/create')
            .set('Authorization', `${token}`)
            .send(mockLoanB)
            .expect(201)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });


        await request(app)
            .post('/loans/create')
            .set('Authorization', `${token}`)
            .send(returnMockLoan)
            .expect(201)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
                loan = { memberID: res.body.data.memberID, bookISBN: res.body.data.isbn, loanID: res.body.data.loanID };
            });


        await request(app)
            .post('/loans/create')
            .set('Authorization', `${token}`)
            .send(deleteMockLoan)
            .expect(201)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });
    });


    it('should create a new Loan', async () => {
        const response = await request(app)
            .post('/loans/create')
            .set('Authorization', `${token}`)
            .send(mockLoanA)
            .expect(201)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });
        console.log(response.body);
    });


    it('should return a 400 if the memberID is not provided', async () => {
        mockLoan.memberID = "";

        const response = await request(app)
            .post('/loans/create')
            .set('Authorization', `${token}`)
            .send(mockLoan)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('Member ID and Book ISBN are required');
            });
        console.log(response.body);
    });

    it('should return a 400 if the bookISBN is not provided', async () => {
        mockLoan.bookISBN = "";

        const response = await request(app)
            .post('/loans/create')
            .set('Authorization', `${token}`)
            .send(mockLoan)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toEqual('Member ID and Book ISBN are required');
            });
        console.log(response.body);
    });

    it('should get all loans', async () => {
        await request(app)
            .post('/loans/create')
            .set('Authorization', `${token}`)
            .send(mockLoanA)
            .expect(201)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });

        const response = await request(app)
            .get('/loans/')
            .set('Authorization', `${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toEqual(expect.any(Array));
            });
        console.log(response.body);
    });

    it('should return 404 if no loans are found', async () => {
        await request(app)
            .delete(`/loans/`)
            .set('Authorization', `${token}`)
            .send(mockLoanA)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });

        await request(app)
            .delete(`/loans/`)
            .set('Authorization', `${token}`)
            .send(mockLoanB)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });


        const response = await request(app)
            .get('/loans/')
            .set('Authorization', `${token}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('No Loans found');
            });
        console.log(response.body);
    });

    it('should return Get all loans by a single member', async () => {
        const response = await request(app)
            .get(`/loans/member/${member.memberID}`)
            .set('Authorization', `${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toEqual(expect.any(Array));
            });
        console.log(response.body);
    });

    it('should return 404 if no loans are found for a member', async () => {
        await request(app)
            .delete(`/loans/`)
            .set('Authorization', `${token}`)
            .send(mockLoanA)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });

        await request(app)
            .delete(`/loans/`)
            .set('Authorization', `${token}`)
            .send(mockLoanB)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });

        const response = await request(app)
            .get(`/loans/member/${member.memberID}`)
            .set('Authorization', `${token}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toEqual('No Loans found');
            });
        console.log(response.body);
    });

    it('should return 200 on successfull return', async () => {
        const response = await request(app)
            .put(`/loans/return/`)
            .set('Authorization', `${token}`)
            .send(loan)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });
        console.log(response.body);
    });

    it('should return 200 on successfull delete', async () => {
        const response = await request(app)
            .delete(`/loans/`)
            .set('Authorization', `${token}`)
            .send(loan)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toEqual(true);
            });
        console.log(response.body);
    });

    afterAll(async () => {
        await sequelize.close();
    });


});