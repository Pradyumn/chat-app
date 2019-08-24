const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate data provided   
    if(!username || !room) {
        return { error: 'username and room required' };
    }

    // Check if username already exists
    const userExists = users.find((user) => user.room === room && user.username === username);
    if(userExists) {
        return { error: 'username already in use' };
    }

    // Add user to the users list
    const user = { id, username, room };
    users.push(user);

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// find user by id
const getUser = (id) => users.find((user => user.id === id));

// get users inside a room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};