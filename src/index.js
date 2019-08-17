const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

let count = 1;

io.on('connection', (socket) => {
    const userID = `user#${count}`;
    socket.emit('newUser', userID)
    count++;

    socket.broadcast.emit('notify', `${userID} has joined the chat`, true);

    socket.on('send', (msg) => {
        io.emit('receive', msg);
    });

    socket.on('disconnect', () => {
        io.emit('notify', `${userID} has left the chat`, false)
    });
});

server.listen(port, () => {
    console.log('express server running');
});