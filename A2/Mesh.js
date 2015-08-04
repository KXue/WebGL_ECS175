function Mesh(colour) {
  this.faces = [];
  this.vertices = [];
  this.colour = colour;
  this.modelTransformMatrix = identityMatrix;
  //transformations stored in the modelTransformMatrix. Any new transformations are matrix multiplied to modelTransformMatrix
  //modelTransformMatrix can be reset to identity matrix

  this.draw = function(WebGL){
    var VertexBuffer = WebGL.GL.createBuffer(),
    faceBuffer, //Create a New Buffer
    pMatrix,
    mMatrix,
    cMatrix; //Uniform locations of transform and projection matrices

    //Bind it as The Current Buffer
    WebGL.GL.bindBuffer(WebGL.GL.ARRAY_BUFFER, VertexBuffer);

    // Fill it With the Data
    WebGL.GL.bufferData(WebGL.GL.ARRAY_BUFFER, new Float32Array(this.vertices), WebGL.GL.STATIC_DRAW);

    //Connect Buffer To Shader's attribute
    WebGL.GL.vertexAttribPointer(WebGL.VertexPosition, 4, WebGL.GL.FLOAT, false, 0, 0);

    faceBuffer = WebGL.GL.createBuffer();
    WebGL.GL.bindBuffer(WebGL.GL.ELEMENT_ARRAY_BUFFER, faceBuffer);
    WebGL.GL.bufferData(WebGL.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), WebGL.GL.STATIC_DRAW);

    WebGL.GL.uniform4fv(WebGL.GL.getUniformLocation(WebGL.ShaderProgram, "color"), new Float32Array(this.colour));

    pMatrix = WebGL.GL.getUniformLocation(WebGL.ShaderProgram, "projectionMatrix");
    WebGL.GL.uniformMatrix4fv(pMatrix, false, new Float32Array(WebGL.perspectiveMatrix));

    mMatrix = WebGL.GL.getUniformLocation(WebGL.ShaderProgram, "modelMatrix");
    WebGL.GL.uniformMatrix4fv(mMatrix, false, new Float32Array(this.modelTransformMatrix));

    cMatrix = WebGL.GL.getUniformLocation(WebGL.ShaderProgram, "cameraTransformMatrix");
    WebGL.GL.uniformMatrix4fv(cMatrix, false, new Float32Array(WebGL.cameraTransformMatrix));
    //Draw The triangles
    WebGL.GL.drawElements(WebGL.GL.TRIANGLES, this.faces.length, WebGL.GL.UNSIGNED_SHORT, 0);
  };

  this.resetTransform = function(){
    this.modelTransformMatrix = identityMatrix;
  };

  this.translate = function(x, y, z){
    this.modelTransformMatrix = mat4Multiply(this.modelTransformMatrix, createTranslateMatrix(x, y, z));
  };

  this.scale = function(x, y, z){
    this.modelTransformMatrix = mat4Multiply(this.modelTransformMatrix, createScaleMatrix(x, y, z));
  };

  this.rotate = function(x, y, z){
    this.modelTransformMatrix = mat4Multiply(this.modelTransformMatrix, createRotateMatrix(x, y, z));
  };
  //Adding radii actually important here
  this.createTruncatedPyramid = function(height, topRadius, bottomRadius, sides){
    this.vertices = [];
    this.faces = [];
    var topCentre = [0.0, height / 2, 0.0, 1.0];
    var bottomCentre = [0.0, -height / 2, 0.0, 1.0];
    Array.prototype.push.apply(this.vertices, topCentre);
    Array.prototype.push.apply(this.vertices, bottomCentre);
    for(i = 0; i < sides; i++){
      var radians = i * 2 / sides * Math.PI;
      var newPoint = [topRadius * Math.cos(radians), height / 2, topRadius * Math.sin(radians), 1.0];
      Array.prototype.push.apply(this.vertices, newPoint);
      newPoint = [bottomRadius * Math.cos(radians), -height / 2, bottomRadius * Math.sin(radians), 1.0];
      Array.prototype.push.apply(this.vertices, newPoint);
      if(this.vertices.length > 16){
        var topFace = [0, i * 2 + 2, i * 2];
        var bottomFace = [1, i * 2 + 3, i * 2 + 1];
        var firstWallTriangle = [i * 2, i * 2 + 2, i * 2 + 3];
        var secondWallTriangle = [i * 2 + 3, i * 2 + 1, i * 2];
        Array.prototype.push.apply(this.faces, topFace);
        Array.prototype.push.apply(this.faces, bottomFace);
        Array.prototype.push.apply(this.faces, firstWallTriangle);
        Array.prototype.push.apply(this.faces, secondWallTriangle);
      }
    }
    var lastTop = [0, 2, (sides - 1) * 2 + 2];
    var lastBottom = [1, 3, (sides - 1)* 2 + 3];
    var secondLastWallTriangle = [2, (sides - 1) * 2 + 2, 3];
    var lastWallTriangle = [3, (sides - 1) * 2 + 3, (sides - 1) * 2 + 2];
    Array.prototype.push.apply(this.faces, lastTop);
    Array.prototype.push.apply(this.faces, lastBottom);
    Array.prototype.push.apply(this.faces, secondLastWallTriangle);
    Array.prototype.push.apply(this.faces, lastWallTriangle);
  };

  //adding radius and height not really necessary since I can just stretch, but good to have
  //Use division = 4 for rectangular prisms
  this.createPrism = function(height, radius, sides){
    this.vertices = [];
    this.faces = [];
    var topCentre = [0.0, height / 2, 0.0, 1.0];
    var bottomCentre = [0.0, -height / 2, 0.0, 1.0];
    Array.prototype.push.apply(this.vertices, topCentre);
    Array.prototype.push.apply(this.vertices, bottomCentre);
    for(i = 0; i < sides; i++){
      var radians = i * 2 / sides * Math.PI;
      var newPoint = [radius * Math.cos(radians), height / 2, radius * Math.sin(radians), 1.0];
      Array.prototype.push.apply(this.vertices, newPoint);
      newPoint = [radius * Math.cos(radians), -height / 2, radius * Math.sin(radians), 1.0];
      Array.prototype.push.apply(this.vertices, newPoint);
      if(this.vertices.length > 16){
        var topFace = [0, i * 2 + 2, i * 2];
        var bottomFace = [1, i * 2 + 3, i * 2 + 1];
        var firstWallTriangle = [i * 2, i * 2 + 2, i * 2 + 3];
        var secondWallTriangle = [i * 2 + 3, i * 2 + 1, i * 2];
        Array.prototype.push.apply(this.faces, topFace);
        Array.prototype.push.apply(this.faces, bottomFace);
        Array.prototype.push.apply(this.faces, firstWallTriangle);
        Array.prototype.push.apply(this.faces, secondWallTriangle);
      }
    }
    var lastTop = [0, 2, (sides - 1) * 2 + 2];
    var lastBottom = [1, 3, (sides - 1)* 2 + 3];
    var secondLastWallTriangle = [2, (sides - 1) * 2 + 2, 3];
    var lastWallTriangle = [3, (sides - 1) * 2 + 3, (sides - 1) * 2 + 2];
    Array.prototype.push.apply(this.faces, lastTop);
    Array.prototype.push.apply(this.faces, lastBottom);
    Array.prototype.push.apply(this.faces, secondLastWallTriangle);
    Array.prototype.push.apply(this.faces, lastWallTriangle);
  };
  this.createRectangle = function(width, height){
    this.vertices = [];
    this.faces = [];

    var topLeft = [-width / 2, 0, -height / 2, 1];
    var topRight = [width / 2, 0, -height / 2, 1];
    var bottomLeft = [-width / 2, 0, height / 2, 1];
    var bottomRight = [width / 2, 0, height / 2, 1];

    Array.prototype.push.apply(this.vertices, topLeft);
    Array.prototype.push.apply(this.vertices, topRight);
    Array.prototype.push.apply(this.vertices, bottomLeft);
    Array.prototype.push.apply(this.vertices, bottomRight);

    Array.prototype.push.apply(this.faces, [0, 1, 2, 1, 3, 2]);
  };
}
