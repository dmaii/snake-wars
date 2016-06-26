var SnakePiece = function (x, y, name, color, isHead) {
  this.x = x
  this.y = y
  this.name = name
  this.color = color
  this.isHead = isHead ? true : false
  this.pieceType = 'snake'
}

var PowerUpPiece = function (x, y) {
  this.x = x
  this.y = y
  this.id = x + 'x' + y + 'y'
  this.pieceType = 'powerup'
}

exports.snake = SnakePiece
exports.powerup = PowerUpPiece
