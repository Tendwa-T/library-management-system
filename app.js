require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const app = express();

const authorRouter = require('./routes/author');
const bookRouter = require('./routes/book');
const loanRouter = require('./routes/loan');
const memberRouter = require('./routes/member');
const userRouter = require('./routes/user');
const logger = require('./logger');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/authors', authorRouter);
app.use('/books', bookRouter);
app.use('/loans', loanRouter);
app.use('/members', memberRouter);
app.use('/users', userRouter);

// Api to upload image to cloudinary
app.post('/api/image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file to upload' });
    }
    try {
        const datauri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(datauri, {
            folder: 'library',
            resource_type: 'auto',
            use_filename: true,
            overwrite: true,
        });
        return res.status(201).send({ url: result.secure_url });
    }
    catch (error) {
        logger.error(error.message);
        return res.status(500).send({ error: error.message });
    }
});
app.get('/', (req, res) => {
    res.send('API Online');
});


module.exports = app;