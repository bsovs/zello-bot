const PORT = process.env.PORT || 8080, isLocal = (PORT === 8080);
const express = require('express'), app = express(), http = require('http').Server(app),
    httpRouter = require('./express/httpRouter');
const io = require('socket.io')(http), socket = require('./socket.io/socket');
const discordBot = require('./discordBot');

global.URL = isLocal ? `http://localhost:${PORT}` : 'https://zellobot.herokuapp.com';
global.isLocal = isLocal;


//** Socket.io **//
socket.open(io);

//** Express Server **//
httpRouter.start(app);
http.listen(PORT, function () {
    console.info('\x1b[32m', 'Listening on:', PORT);
});

//** Discord Bot **//
discordBot.start();
