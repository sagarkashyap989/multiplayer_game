const io = require('socket.io')();
const { initGame, gameLoop, getUpdatedVelocity } = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./utils');

const state = {};
const clientRooms = {};
const rooms = {};
io.on('connection', client => {

  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);
  client.on('send-chat-message', (room, message) => {
    console.log(room, 'room name')
    client.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[client.id] })
  })

  //new-listners--new-listners--new-listners--new-listners--new-listners--new-listners--new-listners--new-listners
  client.on('won-lost',(room, userId) => {

    console.log(rooms)
    console.log(room, userId, 'won-lost')
    client.to(room).broadcast.emit('someone-lost', { message: 'lost', name: rooms[room].users[client.id] , userId })
    delete rooms[room].users[client.id]
    client.leave(room)
    const roo1m = io.sockets.adapter.rooms[room];
    console.log(roo1m, 'roo1m')
    const numberOfUsers = roo1m ? roo1m.length : 0;
    if(numberOfUsers == 1){
      client.to(room).broadcast.emit('you-win')

    }
  })



  client.on('add-seq', (room, seq) => {
    // console.log( rooms[room])
    // console.log(room, seq)
    rooms[room].sequence.push(seq)

    console.log(rooms)
    client.to(room).broadcast.emit('seq-added',rooms[room].sequence )
  })
  client.on('del-seq', (room) => {
    // console.log( rooms[room])
    // console.log(room, seq)
    rooms[room].sequence = []

  })


  //new-listners--new-listners--new-listners--new-listners--new-listners--new-listners--new-listners--new-listners








  function handleJoinGame(room, name) {
    const roo1m = io.sockets.adapter.rooms[room];
    // console.log(roo1m)
    const numberOfUsers = roo1m ? roo1m.length : 0;
    console.log(room, '22')
    console.log(rooms[room], 'room-name 23')
    client.join(room)
    console.log(rooms)
    
    rooms[room].users[client.id] = name
    // console.log(rooms)
    // console.log(`Users in room ${roo1m}: ${numberOfUsers}`);
    console.log(rooms)
    
    client.emit('gameCode', room, numberOfUsers+1);
    client.to(room).broadcast.emit('user-connected', name, numberOfUsers, client.id, room)
  }

  function handleNewGame(playerName) {
    console.log('hit')
    let roomName = makeid(5);
    // if (rooms[roomName] != null) {
    //     return res.redirect('/')
    // }
    rooms[roomName] = { users: {}, sequence: [] }
    // Send message that new room was created
    console.log(rooms)
    

    const roo1m = io.sockets.adapter.rooms[roomName];
    // console.log(roo1m)
    const numberOfUsers = roo1m ? roo1m.length : 0;
    console.log(numberOfUsers, 'numberOFuser')
    client.emit('gameCode', roomName, numberOfUsers+1);

    // client.emit('userId', roomName);
    addNewUser(roomName, playerName, client)
  }

});


const addNewUser = (room, name, client) => {
  client.join(room)
  rooms[room].users[client.id] = name
  // console.log(rooms)
  // console.log(`Users in room ${roo1m}: ${numberOfUsers}`);
  client.to(room).broadcast.emit('user-connected', name)
}









io.listen(process.env.PORT || 3000);
