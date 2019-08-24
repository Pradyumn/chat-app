const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const { generateMessage, 
        generateLocation, 
        generateNotification } = require('./utils/messages');
const { addUser, removeUser,
        getUser, getUsersInRoom} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
    socket.on('join', (credentials, callback) => {
        const { error, user } = addUser({ id: socket.id, ...credentials });

        if(error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.broadcast.to(user.room).emit('notify', generateNotification(user.username, true));
    });

    socket.on('send', (msg, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, msg));
        callback();
    });

    socket.on('shareLocation', ({ latitude, longitude }) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('location', generateLocation(user.username, latitude, longitude));
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            return io.to(user.room).emit('notify', generateNotification(user.username));
        }
    });
});

server.listen(port, () => {
    console.log('express server running');
});