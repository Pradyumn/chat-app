const socket = io();

let userID;

const $messageForm = document.querySelector('#msg-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormBtn = $messageForm.querySelector('button');
const $locationBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('newUser', (user) => {
    userID = user;
    document.querySelector('#user').textContent = userID;
});

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('location', (url) => {
    const html = Mustache.render(locationTemplate, {
        url
    });

    $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();    
    $messageFormBtn.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;
    e.target.elements.message.value = '';

    socket.emit('send', message, (error) => {
        $messageFormBtn.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error) {
            return console.log(error);
        }

        console.log('message sent');
    });
});

$locationBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(!navigator.geolocation) {
        return alert('Geolocation API not found');
    }

    navigator.geolocation.getCurrentPosition((position) => {
       socket.emit('shareLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
       });
    });    
});