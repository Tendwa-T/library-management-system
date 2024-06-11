require('dotenv').config();
const port = process.env.PORT || 5000;
const app = require('./app');

async function startServer() {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer();