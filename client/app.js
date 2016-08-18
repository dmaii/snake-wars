var imageObj = new Image(100, 100);
imageObj.src = 'orange.png'

var drawState = function (state) {
  requestAnimationFrame(function () {
    // draw the game state onto the canvas
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')

    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (var y = 0; y < state.board.length; y++) {
      var row = state.board[y]

      for (var x = 0; x < row.length; x++) {
        var centerX = x * 10 + 5
        var centerY = y * 10 + 5

        if (row[x]) {
          if (row[x].pieceType === 'snake' && row[x].) {
            ctx.beginPath()
            ctx.rect(centerX - 5, centerY - 5, 10, 10)
            ctx.fillStyle = row[x].color
            ctx.fill()
          } else if (row[x].pieceType === 'powerup') {
            ctx.beginPath()
            ctx.arc(centerX, centerY, 5, 0, 360, false)
            ctx.fillStyle = 'orange'
            ctx.fill()
          }
        } else {
          ctx.beginPath()
          ctx.rect(centerX - 5, centerY - 5, 10, 10)
          ctx.fillStyle ='black';
          ctx.fill()
        }
      }
    }
  })
}

var socket = io.connect('http://localhost:8080')

console.log('foo');
$(document).keydown(function (e) {
  console.log('keypress')
  e.preventDefault()
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
  console.log('you lost')
})

socket.on('newState', drawState)
