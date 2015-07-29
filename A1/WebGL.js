function WebGL(CID, FSID, VSID){
  var canvas = document.getElementById(CID);
  if(!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl")){
    alert("Your Browser Doesn't Support WebGL");
  }
  else{
    this.GL = (canvas.getContext("webgl")) ? canvas.getContext("webgl") : canvas.getContext("experimental-webgl");
    this.GL.clearColor(1.0, 1.0, 1.0, 1.0); // this is the color
		this.GL.enable(this.GL.DEPTH_TEST); //Enable Depth Testing
		this.GL.depthFunc(this.GL.LEQUAL); //Set Perspective View
		this.AspectRatio = canvas.width / canvas.height;
    this.defaultModelMatrix =[
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

		var FShader = document.getElementById(FSID);
		var VShader = document.getElementById(VSID);

		if(!FShader || !VShader)
			alert("Error, Could Not Find Shaders");
		else
		{
      //Load and Compile Fragment Shader
			var Code = LoadShader(FShader);
			FShader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
			this.GL.shaderSource(FShader, Code);
			this.GL.compileShader(FShader);

			//Load and Compile Vertex Shader
			Code = LoadShader(VShader);
			VShader = this.GL.createShader(this.GL.VERTEX_SHADER);
			this.GL.shaderSource(VShader, Code);
			this.GL.compileShader(VShader);

      //Create The Shader Program
			this.ShaderProgram = this.GL.createProgram();
			this.GL.attachShader(this.ShaderProgram, FShader);
			this.GL.attachShader(this.ShaderProgram, VShader);
			this.GL.linkProgram(this.ShaderProgram);
			this.GL.useProgram(this.ShaderProgram);

			//Link Vertex Position Attribute from Shader
			this.VertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "VertexPosition");
			this.GL.enableVertexAttribArray(this.VertexPosition);
    }
    this.Draw = function(Object, Color)
		{
      var VertexBuffer = this.GL.createBuffer(); //Create a New Buffer

			//Bind it as The Current Buffer
			this.GL.bindBuffer(this.GL.ARRAY_BUFFER, VertexBuffer);

			// Fill it With the Data
			this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Object.Vertices), this.GL.STATIC_DRAW);

      //Connect Buffer To Shader's attribute
      this.GL.vertexAttribPointer(this.VertexPosition, 2, this.GL.FLOAT, false, 0, 0);

      var LineBuffer = this.GL.createBuffer();
			this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, LineBuffer);
		  this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Object.Lines), this.GL.STATIC_DRAW);
      //TODO: Gotta clean this stuff up
      //Generate The Perspective Matrix
      var PerspectiveMatrix =[
        1, 0, 0, 0,
        0, -1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];

      //Sets the Color of the curve
			this.GL.uniform4fv(this.GL.getUniformLocation(this.ShaderProgram, "Color"), new Float32Array(Color));

      //Set The Perspective Matrix
			var pmatrix = this.GL.getUniformLocation(this.ShaderProgram, "PerspectiveMatrix");
			this.GL.uniformMatrix4fv(pmatrix, false, new Float32Array(PerspectiveMatrix));

      var modelMatrix;

      if(Object.modelMatrix){
        modelMatrix = Object.modelMatrix;
      }
      else{
        modelMatrix = this.defaultModelMatrix;
      }

      var mMatrix = this.GL.getUniformLocation(this.ShaderProgram, "ModelMatrix");
      this.GL.uniformMatrix4fv(mMatrix, false, new Float32Array(modelMatrix));

      //Draw The Lines
			this.GL.drawElements(this.GL.LINES, Object.Lines.length, this.GL.UNSIGNED_SHORT, 0);

    }
  }
}
function MakePerspective(FOV, AspectRatio, Closest, Farest){
	var YLimit = Closest * Math.tan(FOV * Math.PI / 360);
	var A = -( Farest + Closest ) / ( Farest - Closest );
	var B = -2 * Farest * Closest / ( Farest - Closest );
	var C = (2 * Closest) / ( (YLimit * AspectRatio) * 2 );
	var D =	(2 * Closest) / ( YLimit * 2 );
	return [
		C, 0, 0, 0,
		0, D, 0, 0,
		0, 0, A, -1,
		0, 0, B, 0
	];
}
function MakeTransform(Object){
	var y = Object.Rotation * (Math.PI / 180.0);
	var A = Math.cos(y);
	var B = -1 * Math.sin(y);
	var C = Math.sin(y);
	var D = Math.cos(y);
	//Object.Rotation += .3;
	return [
		A, 0, B, 0,
		0, 1, 0, 0,
		C, 0, D, 0,
		0, 0, -2, 1
	];
}

function LoadShader(Script){
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

var Square = {
  Rotation : 0,
	Vertices : [

    0.5,  0.0,
    0.0, -0.5,
    -0.5, 0.0,
    0.0, 0.5

  ],
  Lines: [
    0, 1,
    1, 2,
    2, 3,
    3, 0
  ],
}
