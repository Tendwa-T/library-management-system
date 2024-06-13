require('dotenv').config();
const port = process.env.PORT || 5000;
const logger = require('./utils/logger');
const app = require('./app');

async function startServer() {
    app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
}

startServer();