const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const { generateMessage, generateLocation } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
    socket.on('send', (msg, callback) => {
        io.emit('message', generateMessage(msg));
        callback();
    });

    socket.on('shareLocation', ({ latitude, longitude }) => {
        io.emit('location', generateLocation(latitude, longitude));
    });

    // socket.on('disconnect', () => {
    //     io.emit('notify', `${userID} has left the chat`, false)
    // });
});

server.listen(port, () => {
    console.log('express server running');
});