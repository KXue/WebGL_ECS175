function WebGL(canvasID, fragmentShaderID, vertexShaderID){
  var canvas = document.getElementById(canvasID);
  if(!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl")){
    alert("Your Browser Doesn't Support WebGL");
  }
  else{
    this.GL = (canvas.getContext("webgl")) ? canvas.getContext("webgl") : canvas.getContext("experimental-webgl");
    this.GL.clearColor(1.0, 1.0, 1.0, 1.0); // this is the color
		this.GL.enable(this.GL.DEPTH_TEST); //Enable Depth Testing
		this.GL.depthFunc(this.GL.LEQUAL); //Set Perspective View
    this.aspectRatio = canvas.width / canvas.height;
    this.perspectiveMatrix = identityMatrix;
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
			this.VertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "vertexPosition");
			this.GL.enableVertexAttribArray(this.VertexPosition);
    }
  }

  this.draw = function(modelDrawMethod){
    modelDrawMethod(this);
  };

  this.resetTransform = function(){
    this.cameraTransformMatrix = identityMatrix;
  };

  this.makePerspective = function(near, far, angle, ratio){
    var view = 1.0 / Math.tan(angle * Math.PI / 360.0);
    var a = (far + near) / (far - near);
    var b = 2 * near * far / (far - near);
    this.perspectiveMatrix = [
      view, 0, 0, 0,
      0, ratio * view, 0, 0,
      0, 0, a, -1,
      0, 0, b, 0
    ];
  };

  this.translate = function(x, y, z){
    this.cameraTransformMatrix = mat4Multiply(this.cameraTransformMatrix, createTranslateMatrix(-x, -y, -z));
  };

  this.rotate = function(x, y, z){
    this.cameraTransformMatrix = mat4Multiply(this.cameraTransformMatrix, createRotateMatrix(-x, -y, -z));
  };

  //forward = -z, up = +y, left = -x? not sure about left/right but pretty sure about y & z
  //4th number of directionVector = 0
  //directionVector is normalized
  this.directionalTranslate = function(magnitude, directionVector){
    var rotatedUnitVector = vec4Mat4Multiply(directionVector, this.cameraTransformMatrix);
    for(i = 0; i < 4; i++){
      directionVector[i] *= magnitude;
    }
    this.translate(directionVector[0], directionVector[1], directionVector[2]);
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
