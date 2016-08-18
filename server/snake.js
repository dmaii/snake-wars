var SnakePiece = require('./pieces').snake
var randomColor = require('randomcolor')

var Snake = function (name) {
  this.name = name
  // starting length of snakes is 5
  var startingY = Math.floor(Math.random() * 10)
  if (Math.random() < 0.5) {
    startingY = startingY + 30
  }

  var startingX = Math.floor(Math.random() * 10)
  if (Math.random() < 0.5) {
    startingX = startingX + 30
  }

  this.color = randomColor({
    luminosity: 'light',
    hue: 'random'
  })

  this.body = [new SnakePiece(startingX, startingY, this.name, this.color, true)]
  this.head = this.body[0]

  // unless you're at the north border, go north
  if (this.body[0].y > 20) {
    this.direction = 'UP'
  } else {
    this.direction = 'DOWN'
  }

  this.spawning = true
}

Snake.prototype.grow = function () {
  this.body.push(new SnakePiece(this.nextTail.x, this.nextTail.y, this.name))
}

Snake.prototype.getLength = function () {
  return this.body.length
}

Snake.prototype.setDirection = function (direction) {
  if (this._isValidDirection(direction)) {
    this.direction = direction
  }
}

Snake.prototype.move = function () {
  // if the snake grows, the next tail should be
  // where the previous tail was before the snake
  // moved. If there's a collision, the snake who
  // runs into the new tail dies
  this.nextTail = this.body.pop()

  var currHead
  if (this.body.length === 0) {
    currHead = this.nextTail
  } else {
    currHead = this.body[0]
  }

  var nextHead
  if (this.direction === 'UP') {
    nextHead = new SnakePiece(currHead.x, currHead.y - 1, this.name, this.color)
  } else if (this.direction === 'RIGHT') {
    nextHead = new SnakePiece(currHead.x + 1, currHead.y, this.name, this.color)
  } else if (this.direction === 'DOWN') {
    nextHead = new SnakePiece(currHead.x, currHead.y + 1, this.name, this.color)
  } else if (this.direction === 'LEFT') {
    nextHead = new SnakePiece(currHead.x - 1, currHead.y, this.name, this.color)
  }

  this.body.unshift(nextHead)

  // the first piece in the body will always have
  // a name so we know that it's a head and which
  // snake it belongs to
  console.log(this.body)
  this.body[0].isHead = true
  this.head = this.body[0]
}

Snake.prototype._isValidDirection = function (direction) {
  if (this.body.length <= 1) {
    return true
  }

  if (direction === 'UP') {
    if (this.head.y + 1 === this.body[1].y) {
      return false
    }
  } else if (direction === 'RIGHT') {
    if (this.head.x + 1 === this.body[1].x) {
      return false
    }
  } else if (direction === 'LEFT') {
    if (this.head.x - 1 === this.body[1].x) {
      return false
    }
  } else if (this.direction === 'DOWN') {
    if (this.head.y - 1 === this.body[1].y) {
      return false
    }
  }

  return true
}

module.exports = Snake
