function Lamp(height, shadeToLampHeight, shadeTopRadius, shadeBottomRadius, baseToLampHeight,
  baseRadius, neckRadius, baseColour, neckColour, shadeColour, baseSides, neckSides, shadeSides){

  this.height = height;
  this.shade = new Mesh(shadeColour);
  this.neck = new Mesh(neckColour);
  this.base = new Mesh(baseColour);

  var shadeHeight = height * shadeToLampHeight;
  var baseHeight = height * baseToLampHeight;
  var neckHeight = height - shadeHeight - baseHeight;

  this.shade.createTruncatedPyramid(shadeHeight, shadeTopRadius, shadeBottomRadius, shadeSides);
  this.neck.createPrism(neckHeight, neckRadius, neckSides);
  this.base.createPrism(baseHeight, baseRadius, baseSides);

  this.shade.translate(0, (height - shadeHeight) / 2, 0);
  this.neck.translate(0, ((height - neckHeight) / 2) - shadeHeight, 0);
  this.base.translate(0, ((height - baseHeight) / 2) - shadeHeight - neckHeight, 0);

  this.finalMesh = combineMeshes(this.shade, this.neck);
  this.finalMesh = combineMeshes(this.finalMesh, this.base);

  this.draw = function(WebGL){
    this.finalMesh.draw(WebGL);
  };
  this.translate = function(x, y, z){
    this.finalMesh.translate(x, y, z);
  };
}
