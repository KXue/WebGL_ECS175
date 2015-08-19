function BooksWithBookEnds(booksColour, booksPaperColour, bookEndColour, booksWidth, booksHeight, booksThickness,
  booksCoverThickness, booksCoverProtrusion, bookEndWidth, bookEndHeight, bookEndDepth, bookEndThickness){
  this.books = [];
  this.leftBookEnd = new BookEnd(bookEndColour, bookEndWidth, bookEndHeight, bookEndDepth, bookEndThickness);
  this.rightBookEnd = new BookEnd(bookEndColour, bookEndWidth, bookEndHeight, bookEndDepth, bookEndThickness);
  var book;
  this.bottom = bookEndHeight / 2;
  this.maxWidth = 0;
  for(l = 0; l < booksWidth.length; l++){
    book = new Book(booksColour[l], booksPaperColour[l], booksWidth[l], booksHeight[l],
      booksThickness[l], booksCoverThickness[l], booksCoverProtrusion[l]);
    book.translate(0, booksHeight[l] / 2 + booksCoverProtrusion[l] - this.bottom, 0);
    this.maxWidth += booksThickness[l] + 2 * booksCoverThickness[l];
    this.books.push(book);
  }
  this.leftBookEnd.translate(- (this.maxWidth + bookEndDepth) / 2, 0, 0);
  this.rightBookEnd.rotate(0, 180, 0);
  this.rightBookEnd.translate((this.maxWidth + bookEndDepth) / 2, 0, 0);
  var shifted = 0;
  for(l = 0; l < this.books.length; l++){
    this.books[l].translate(- (this.maxWidth - (booksThickness[l] + 2 * booksCoverThickness[l])) / 2 + shifted, 0, 0);
    shifted += booksThickness[l] + 2 * booksCoverThickness[l];
  }
  console.log(this.leftBookEnd);
  console.log(this.rightBookEnd);
  this.finalMesh = combineMeshes(this.leftBookEnd.feet, this.leftBookEnd.stand);
  this.finalMesh = combineMeshes(this.finalMesh, this.rightBookEnd.feet);
  this.finalMesh = combineMeshes(this.finalMesh, this.rightBookEnd.stand);
  for(l = 0; l < this.books.length; l++){
    this.finalMesh = combineMeshes(this.finalMesh, this.books[l].paper);
    this.finalMesh = combineMeshes(this.finalMesh, this.books[l].spine);
    this.finalMesh = combineMeshes(this.finalMesh, this.books[l].backCover);
    this.finalMesh = combineMeshes(this.finalMesh, this.books[l].frontCover);
  }

  this.translate = function(x, y, z){
    this.finalMesh.translate(x, y, z);
  };

  this.draw = function(WebGL){
    this.finalMesh.draw(WebGL);
  };
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
  this.spine.scale(1 / heightToThicknessRatio, 1 + (2 * bookCoverProtrusion / height), 1);
  this.spine.translate(0, 0, (width + bookCoverThickness) / 2);

  this.frontCover.createPrism(bookCoverThickness, heightToRadius, 4);
  // really need to improve rotate code
  this.frontCover.rotate(0, 45, 0);
  this.frontCover.rotate(0, 0, 90);
  this.frontCover.scale(1, 1 + 2 * bookCoverProtrusion / height , 1 / heightToWidthRatio * (1 + (2 * bookCoverProtrusion + bookCoverThickness) / width));
  this.frontCover.translate((thickness + bookCoverThickness) / 2 , 0, - bookCoverProtrusion + 0.5 * bookCoverThickness);

  this.backCover.createPrism(bookCoverThickness, heightToRadius, 4);
  this.backCover.rotate(0, 45, 0);
  this.backCover.rotate(0, 0, 90);
  this.backCover.scale(1, 1 + 2 * bookCoverProtrusion / height , 1 / heightToWidthRatio * (1 + (2 * bookCoverProtrusion + bookCoverThickness) / width));
  this.backCover.translate(- (thickness + bookCoverThickness) / 2 , 0, - bookCoverProtrusion + 0.5 * bookCoverThickness);

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
