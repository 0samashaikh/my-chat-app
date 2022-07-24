let express = require('express');

let app = express();

let http = require('http');
let server = http.Server(app);
let io = require('socket.io')(server, { cors: { origin: "*" } });

const port = process.env.PORT || '3000';
server.listen(port, () => {
    console.log("hello")
});
let rooms = []

io.on('connection', socket => {

    socket.on('login', () => {
        console.log('login');
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

