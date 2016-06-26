var Snake = require('./snake')
var PowerUpPiece = require('./pieces').powerup

var Game = function () {
  this.players = {}
  this.board = []
  this.died = []
  this.powerups = {}

  for (var i = 0; i < 40; i++) {
    this.board.push([])
  }
}

Game.prototype.addPlayer = function (name) {
  var newSnake = new Snake(name)

  this.players[name] = newSnake
}

Game.prototype.setDirection = function (name, direction) {
  if (this.players[name]) {
    var player = this.players[name]
    player.setDirection(direction)
  } else {
    throw new Error('Could not find player ' + name)
  }
}

// clear a previously placed snake because it's just fuckin DEAD
Game.prototype.clearSnake = function (snake) {
  delete this.players[snake.name]
  this.died.push(snake)

  _that = this
  snake.body.forEach(function (v, i) {
    if (v.x > 0 && v.y > 0 && v.x < 40 && v.y < 40) {
      var snake = _that.board[v.y][v.x]
      if (snake) {
        if (snake.name)
        _that.board[v.y][v.x] = null
      }
    }
  })
}

Game.prototype._checkBoundaries = function (bodyPiece) {
  if (bodyPiece.x < 0 ||
      bodyPiece.x > 39 ||
      bodyPiece.y < 0 ||
      bodyPiece.y > 39) {

      this.clearSnake(this.players[bodyPiece.name])
      return false
  }

  return true
}

Game.prototype.clearSnakes = function () {
  for (var i = 0; i < 40; i++) {
    for (var ii = 0; ii < 40; ii++) {
      if (this.board[i][ii] && this.board[i][ii].pieceType === 'snake') {
        this.board[i][ii] = null
      }
    }
  }
}

Game.prototype.addPowerup = function () {
  console.log(this.powerups)
  if (Object.keys(this.powerups).length === 0) {
    var powerupX = Math.floor(Math.random() * 40)
    var powerupY = Math.floor(Math.random() * 40)

    var powerup = new PowerUpPiece(powerupX, powerupY)
    if (this.powerups[powerup.id]) {
      this.addPowerup()
    } else {
      this.powerups[powerup.id] = powerup
      this.board[powerupY][powerupX] = powerup
    }
  }
}

Game.prototype.getNextState = function () {
  this.died = []
  this.clearSnakes()

  this.addPowerup()
  for (var name in this.players) {
    var snake = this.players[name]
    snake.move()

    for (var i = 0; i < snake.body.length; i++) {
      var bodyPiece = snake.body[i]

      if (!this._checkBoundaries(bodyPiece)) {
        break
      }

      var boardPosition = this.board[bodyPiece.y][bodyPiece.x]

      if (boardPosition) {
        // enemy snake detected
        if (boardPosition.pieceType === 'snake') {
          // we're placing a head
          if (i === 0) {
            // if the head of the current player ran into
            // another player, then he's dead
            this.clearSnake(snake)

            // if the thing he ran into was another head, that
            // player is also dead
            if (boardPosition.name !== snake.name && boardPosition.isHead) {
              this.clearSnake(boardPosition)
            }

            break
          // we're placing a body
          } else {
            // body colliding with head
            if (boardPosition.isHead) {
              this.clearSnake(this.players[boardPosition.name])
            } else {
              throw new Error('Collision between two non-head' +
                              'body pieces at ' + boardPosition.x +
                                ',' + boardPosition.y)
            }
          }
        // found a powerup, eat it
        } else if (boardPosition.pieceType === 'powerup') {
          snake.grow()
          this.board[boardPosition.y][boardPosition.x] = bodyPiece
          delete this.powerups[boardPosition.x + 'x' + boardPosition.y + 'y']
        // empty space, just move
        }
      } else {
        this.board[bodyPiece.y][bodyPiece.x] = bodyPiece
      }
    }
  }

  return this
}

module.exports = Game
