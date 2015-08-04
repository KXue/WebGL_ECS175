const identityMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];
//First matrix transformation is applied first
function mat4Multiply(firstMatrix, secondMatrix){
  var resultMatrix = [];
  for(i = 0; i < 4; i++){
    for(j = 0; j < 4; j ++){
      var value = 0;
      for(k = 0; k < 4; k++){
        value += firstMatrix[i * 4 + k] * secondMatrix[k * 4 + j];
      }
      resultMatrix[i * 4 + j] = value;
    }
  }
  return resultMatrix;
}
function normalize(vector){
  var length = 0;
  for(i = 0; i < vector.length; i++){
    length += vector[i] * vector[i];
  }
  length = Math.sqrt(length);
  if(length === 0){
    return vector;
  }
  var newVector = [];
  for(i = 0; i < vector.length; i++){
    newVector[i] = vector[i] / length;
  }
  return newVector;
}
function createTranslateMatrix(x, y, z){
  return([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]);
}
function createScaleMatrix(x, y, z){
  return([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ]);
}

//convention: applied x -> y -> z == (Z * Y) * X
function createRotateMatrix(x, y, z){
  xTheta = x * Math.PI / 180.0;
  yTheta = y * Math.PI / 180.0;
  zTheta = z * Math.PI / 180.0;

  var xRotationMatrix = [
    1, 0, 0, 0,
    0, Math.cos(xTheta), Math.sin(xTheta), 0,
    0, -Math.sin(xTheta), Math.cos(xTheta), 0,
    0, 0, 0, 1
  ];
  var yRotationMatrix = [
    Math.cos(yTheta), 0, -Math.sin(yTheta), 0,
    0, 1, 0, 0,
    Math.sin(yTheta), 0, Math.cos(yTheta), 0,
    0, 0, 0, 1
  ];
  var zRotationMatrix = [
    Math.cos(zTheta), Math.sin(zTheta), 0, 0,
    -Math.sin(zTheta), Math.cos(zTheta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  return mat4Multiply(mat4Multiply(zRotationMatrix, yRotationMatrix), xRotationMatrix);
}
//for more control on the order of operations
function createXRotationMatrix(theta){
  var radians = theta * Math.PI / 180.0;
  return [
    1, 0, 0, 0,
    0, Math.cos(radians), Math.sin(radians), 0,
    0, -Math.sin(radians), Math.cos(radians), 0,
    0, 0, 0, 1
  ];
}

function createYRotationMatrix(theta){
  var radians = theta * Math.PI / 180.0;
  return [
    Math.cos(radians), 0, -Math.sin(radians), 0,
    0, 1, 0, 0,
    Math.sin(radians), 0, Math.cos(radians), 0,
    0, 0, 0, 1
  ];
}
function createZRotationMatrix(theta){
  var radians = theta * Math.PI / 180.0;
  return [
    Math.cos(radians), Math.sin(radians), 0, 0,
    -Math.sin(radians), Math.cos(radians), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
}
//Convention: 2 element array: first element: (T, R, S)+(X, Y, Z) for translate, rotate, scale along X, Y, Z.
//Second element: Number value for amount
//pass in stack of transforms and the matrix to be transformed
function createTransformMatrix(transformStack){
  var resultTransformMatrix = identityMatrix;
  var transformMatrix;
  for(i = 0 ; i < transformStack.length; i++){
    if(transformStack[i][0] == 'R'){
      transformMatrix = createRotateMatrix(transformStack[i][1]);
    }
    else if(transformStack[i][0] == 'S'){
      transformMatrix = createScaleMatrix(transformStack[i][1]);
    }
    else{
      transformMatrix = createTranslateMatrix(transformStack[i][1]);
    }
    resultTransformMatrix = mat4Multiply(transformMatrix, resultTransformMatrix);
  }
}

var canvasWidth;
var canvasHeight;
var table;
var lamp;
var booksWithBookEnds;
var pencil;
var paper;
function ready(){
  table = new Table(4.0, 1.0, 4.0, 0.1, 0.5, 0.1, [0x67 / 255, 0x0A / 255, 0x0A / 255, 1.0]);
  lamp = new Lamp(1.0, 0.5, 0.2, 0.5, 0.1,
    0.3, 0.1, [0.2, 0.2, 0.2, 1.0], [0.5, 0.5, 0.5, 1.0], [0.9, 0.9, 0.9, 1.0], 16, 16, 4);
  booksWithBookEnds = new BooksWithBookEnds([[0, 0.5, 0.5, 1], [0.3, 0.4, 0.5, 1], [0.5, 0.4, 0.3, 1], [0.6, 0.2, 0.6, 1]],
    [[0.9, 0.9, 0.7, 1], [0.7, 0.7, 0.3, 1], [0.6, 0.6, 0.5, 1], [0.8, 0.7, 0.6, 1]], [0.3, 0.3, 0.3, 1.0], [0.7, 0.6, 0.9, 0.5],
     [0.8, 1.0, 0.7, 1.0], [0.4, 0.3, 0.2, 0.5], [0.03, 0.05, 0.02, 0.04], [0.02, 0.03, 0.04, 0.05], 0.5, 0.7, 0.3, 0.03);
  pencil = new Pencil(1.5, 0.05, 0.2, 0.3, 0.2, 0.3, 0.06, 0.055,
    [220 / 255, 140 / 255, 36 / 255, 1], [242 / 255, 211 / 255, 166 / 255, 1],
    [92 / 255, 98 / 255, 116 / 255, 1], [192 / 255, 192 / 255, 192 / 255, 1], [244 / 255, 155 / 255, 149 / 255, 1]);
  paper = new Paper(0.85, 1.1, 10, 0.01, 0.2, [0.9, 0.9, 0.7, 1], [92 / 255, 98 / 255, 116 / 255, 1]);
  paper.translate(0, 0.5001, -5);
  table.translate(0, 0, -6);
  lamp.translate(1.0, (lamp.height / 2) + 0.5, -7);
  booksWithBookEnds.translate(-0.7, booksWithBookEnds.bottom + 0.5, -7);
  pencil.translate(0, 0.56, -6);
  var canvas = document.getElementById("GLCanvas");
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  GL = new WebGL("GLCanvas", "FragmentShader", "VertexShader");
  GL.makePerspective();
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("keyup", onKeyUp, true);
  canvas.addEventListener("mousewheel", onMouseWheel, false);
  canvas.addEventListener("DOMMouseScroll", onMouseWheel, false);
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  setInterval(update, 33);
}

function update(){
  GL.GL.clear(16384 | 256);
  GL.updatePosition();
  GL.moveDirection[2] = 0;
  table.draw(GL);
  booksWithBookEnds.draw(GL);
  lamp.draw(GL);
  paper.draw(GL);
  pencil.draw(GL);
}

var map = []; // Or you could call it "key"
onKeyUp = onKeyDown = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /*insert conditional here*/
    if(map[37] || map[39]){
      if(map[37] && map[39]){
        if(e.keyCode == 37 && e.type == 'keydown'){
          GL.moveDirection[0] = -1;
        }
        else if(e.keyCode == 39 && e.type == 'keydown'){
          GL.moveDirection[0] = 1;
        }
      }
      else if(map[37]){
        GL.moveDirection[0] = -1;
      }
      else if(map[39]){
        GL.moveDirection[0] = 1;
      }
    }
    else{
      GL.moveDirection[0] = 0;
    }

    if(map[38] || map[40]){
      if(map[38] && map[40]){
        if(e.keyCode == 38 && e.type == 'keydown'){
          GL.moveDirection[1] = 1;
        }
        else if(e.keyCode == 40 && e.type == 'keydown'){
          GL.moveDirection[1] = -1;
        }
      }
      else if(map[38]){
        GL.moveDirection[1] = 1;
      }
      else if(map[40]){
        GL.moveDirection[1] = -1;
      }
    }
    else{
      GL.moveDirection[1] = 0;
    }
};

function onMouseWheel(event){
  GL.moveDirection[2] = event.wheelDelta / Math.abs(event.wheelDelta);
}

var drag = false;
var mousePosition = [];
function onMouseDown(event){
  drag = true;
  mousePosition = [event.offsetX, event.offsetY];
}

function onMouseMove(event){
  if(drag){
    var mouseDelta = [
      (event.offsetY - mousePosition[1]) * 180 / canvasHeight,
      (event.offsetX - mousePosition[0]) * 180 / canvasWidth,
      0
    ];
    GL.rotate(mouseDelta[0], mouseDelta[1], mouseDelta[2]);
    mousePosition = [event.offsetX, event.offsetY];
  }
}

function onMouseUp(event){
  drag = false;
}

function onFOVChanged(){
  var value = document.getElementById("FOV-slider");
  GL.FOV = value.value;
  var valueLabel = value.nextSibling.nextSibling;
  valueLabel.innerHTML = value.value;
  GL.makePerspective();
}

function onNearChange(){
  var value = parseFloat(document.getElementById("near").value);
  if(!isNaN(value)){
    GL.near = value;
    GL.makePerspective();
  }
}

function onFarChange(){
  var value = parseFloat(document.getElementById("far").value);
  if(!isNaN(value)){
    GL.far = value;
    GL.makePerspective();
  }
}

function onWidthChange(){
  var value = parseFloat(document.getElementById("width").value);
  if(!isNaN(value)){
    canvasWidth = value;
    (document.getElementById("GLCanvas").width = value);
    GL.aspectRatio = canvasWidth / canvasHeight;
    GL.makePerspective();
  }
}

function onHeightChange(){
  var value = parseFloat(document.getElementById("height").value);
  if(!isNaN(value)){
    canvasHeight = value;
    (document.getElementById("GLCanvas").height = value);
    GL.aspectRatio = canvasWidth / canvasHeight;
    GL.makePerspective();
  }
}
