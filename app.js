require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authorRouter = require('./routes/author');
const bookRouter = require('./routes/book');
const loanRouter = require('./routes/loan');
const memberRouter = require('./routes/member');
const userRouter = require('./routes/user');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/authors', authorRouter);
app.use('/books', bookRouter);
app.use('/loans', loanRouter);
app.use('/members', memberRouter);
app.use('/users', userRouter);


app.get('/', (req, res) => {
    res.send('API Online');
});


module.exports = app;