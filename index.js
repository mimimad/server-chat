const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { PORT = 8000 } = process.env;













server.listen(PORT, () => console.log(`Express listened on port ${PORT}`));