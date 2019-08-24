const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (username, latitude, longitude) => {
    return {
        username,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime()
    }
}

const generateNotification = (username, active) => {
    if(active) {
        return {
            text:  `${username} joined the chat`,
            color: '#02db02'
        }
    }

    return {
        text: `${username} left the chat`,
        color: '#db021b'
    }
}

module.exports = {
    generateMessage,
    generateLocation,
    generateNotification
}