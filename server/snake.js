var Snake = function (name) {
  this.name = name
  // starting length of snakes is 5
  var startingY = Math.floor(Math.random() * 40)
  var startingX = Math.floor(Math.random() * 40)

  this.body = [{
    x: startingX,
    y: startingY
  }]

  // unless you're at the north border, go north
  if (this.body[0].y > 0) {
    this.direction = 'UP'
  } else {
    this.direction = 'DOWN'
  }
}

Snake.prototype.add = function () {
  this.body.push(this.nextTail)
}

Snake.prototype.getLength = function () {
  return this.body.length
}

Snake.prototype.setDirection = function (direction) {
  this.direction = direction
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

  if (this.direction === 'UP') {
    this.body.unshift({
      y: currHead.y - 1,
      x: currHead.x,
      name: this.name
    })
  } else if (this.direction === 'RIGHT') {
    this.body.unshift({
      y: currHead.y,
      x: currHead.x + 1,
      name: this.name
    })
  } else if (this.direction === 'DOWN') {
    this.body.unshift({
      y: currHead.y + 1,
      x: currHead.x,
      name: this.name
    })
  } else if (this.direction === 'LEFT') {
    this.body.unshift({
      y: currHead.y,
      x: currHead.x - 1,
      name: this.name
    })
  }

  // the first piece in the body will always have
  // a name so we know that it's a head and which
  // snake it belongs to
  console.log(this.body)
  this.body[0].isHead = true
}

module.exports = Snake
