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
function vec4Mat4Multiply(vector, matrix){
  newVector = [0, 0, 0, 0];
  for(i = 0; i < 4; i++){
    for(j = 0; j < 4; j++){
      newVector[i] += vector[i] * matrix[i * 4 + j];
    }
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

function ready(){
  GL = new WebGL("GLCanvas", "FragmentShader", "VertexShader");
  GL.makePerspective(1, 10000, 45, 1);
  var cylinder = new Mesh([0.0, 0.0, 1.0, 1.0]);
  cylinder.createCylinder(1.0, 1.0, 10);
  cylinder.translate(0, 0, -6);
  cylinder.draw(GL);
}
