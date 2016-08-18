var express = require('express')
var app = express()
var socketIo = require('socket.io')

app.use(express.static('client'))
app.engine('.html', require('ejs').renderFile)

var server = require('http').Server(app)
var io = require('socket.io')(server)

var Game = require('./server/game')

var game = new Game()

/**
1. Create index.html
**/
app.get('/', function (req, res) {
  res.render('index.html')
})

server.listen(8080, function () {
  console.log('app listening on port 8080')
})

var socketMap = {}
io.on('connection', function (socket) {
  game.addPlayer(socket.id)

  socketMap[socket.id] = socket
  // Changes snake direction for a player
  socket.on('direction', function (data) {
    console.log('direction changed');
    console.log(data)
    game.setDirection(socket.id, data.direction)
  })

  socket.on('disconnect', function () {
    delete socket[socket.id]

    if (game.players[socket.id]) {
      game.clearSnake(game.players[socket.id])
    }
  })
});

setInterval(function () {
  game = game.getNextState()

  for (var i = 0; i < game.died.length; i++) {
    socketMap[game.died[i].name].emit('lose')
  }

  io.sockets.emit('newState', game)
}, 100)
