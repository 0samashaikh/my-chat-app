const express = require('express');
const path = require('path');

const app = express();
let http = require('http');


app.use(express.static(__dirname + '/dist/my-chat-app'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/my-chat-app/index.html'));
});

let server = http.Server(app);


let io = require('socket.io')(server, { cors: { origin: "*" } });


server.listen(process.env.PORT || 3000, () => {
    console.log('server started');
})

let rooms = []

io.on('connection', socket => {

    socket.on('disconnect', (data)=>{
        socket.leave(socket.room);
        socket.broadcast.to(socket.room).emit('left room', { user: socket.user, message: 'has left this room.' })
    })

    socket.on('login', () => {
        socket.join('login')
        io.in('login').emit('created rooms', { rooms: rooms })
    })

    socket.on('createRoom', data => {
        console.log("createRoom");
        rooms.push(data)
        io.in('login').emit('new room', { rooms: rooms })
    })


    socket.on('join', (data) => {
        socket.join(data.room);
        socket.user = data.user
        socket.room = data.room

        console.log(data.user + ' joined the room ' + data.room);

        socket.broadcast.to(data.room).emit('new user joined', { user: data.user, message: 'has joined this room.' })
    })

    socket.on('leave', (data) => {
        socket.leave(data.room);

        console.log(data.user + ' left the room ' + data.room);

        socket.broadcast.to(data.room).emit('left room', { user: data.user, message: 'has left this room.' })
    })

    socket.on('message', data => {
        io.in(data.room).emit('new message', { user: data.user, message: data.message })
    })
})