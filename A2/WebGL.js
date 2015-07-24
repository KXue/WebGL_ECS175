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

    var fragmentShader = document.getElementById(fragmentShaderID);
		var vertexShader = document.getElementById(vertexShaderID);

		if(!fragmentShader || !vertexShader)
			alert("Error, Could Not Find Shaders");
		else
		{
      //Load and Compile Fragment Shader
			var Code = LoadShader(fragmentShader);
			fragmentShader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
			this.GL.shaderSource(fragmentShader, Code);
			this.GL.compileShader(fragmentShader);

			//Load and Compile Vertex Shader
			Code = LoadShader(vertexShader);
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
			this.VertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "VertexPosition");
			this.GL.enableVertexAttribArray(this.VertexPosition);
    }
  };

  this.Draw = function(modelDrawMethod){
    modelDrawMethod(this);
  };
}
