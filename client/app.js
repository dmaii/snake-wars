var drawState = function (state) {
  // draw the game state onto the canvas
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (var y = 0; y < state.board.length; y++) {
    var row = state.board[y]

    for (var x = 0; x < row.length; x++) {
      var centerX = x * 10 + 5
      var centerY = y * 10 + 5

      if (row[x].snake) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, 5, 0, 360, false)
        ctx.fillStyle = 'green'
        ctx.fill()
      } else if (row[x].powerup) {
        console.log('powerup found')
        ctx.beginPath()
        ctx.arc(centerX, centerY, 5, 0, 360, false)
        ctx.fillStyle = 'yellow'
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.rect(centerX, centerY, 10, 10)
        ctx.fillStyle ='beige';
        ctx.fill()
      }
    }
  }
}

var socket = io.connect('http://localhost:8080')

$(document).keydown(function (e) {
  console.log('keypress')
  switch (e.keyCode) {
    //left
  case 37:
    socket.emit('direction', {direction: 'LEFT'})
    return
  case 38:
    socket.emit('direction', {direction: 'UP'})
    return
  case 39:
    socket.emit('direction', {direction: 'RIGHT'})
    return
  case 40:
    socket.emit('direction', {direction: 'DOWN'})
    return
  }
})

// get port
socket.on('lose', function () {
  alert('you lost')
})
socket.on('newState', drawState)
