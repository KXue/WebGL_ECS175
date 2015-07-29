function Mesh(fileSource, colour) {
  this.currentTransform = [];
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
    WebGL.GL.vertexAttribPointer(WebGL.VertexPosition, 2, WebGL.GL.FLOAT, false, 0, 0);

    faceBuffer = WebGL.GL.createBuffer();
    WebGL.GL.bindBuffer(WebGL.GL.ELEMENT_ARRAY_BUFFER, faceBuffer);
    WebGL.GL.bufferData(WebGL.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces, WebGL.GL.STATIC_DRAW));

    WebGL.GL.uniform4fv(WebGL.GL.getUniformLocation(WebGL.ShaderProgram, "Color"), new Float32Array(this.colour));

    pMatrix = WebGL.GL.getUniformLocation(WebGL.ShaderProgram, "projectionMatrix");
    WebGL.GL.uniformMatrix4fv(pMatrix, false, new Float32Array(WebGL.perspectiveMatrix));

    mMatrix = WebGL.GL.getUniformLocation(WebGL.ShaderProgram, "modelMatrix");
    WebGL.GL.uniformMatrix4fv(mMatrix, false, new Float32Array(this.modelTransformMatrix));

    cMatrix = WebGL.GL.getUniformLocation(WebGL.ShaderProgram, "cameraTransformMatrix");
    WebGL.GL.uniformMatrix4fv(cMatrix, false, new Float32Array(WebGL.cameraTransformMatrix));
    //Draw The Lines
    WebGL.GL.drawElements(this.GL.TRIANGLES, this.faces.length, WebGL.GL.UNSIGNED_SHORT, 0);
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
}
