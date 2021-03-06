const socket = io();

// Elements
const $messageForm = document.querySelector('#msg-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormBtn = $messageForm.querySelector('button');
const $locationBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const notificationTemplate = document.querySelector('#notification-template').innerHTML;

// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', ({ username, text, createdAt}) => {
    const html = Mustache.render(messageTemplate, {
        username,
        message: text,
        createdAt: moment(createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('location', ({ username, url, createdAt }) => {
    const html = Mustache.render(locationTemplate, {
        username,
        url,
        createdAt: moment(createdAt).format('h:mm a')
    });

    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('notify', ({ text, createdAt }) => {
    const html = Mustache.render(notificationTemplate, {
        message: text,
        color: 'red',
        createdAt: moment(createdAt).format('h:mm a')
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

socket.emit('join', { username, room }, (error) => {
    if(error) {
        location.href = '/';
        alert(error);
    }
});