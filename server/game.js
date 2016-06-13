var Snake = require('./snake')

var Game = function () {
  this.players = {}
  this.board = []
  this.died = {}
  this.powerupCount = 0

  for (var i = 0; i < 40; i++) {
    this.board.push([])

    for (var ii = 0; ii < 40; ii++) {
      this.board[i].push({})
    }
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
  this.died[snake.name] = snake

  _that = this
  snake.body.forEach(function (v, i) {
    if (v.x > 0 && v.y > 0 && v.x < 40 && v.y < 40) {
      var snake = _that.board[v.y][v.x].snake
      if (snake) {
        if (snake.name)
        delete _that.board[v.y][v.x].snake
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

Game.prototype.clearBoard = function () {
  for (var i = 0; i < 40; i++) {
    for (var ii = 0; ii < 40; ii++) {
      this.board[i][ii].snake = null
    }
  }
}

Game.prototype.getNextState = function () {
  this.died = {}
  this.clearBoard()
  for (var name in this.players) {
    var snake = this.players[name]
    snake.move()

    for (var i = 0; i < snake.body.length; i++) {
      var bodyPiece = snake.body[i]

      if (!this._checkBoundaries(bodyPiece)) {
        break
      }

      var boardPosition = this.board[bodyPiece.y][bodyPiece.x]

      // enemy snake detected
      if (boardPosition.snake) {
        var enemySnake = boardPosition.snake

        // we're placing a head
        if (i === 0) {
          // if the head of the current player ran into
          // another player, then he's dead
          this.clearSnake(snake)

          // if the thing he ran into was another head, that
          // player is also dead
          if (boardPosition.name && enemySnake.name !== snake.name) {
            this.clearSnake(enemySnake)
          }

          break
        } else {
          // it's a head (as expected)
          if (boardPosition.snake.name) {
            this.clearSnake(enemySnake)
          } else {
            throw new Error('Collision between two non-head' +
                            'body pieces at '  + enemySnake.x + ',' + enemySnake.y)
          }
        }
      } else {
        boardPosition.snake = bodyPiece
      }

      if (boardPosition.powerup && bodyPiece.isHead) {
        snake.add()
        boardPosition.powerup = false
        this.powerupCount--
      }

    }

    if (this.powerupCount === 0) {
      var powerupX = Math.floor(Math.random() * 40)
      var powerupY = Math.floor(Math.random() * 40)

      this.board[powerupY][powerupY].powerup = true
      this.powerupCount++
    }
  }

  return this
}

module.exports = Game
