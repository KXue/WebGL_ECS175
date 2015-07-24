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

function ready(){
  var firstMatrix = [1,3,5,7,
  9,11,13,15,
  17,19,21,23,
  25,27,29,31];
  var secondMatrix = [0,2,4,6,
  8,10,12,14,
  16,18,20,22,
  24,26,28,30];
  console.log(mat4Multiply(firstMatrix, secondMatrix));
}
