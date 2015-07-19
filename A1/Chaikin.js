function Chaikin(){
  this.Rotation = 0;
  this.Lines = [];
  this.Vertices = [];
  this.LinesArray = [];
  this.VerticesArray = [];
  this.Order = 1;
  this.Changed = false;

  this.AddPoint = function(x, y){
    this.Changed = true;
    this.Vertices.push(x);
    this.Vertices.push(y);
    if(this.Vertices.length >= 4){
        if(this.Lines.length <= 2){
          this.Lines.push(this.Vertices.length / 2.0 - 2);
          this.Lines.push(this.Vertices.length / 2.0 - 1);
        }
        else{
          this.Lines[this.Lines.length - 2] = this.Vertices.length / 2.0 - 2;
          this.Lines[this.Lines.length - 1] = this.Vertices.length / 2.0 - 1;
        }

        this.Lines.push(this.Vertices.length / 2 - 1);
        this.Lines.push(0);
    }
  }

  this.Divide = function(){
    if(this.Lines.length >= 2){
      if(this.Changed || this.Order >= this.VerticesArray.length){
        var nextVertices = [];
        var nextLines = [];
        var newPoint = [];
        for (i = 0; i < this.Lines.length; i += 2){
          newPoint = FractionPoint([this.Vertices[this.Lines[i] * 2], this.Vertices[this.Lines[i] * 2 + 1]], [this.Vertices[this.Lines[i + 1] * 2], this.Vertices[this.Lines[i + 1] * 2 + 1]], 0.75);
          nextVertices.push(newPoint[0]);
          nextVertices.push(newPoint[1]);
          newPoint = FractionPoint([this.Vertices[this.Lines[i] * 2], this.Vertices[this.Lines[i] * 2 + 1]], [this.Vertices[this.Lines[i + 1] * 2], this.Vertices[this.Lines[i + 1] * 2 + 1]], 0.25);
          nextVertices.push(newPoint[0]);
          nextVertices.push(newPoint[1]);
        }
        for(i = 0; i < nextVertices.length / 2.0 - 1; i++){
          nextLines.push(i);
          nextLines.push(i+1);
        }
        nextLines.push(nextVertices.length / 2.0 - 1);
        nextLines.push(0);

        if(this.Order >= this.VerticesArray.length){
          this.VerticesArray.push(this.Vertices);
          this.LinesArray.push(this.Lines);
          this.Changed = false;
        }
        else{
          this.VerticesArray[this.Order - 1] = this.Vertices;
          this.LinesArray[this.Order - 1] = this.Lines;
          this.Changed = true;
        }
        this.Vertices = nextVertices;
        this.Lines = nextLines;
      }
      else{
        this.Vertices = this.VerticesArray[this.Order];
        this.Lines = this.LinesArray[this.Order];
      }
      this.Order ++;
    }
  }

  this.Back = function(){
    if(this.Order > 1){
      this.Order --;
      if(this.Order >= this.VerticesArray.length){
        this.VerticesArray.push(this.Vertices);
        this.LinesArray.push(this.Lines);
      }
      else if (this.Changed){
        this.VerticesArray[this.Order] = this.Vertices;
        this.LinesArray[this.Order] = this.Lines;
      }
      this.Vertices = this.VerticesArray[this.Order - 1];
      this.Lines = this.LinesArray[this.Order - 1];
      this.Changed = false;
    }
  }
}

function FractionPoint(firstPoint, secondPoint, fraction){
  x = fraction * firstPoint[0] + (1.0 - fraction) * secondPoint[0];
  y = fraction * firstPoint[1] + (1.0 - fraction) * secondPoint[1];
  return [x, y];
}
