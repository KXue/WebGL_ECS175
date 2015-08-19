//Haven't figured out hexagonal pencil to round tip joining so will just make everything round...
function Pencil(length, radius, tipToLengthRatio, leadToTipRatio, backToLengthRatio, eraserToBackRatio, backRadius, eraserRadius,
  pencilColour, tipColour, leadColour, backColour, eraserColour){

  var tipLength = length * tipToLengthRatio;
  var leadLength = tipLength * leadToTipRatio;
  var backLength = length * backToLengthRatio;
  var eraserLength = backLength * eraserToBackRatio;
  var pencilLength = length - tipLength - backLength;

  this.lead = new Mesh(leadColour);
  this.tip = new Mesh(tipColour);
  this.pencil = new Mesh(pencilColour);
  this.back = new Mesh(backColour);
  this.eraser = new Mesh(eraserColour);

  this.pencil.createPrism(pencilLength, radius, 16);
  this.tip.createTruncatedPyramid(tipLength - leadLength, radius * leadToTipRatio, radius, 16);
  this.lead.createTruncatedPyramid(leadLength, 0, radius * leadToTipRatio, 16);
  this.back.createPrism(backLength - eraserLength, backRadius, 16);
  this.eraser.createPrism(eraserLength, eraserRadius, 16);

  this.pencil.rotate(0, 0, 90);
  this.tip.rotate(0, 0, 90);
  this.lead.rotate(0, 0, 90);
  this.back.rotate(0, 0, 90);
  this.eraser.rotate(0, 0, 90);

  this.tip.translate(-(pencilLength + tipLength - leadLength) / 2, 0, 0);
  this.lead.translate(-((pencilLength + leadLength) / 2 + tipLength - leadLength), 0, 0);
  this.back.translate((pencilLength + backLength - eraserLength) / 2, 0, 0);
  this.eraser.translate((pencilLength + eraserLength) / 2 + backLength - eraserLength, 0, 0);

  this.finalMesh = combineMeshes(this.tip, this.lead);
  this.finalMesh = combineMeshes(this.finalMesh, this.pencil);
  this.finalMesh = combineMeshes(this.finalMesh, this.back);
  this.finalMesh = combineMeshes(this.finalMesh, this.eraser);

  this.translate = function(x, y, z){
    this.finalMesh.translate(x, y, z);
  };

  this.draw = function(WebGL){
    this.finalMesh.draw(WebGL);
  };
}
