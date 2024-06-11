require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authorRouter = require('./routes/author');
const bookRouter = require('./routes/book');

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/author', authorRouter);
app.use('/book', bookRouter);

app.get('/', (req, res) => {
    res.send('API Online');
});


module.exports = app;