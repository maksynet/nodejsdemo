const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const db = require('./app_server/models/db');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/app_server/views'));

// PUBLIC
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'sagdshwrytwrqwfgxvcxxzturfgh',
    resave: true,
    saveUninitialized: true
}));


// ROUTES
var routeIndex = require('./app_server/routes/indexRouter');
app.use('/', routeIndex);


// SOCKET
var io = require('socket.io').listen(app.listen(3000));
io.sockets.on('connection', function (socket) {

    socket.on('chat', function (chatData) {
      socket.username  = chatData.kadi;
  		socket.room = chatData.token;
      socket.join(socket.room);
      io.emit('otherMessage', chatData);
      io.sockets.in(socket.room).emit('getChatInfo', chatData);
    });

    socket.on('youtubeMovieGets', function(thatlink, wholink) {
      io.sockets.in(socket.room).emit('youtubeMovieLets', thatlink, wholink);
    })

    socket.on('setSeen', function(getSeenid, kothS) {
      io.sockets.in(socket.room).emit('letSeen',getSeenid, kothS);
    })

    socket.on('changeroom', function(newroom){
  		socket.join(newroom);
  		socket.room = newroom;
  	});

    socket.on('disconnect', function(){
      io.sockets.in(socket.room).emit('leaveRoom', socket.username);
      socket.leave(socket.room);
    });

});
