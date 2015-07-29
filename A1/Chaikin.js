function Chaikin(){
  this.Rotation = 0;
  this.Lines = [];
  this.Vertices = [];
  this.controlVertices = [];
  this.Levels = 1;
  this.Closed = true;

  this.toggleOpen = function(){
    this.Closed = !this.Closed;
    this.levelsDivide(this.controlVertices, this.Levels);
  }

  this.AddPoint = function(x, y){
    this.controlVertices.push(x);
    this.controlVertices.push(y);
    this.levelsDivide(this.controlVertices, this.Levels);
  }

  this.setLevel = function(level){
    this.Levels = level;
    this.levelsDivide(this.controlVertices, this.Levels);
  }

  this.levelsDivide = function(controlPoints, level){
    var length = controlPoints.length / 2.0;
    var maxValue = controlPoints.length;
    var newControlPoints = []
    if(!this.Closed){
      length --;
      newControlPoints.push(controlPoints[0]);
      newControlPoints.push(controlPoints[1]);
    }
    console.log(controlPoints);
    console.log(level);
    console.log(length);
    for(i = 0; i < length; i++){
      var firstPoint = [controlPoints[i * 2], controlPoints[i * 2 + 1]];
      var secondPoint = [controlPoints[((i + 1) * 2) % maxValue], controlPoints[((i + 1) * 2 + 1) % maxValue]];
      Array.prototype.push.apply(newControlPoints, FractionPoint(firstPoint, secondPoint, 0.75));
      Array.prototype.push.apply(newControlPoints, FractionPoint(firstPoint, secondPoint, 0.25));
    }
    if(!this.Closed){
      newControlPoints.push(controlPoints[controlPoints.length - 2]);
      newControlPoints.push(controlPoints[controlPoints.length - 1]);
    }
    console.log(newControlPoints)
    if(level == 1){
      this.Vertices = newControlPoints;
      this.Lines = [];
      for(i = 0; i < this.Vertices.length/2.0 - 1; i++){
        this.Lines.push(i);
        this.Lines.push(i+1);
      }
      if(this.Closed){
        this.Lines.push(this.Vertices.length/2.0 - 1);
        this.Lines.push(0);
      }
    }
    else{
      this.levelsDivide(newControlPoints, level - 1);
    }
  }
}

function FractionPoint(firstPoint, secondPoint, fraction){
  x = fraction * firstPoint[0] + (1.0 - fraction) * secondPoint[0];
  y = fraction * firstPoint[1] + (1.0 - fraction) * secondPoint[1];
  return [x, y];
}
