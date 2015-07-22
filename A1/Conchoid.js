function Conchoid(a, b, largestX, largestY){
  this.Vertices = [];
  this.Lines = [];
  this.Rotation = 0;
  this.a = a;
  this.b = b;
  this.largestX = largestX;
  this.largestY = largestY;
  this.modelMatrix =
  [1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1];

  //This is a little unfair since the largestX and largestY only affect the level of zoom. However, conchoid is the only model that supports zoom so I cheated a bit
  var radians;
  var secValue;
  var radius;
  var start = true;
  var nextPoint;

  for(i = 0; i < 360; i++){
    radians = i * Math.PI / 180.0;
    secValue = 1 / Math.cos(radians);

    if(a != 0 && secValue != Infinity && Math.abs(secValue) < 1000000000000000){
      radius = b + a * secValue;
      nextPoint = PolarToCartesian(radius, radians, largestX, largestY)
      Array.prototype.push.apply(this.Vertices, nextPoint);

      if(start){
        start = false;
      }
      else{
        this.Lines.push(this.Vertices.length / 2.0 - 2);
        this.Lines.push(this.Vertices.length / 2.0 - 1);
      }
    }
    else if(a == 0){
      radius = b;
      nextPoint = PolarToCartesian(radius, radians, largestX, largestY)
      Array.prototype.push.apply(this.Vertices, nextPoint);

      if(start){
        start = false;
      }
      else{
        this.Lines.push(this.Vertices.length / 2.0 - 2);
        this.Lines.push(this.Vertices.length / 2.0 - 1);
      }
    }
    else{
      start = true;
    }
  }
  this.Lines.push(0);
  this.Lines.push(this.Vertices.length / 2.0 - 1);

  this.zoom = function(zoom){
    this.modelMatrix[0] = zoom;
    this.modelMatrix[5] = zoom;
  }
}

function PolarToCartesian(radius, theta, largestX, largestY){
  return([radius * Math.cos(theta) / largestX, radius * Math.sin(theta) / largestY]);
}
