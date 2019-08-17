const socket = io();

let userID;

socket.on('newUser', (user) => {
    userID = user;
    document.querySelector('#user').textContent = userID;
});

document.querySelector('#msg-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = e.target.elements.message.value;
    e.target.elements.message.value = '';
    const msg = `<b>${userID}:</b> ${text}`;
    socket.emit('send', msg);
});

socket.on('notify', (msg, active) => {
    const chat = document.querySelector('#conversation');
    const message = document.createElement('p');
    message.innerHTML = `[${msg}]`;
    message.style.color = active ? 'green' : 'red';
    chat.appendChild(message);
})

socket.on('receive', (msg) => {
    const chat = document.querySelector('#conversation');
    const message = document.createElement('p');
    message.innerHTML = msg;
    chat.appendChild(message);
});