function Table(width, height, depth, boardToLegRatio, legToCentreRatio, legRadius, colour){
  this.width = width;
  this.height = height;
  this.depth = depth;
  this.boardToLegRatio = boardToLegRatio;
  this.legToCentreRatio = legToCentreRatio;

  var widthDepthRatio = width/depth;
  var tableTopHeight = height * boardToLegRatio;
  this.tableTop = new Mesh(colour);
  //actually a rectangle, basically a cylinder with only 4 sides
  this.tableTop.createPrism(tableTopHeight, width * Math.sqrt(2) / 2, 4);
  this.tableTop.scale(1, 1, 1 / widthDepthRatio);
  this.tableTop.translate(0, (height - tableTopHeight)/2, 0);
  this.tableTop.rotate(0, 45, 0);

  var legHeight = height - tableTopHeight;

  this.leg1 = new Mesh(colour);
  this.leg1.createPrism(legHeight, legRadius, 16);
  this.leg1.translate(width * legToCentreRatio / 2, -tableTopHeight / 2, depth * legToCentreRatio / 2);

  this.leg2 = new Mesh(colour);
  this.leg2.createPrism(legHeight, legRadius, 16);
  this.leg2.translate(- (width * legToCentreRatio / 2), -tableTopHeight / 2, - (depth * legToCentreRatio / 2));

  this.leg3 = new Mesh(colour);
  this.leg3.createPrism(legHeight, legRadius, 16);
  this.leg3.translate(- (width * legToCentreRatio / 2), -tableTopHeight / 2, depth * legToCentreRatio / 2);

  this.leg4 = new Mesh(colour);
  this.leg4.createPrism(legHeight, legRadius, 16);
  this.leg4.translate(width * legToCentreRatio / 2, -tableTopHeight / 2, - (depth * legToCentreRatio / 2));

  this.finalMesh = combineMeshes(this.tableTop, this.leg1);
  this.finalMesh = combineMeshes(this.finalMesh, this.leg2);
  this.finalMesh = combineMeshes(this.finalMesh, this.leg3);
  this.finalMesh = combineMeshes(this.finalMesh, this.leg4);

  this.draw = function(WebGL){
    this.finalMesh.draw(WebGL);
  };

  this.translate = function(x, y, z){
    this.finalMesh.translate(x, y, z);
  };

}
