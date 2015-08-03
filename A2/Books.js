function BooksWithBookends(booksColour, bookEndColour, booksWidth, booksPaperColour, booksHeight, booksThickness,
  booksCoverThickness, booksCoverProtrusion){

}
function Book(bookColour, bookPaperColour, width, height, thickness, bookCoverThickness, bookCoverProtrusion){
  this.paper = new Mesh(bookPaperColour);
  this.spine = new Mesh(bookColour);
  this.frontCover = new Mesh(bookColour);
  this.backCover = new Mesh(bookColour);

  var heightToWidthRatio = height / width;
  var heightToThicknessRatio = height / thickness;
  var heightToRadius = height * Math.sqrt(2) / 2;

  this.paper.createPrism(thickness, heightToRadius, 4);
  this.paper.rotate(0, 45, 0);
  this.paper.rotate(0, 0, 90);
  this.paper.scale(1, 1, 1 / heightToWidthRatio);

  this.spine.createPrism(bookCoverThickness, heightToRadius, 4);
  this.spine.rotate(90, 45, 0);
  this.spine.scale(1 / heightToThicknessRatio, 1 + (bookCoverProtrusion / heightToRadius), 1);
  this.spine.translate(0, 0, (width + bookCoverThickness) / 2);

  this.frontCover.createPrism(bookCoverThickness, (heightToRadius + bookCoverProtrusion), 4);
  // really need to improve rotate code
  this.frontCover.rotate(0, 45, 0);
  this.frontCover.rotate(0, 0, 90);
  this.frontCover.scale(1, 1, 1 / heightToWidthRatio);
  this.frontCover.translate((thickness + bookCoverThickness) / 2 , 0, -bookCoverProtrusion / (2 * heightToWidthRatio));

  this.backCover.createPrism(bookCoverThickness, (heightToRadius + bookCoverProtrusion), 4);
  this.backCover.rotate(0, 45, 0);
  this.backCover.rotate(0, 0, 90);
  this.backCover.scale(1, 1, 1 / heightToWidthRatio);
  this.backCover.translate(- (thickness + bookCoverThickness) / 2 , 0, -bookCoverProtrusion / (2 * heightToWidthRatio));

  this.draw = function(WebGL){
    this.paper.draw(WebGL);
    this.spine.draw(WebGL);
    this.frontCover.draw(WebGL);
    this.backCover.draw(WebGL);
  };

  this.translate = function(x, y, z){
    this.paper.translate(x, y, z);
    this.spine.translate(x, y, z);
    this.frontCover.translate(x, y, z);
    this.backCover.translate(x, y, z);
  };
}
function BookEnd(colour, width, height, depth, thickness){
  this.feet = new Mesh(colour);
  this.stand = new Mesh(colour);

  var widthToHeightRatio = width / height;
  var widthToDepthRatio = width / depth;
  var widthToRadius = width * Math.sqrt(2) / 2;

  this.feet.createPrism(thickness, widthToRadius, 4);
  this.stand.createPrism(thickness, widthToRadius, 4);

  this.stand.rotate(0, 45, 0);
  this.stand.rotate(0, 0, 90);
  this.feet.rotate(0, 45, 0);

  this.stand.scale(1, 1 / widthToHeightRatio, 1);
  this.feet.scale(1 / widthToDepthRatio * (1 - thickness / depth), 1, 1);

  this.stand.translate((depth - thickness) / 2, 0, 0);
  this.feet.translate(- thickness / 2, - (height - thickness) / 2, 0);

  this.translate = function(x, y, z){
    this.stand.translate(x, y, z);
    this.feet.translate(x, y, z);
  };
  this.draw = function(WebGL){
    this.stand.draw(WebGL);
    this.feet.draw(WebGL);
  };
  this.rotate = function(x, y, z){
    this.stand.rotate(x, y, z);
    this.feet.rotate(x, y, z);
  };
}
