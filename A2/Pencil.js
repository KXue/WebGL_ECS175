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

  this.translate = function(x, y, z){
    this.pencil.translate(x, y, z);
    this.tip.translate(x, y, z);
    this.lead.translate(x, y, z);
    this.back.translate(x, y, z);
    this.eraser.translate(x, y, z);
  };

  this.draw = function(WebGL){
    this.pencil.draw(WebGL);
    this.tip.draw(WebGL);
    this.lead.draw(WebGL);
    this.back.draw(WebGL);
    this.eraser.draw(WebGL);
  };
}
