function Paper(width, length, lineNumber, lineThickness, topStart, paperColour, lineColour){
  this.rectangles = [];
  var nextPaper, nextLine, remainingLength;
  nextPaper = new Mesh(paperColour);
  remainingLength = length - (lineNumber * lineThickness);
  if(topStart === 0){
    topStart = remainingLength / (lineNumber + 1);
  }
  nextPaper.createRectangle(width, topStart);
  remainingLength -= topStart;
  nextPaper.translate(0, 0, -(length - topStart) / 2);
  this.rectangles.push(nextPaper);
  remainingLength /= lineNumber;

  for(l = 0; l < lineNumber; l++){
    nextLine = new Mesh(lineColour);
    nextLine.createRectangle(width, lineThickness);
    nextLine.translate(0, 0, -((length - lineThickness) / 2 - topStart - lineThickness * l - remainingLength * l));
    nextPaper = new Mesh(paperColour);
    nextPaper.createRectangle(width, remainingLength);
    nextPaper.translate(0, 0, -((length - remainingLength) / 2 - topStart - lineThickness * (l + 1) - remainingLength * l));
    this.rectangles.push(nextLine);
    this.rectangles.push(nextPaper);
  }

  this.translate = function(x, y, z){
    for(l = 0; l < this.rectangles.length; l++){
      this.rectangles[l].translate(x, y, z);
    }
  };

  this.draw = function(WebGL){
    for(l = 0; l < this.rectangles.length; l++){
      this.rectangles[l].draw(WebGL);
    }
  };
}
