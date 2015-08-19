function WebGL(canvasID, fragmentShaderID, vertexShaderID){
  var canvas = document.getElementById(canvasID);
  if(!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl")){
    alert("Your Browser Doesn't Support WebGL");
  }
  else{
    this.GL = (canvas.getContext("webgl")) ? canvas.getContext("webgl") : canvas.getContext("experimental-webgl");
    this.GL.clearColor(1.0, 1.0, 1.0, 1.0); // this is the color
		this.GL.enable(this.GL.DEPTH_TEST); //Enable Depth Testing
		this.GL.depthFunc(this.GL.LESS); //Set Perspective View
    this.aspectRatio = canvas.width / canvas.height;
    this.FOV = 45;
    this.near = 1;
    this.far = 10000;
    this.perspectiveMatrix = identityMatrix;
    this.moveDirection = [0, 0, 0, 0];
    this.cameraTransformMatrix = identityMatrix;

    var fragmentShader = document.getElementById(fragmentShaderID);
		var vertexShader = document.getElementById(vertexShaderID);

		if(!fragmentShader || !vertexShader)
			alert("Error, Could Not Find Shaders");
		else
		{
      //Load and Compile Fragment Shader
			var Code = loadShader(fragmentShader);
			fragmentShader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
			this.GL.shaderSource(fragmentShader, Code);
			this.GL.compileShader(fragmentShader);

			//Load and Compile Vertex Shader
			Code = loadShader(vertexShader);
			vertexShader = this.GL.createShader(this.GL.VERTEX_SHADER);
			this.GL.shaderSource(vertexShader, Code);
			this.GL.compileShader(vertexShader);

      //Create The Shader Program
			this.ShaderProgram = this.GL.createProgram();
			this.GL.attachShader(this.ShaderProgram, fragmentShader);
			this.GL.attachShader(this.ShaderProgram, vertexShader);
			this.GL.linkProgram(this.ShaderProgram);
			this.GL.useProgram(this.ShaderProgram);

			//Link Vertex Position Attribute from Shader
      this.vertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "vertexPosition");
      this.vertexColour = this.GL.getAttribLocation(this.ShaderProgram, "vertexColour");
      this.GL.enableVertexAttribArray(this.vertexPosition);
      this.GL.enableVertexAttribArray(this.vertexColour);
    }
  }

  this.resetTransform = function(){
    this.cameraTransformMatrix = identityMatrix;
  };

  this.makePerspective = function(){
    var view = 1.0 / Math.tan(this.FOV * Math.PI / 360.0);
    var a = (this.far + this.near) / (this.near - this.far);
    var b = 2 * this.near * this.far / (this.near - this.far);
    this.perspectiveMatrix = [
      view * this.aspectRatio, 0, 0, 0,
      0, view, 0, 0,
      0, 0, a, -1,
      0, 0, b, 0
    ];
  };

  this.translate = function(x, y, z){
    this.cameraTransformMatrix = mat4Multiply(this.cameraTransformMatrix, createTranslateMatrix(-x, -y, z));
  };

  this.rotate = function(x, y, z){
    this.cameraTransformMatrix = mat4Multiply(this.cameraTransformMatrix, createRotateMatrix(x, y, z));
  };

  //forward = -z, up = +y, left = -x? not sure about left/right but pretty sure about y & z
  //4th number of directionVector = 0
  //directionVector is normalized
  this.directionalTranslate = function(magnitude, directionVector){
    var rotatedUnitVector = directionVector;
    rotatedUnitVector = normalize(rotatedUnitVector);
    for(i = 0; i < 4; i++){
      rotatedUnitVector[i] *= magnitude;
    }
    this.translate(rotatedUnitVector[0], rotatedUnitVector[1], rotatedUnitVector[2]);
  };

  this.updatePosition = function(){
    this.directionalTranslate(0.1, this.moveDirection);
  };
}

function loadShader(Script){
	var Code = "";
	var CurrentChild = Script.firstChild;
	while(CurrentChild)
	{
		if(CurrentChild.nodeType == CurrentChild.TEXT_NODE)
			Code += CurrentChild.textContent;
		CurrentChild = CurrentChild.nextSibling;
	}
	return Code;
}
