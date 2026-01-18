require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const config = require('./src/config/config');

const { initSocketServer } = require('./src/sockets/socket.server');

const httpServer = http.createServer(app);


initSocketServer(httpServer);


httpServer.listen(config.PORT, () => {
    console.log(`AI Buddy service is running on port ${config.PORT}`);
})