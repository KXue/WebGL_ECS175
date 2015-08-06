//Garbage can found in image: https://popiwinters.files.wordpress.com/2011/02/cimg0047.jpg
function Garbage(sideLength, height, lipPosition, lipThickness, holeRadius, discRadius){
  this.topCementPart = new Mesh([125 / 255, 132 / 255, 113 / 255, 1]);
  this.bottomCementPart = new Mesh([125 / 255, 132 / 255, 113 / 255, 1]);
  this.diskPart = new Mesh([0, 168 / 255, 107 / 255, 1]);
  this.lipPart = new Mesh([0, 168 / 255, 107 / 255, 1]);


}

function createRectangularPrismWithCircularHole(mesh, sideLength, height, radius, divisions){
  var vertices = [];
  var faces = [];

  for(i = 0; i < divisions; i++){
    var radians = i * 2 / divisions * Math.PI;
    insidePoint = [holeRadius * Math.cos(radians), 0, holeRadius * Math.sin(radians), 1.0];

  }

  mesh.vertices = vertices;
  mesh.faces = faces;
}

function createDiscWithCircularHole(mesh, discRadius, holeRadius, divisions){
  var vertices = [];
  var faces = [];
  for(i = 0; i < divisions; i++){
    var radians = i * 2 / divisions * Math.PI;
    var insidePoint = [holeRadius * Math.cos(radians), 0, holeRadius * Math.sin(radians), 1.0];
    var outsidePoint = [discRadius * Math.cos(radians), 0, discRadius * Math.sin(radians), 1.0];

    Array.prototype.push.apply(vertices, insidePoint);
    Array.prototype.push.apply(vertices, outsidePoint);

    if(i >= 1){
      faces.push(2 * i + 1);
      faces.push(2 * i);
      faces.push(2 * i - 1);
      faces.push(2 * i);
      faces.push(2 * i - 2);
      faces.push(2 * i - 1);
    }
  }
  //Array.prototype.push.apply(faces, [1, 0, 2 * divisions, 0, 2 * divisions - 1, 2 * divisions]);

  mesh.vertices = vertices;
  mesh.faces = faces;
}
