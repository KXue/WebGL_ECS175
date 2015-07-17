function Sierpinski(level, topLeft, length){
  this.Rotation = 0;
  this.Vertices = [];
  this.Lines = [];
  this.level = level;
  this.boundX = topLeft[0];
  this.boundY = topLeft[1];
  this.sideLength = length;

  var firstWidth = length/2.0;
  var up = [topLeft[0] + firstWidth, topLeft[1] + firstWidth / 2.0];
  var left = [topLeft[0] + firstWidth / 2.0, topLeft[1] + firstWidth];
  var down = [up[0], up[1] + firstWidth];
  var right = [left[0] + firstWidth, left[1]];

  var diagonalDistance = right[0] - left[0];
  level--;

  Array.prototype.push.apply(this.Vertices, SierpinskiUp(level, up, diagonalDistance));
  Array.prototype.push.apply(this.Vertices, SierpinskiRight(level, right, diagonalDistance));
  Array.prototype.push.apply(this.Vertices, SierpinskiDown(level, down, diagonalDistance));
  Array.prototype.push.apply(this.Vertices, SierpinskiLeft(level, left, diagonalDistance));

  for(i = 0; i < this.Vertices.length/2.0 - 1; i++){
    this.Lines.push(i);
    this.Lines.push(i+1);
  }
  this.Lines.push(this.Vertices.length/2.0 - 1);
  this.Lines.push(0);
}

function SierpinskiUp(level, up, diagonalDistance){
  var unitDistance = diagonalDistance/4.0;
  var bottomLeft = [up[0] - unitDistance, up[1]];
  var bottomRight = [up[0] + unitDistance, up[1]];
  var topLeft = [up[0] - (2.0 * unitDistance), up[1] - unitDistance];
  var topRight = [up[0] + (2.0 * unitDistance), up[1] - unitDistance];

  var sierpinskiVertices = [];
  if(level == 0){
    sierpinskiVertices = [
      topLeft[0], topLeft[1],
      bottomLeft[0], bottomLeft[1],
      bottomRight[0], bottomRight[1],
      topRight[0], topRight[1]
    ];
  }
  else{
    level--;
    var newDiagonalDistance = diagonalDistance/2.0;
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, topLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, bottomLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, bottomRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, topRight, newDiagonalDistance));
  }
  return sierpinskiVertices
}
function SierpinskiDown(level, down, diagonalDistance){
  var unitDistance = diagonalDistance/4.0;
  var bottomLeft = [down[0] - (2.0 * unitDistance), down[1] + unitDistance];
  var bottomRight = [down[0] + (2.0 * unitDistance), down[1] + unitDistance];
  var topLeft = [down[0] - unitDistance, down[1]];
  var topRight = [down[0] + unitDistance, down[1]];

  var sierpinskiVertices = [];
  if(level == 0){
    sierpinskiVertices = [
      bottomRight[0], bottomRight[1],
      topRight[0], topRight[1],
      topLeft[0], topLeft[1],
      bottomLeft[0], bottomLeft[1]
    ];
  }
  else{
    level--;
    var newDiagonalDistance = diagonalDistance/2.0;
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, bottomRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, topRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, topLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, bottomLeft, newDiagonalDistance));
  }
  return sierpinskiVertices;
}
function SierpinskiLeft(level, left, diagonalDistance){
  var unitDistance = diagonalDistance/4.0;
  var bottomLeft = [left[0] - unitDistance, left[1] + 2.0 * unitDistance];
  var bottomRight = [left[0], left[1] + unitDistance];
  var topLeft = [left[0] - unitDistance, left[1] - 2.0 * unitDistance];
  var topRight = [left[0], left[1] - unitDistance];

  var sierpinskiVertices = [];
  if(level == 0){
    sierpinskiVertices = [
      bottomLeft[0], bottomLeft[1],
      bottomRight[0], bottomRight[1],
      topRight[0], topRight[1],
      topLeft[0], topLeft[1]
    ];
  }
  else{
    level--;
    var newDiagonalDistance = diagonalDistance/2.0;
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, bottomLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, bottomRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, topRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, topLeft, newDiagonalDistance));
  }
  return sierpinskiVertices;
}
function SierpinskiRight(level, right, diagonalDistance){
  var unitDistance = diagonalDistance/4.0;
  var topLeft = [right[0], right[1] - unitDistance];
  var topRight = [right[0] + unitDistance, right[1] - 2.0 * unitDistance];
  var bottomLeft = [right[0], right[1] + unitDistance];
  var bottomRight = [right[0] + unitDistance, right[1] + 2.0 * unitDistance];

  var sierpinskiVertices = [];
  if(level == 0){
    sierpinskiVertices = [
      topRight[0], topRight[1],
      topLeft[0], topLeft[1],
      bottomLeft[0], bottomLeft[1],
      bottomRight[0], bottomRight[1]
    ];
  }
  else{
    level--;
    var newDiagonalDistance = diagonalDistance/2.0;
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, topRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, topLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, bottomLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, bottomRight, newDiagonalDistance));
  }
  return sierpinskiVertices;
}
