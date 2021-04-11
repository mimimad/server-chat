const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {cors: {origin: "*"}});

// указываем порт
const { PORT = 8000 } = process.env;

// мидлвары
app.use(cors());
app.use(router);

// сокеты
io.on('connect', (socket) => {

    //подключение юзера
    socket.on('join', ({ name, room }) => {

        const { user } = addUser({ id: socket.id, name, room });

        socket.join(user.room);
// рассылка сообщений от admin
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`, time: new Date().toLocaleTimeString()});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`, time: new Date().toLocaleTimeString() });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    });
// отправка сообщения
    socket.on('sendMessage', (message) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message, time: new Date().toLocaleTimeString() });

    });
// отключение юзера
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`, time: new Date().toLocaleTimeString() });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});

// запуск сервера
server.listen(PORT, () => console.log(`Express listened on port ${PORT}`));