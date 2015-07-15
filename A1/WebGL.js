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
      console.log(Object);

      //Connect Buffer To Shader's attribute
      this.GL.vertexAttribPointer(this.VertexPosition, 2, this.GL.FLOAT, false, 0, 0);

      var LineBuffer = this.GL.createBuffer();
			this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, LineBuffer);
		  this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Object.Lines), this.GL.STATIC_DRAW);

      //Generate The Perspective Matrix
			var PerspectiveMatrix =
      [1, 0, 0, 0,
      0, -1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1];

      //Sets the Color of the curve
			this.GL.uniform4fv(this.GL.getUniformLocation(this.ShaderProgram, "Color"), new Float32Array(Color));

      //Set The Perspective and Transformation Matrices
			var pmatrix = this.GL.getUniformLocation(this.ShaderProgram, "PerspectiveMatrix");
			this.GL.uniformMatrix4fv(pmatrix, false, new Float32Array(PerspectiveMatrix));

      //Draw The Lines
			this.GL.drawElements(this.GL.LINES, Object.Lines.length, this.GL.UNSIGNED_SHORT, 0);

    };
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

function SierpinskiFillSquare(level, topLeft, length){
  var firstWidth = length/2.0;
  var up = [topLeft[0] + firstWidth, topLeft[1] + firstWidth / 2.0];
  var left = [topLeft[0] + firstWidth / 2.0, topLeft[1] + firstWidth];
  var down = [up[0], up[1] + firstWidth];
  var right = [left[0] + firstWidth, left[1]];
  return Sierpinski(level, up, down, left, right);
}

function Sierpinski(level, up, down, left, right){

  var diagonalDistance = right[0] - left[0];
  level--;

  var sierpinskiVertices = [];
  Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, up, diagonalDistance));
  Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, right, diagonalDistance));
  Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, down, diagonalDistance));
  Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, left, diagonalDistance));

  var sierpinskiLines = [];
  for(i = 0; i < sierpinskiVertices.length/2.0 - 1; i++){
    sierpinskiLines.push(i);
    sierpinskiLines.push(i+1);
  }
  sierpinskiLines.push(sierpinskiVertices.length/2.0 - 1);
  sierpinskiLines.push(0);

  var sierpinskiCurve =
  {
    Rotation: 0,
    Vertices: sierpinskiVertices,
    Lines: sierpinskiLines
  };

  return sierpinskiCurve;
}

function SierpinskiUp(level, up, diagonalDistance){
  var unitDistance = diagonalDistance/4.0;
  var bottomLeft = [up[0] - unitDistance, up[1]];
  var bottomRight = [up[0] + unitDistance, up[1]];
  var topLeft = [up[0] - (2.0 * unitDistance), up[1] - unitDistance];
  var topRight = [up[0] + (2.0 * unitDistance), up[1] - unitDistance];

  var sierpinskiVertices = [];
  if(level == 0){
    sierpinskiVertices = [
      topLeft[0], topLeft[1],
      bottomLeft[0], bottomLeft[1],
      bottomRight[0], bottomRight[1],
      topRight[0], topRight[1]
    ];
  }
  else{
    level--;
    var newDiagonalDistance = diagonalDistance/2.0;
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, topLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, bottomLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, bottomRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, topRight, newDiagonalDistance));
  }
  return sierpinskiVertices
}
function SierpinskiDown(level, down, diagonalDistance){
  var unitDistance = diagonalDistance/4.0;
  var bottomLeft = [down[0] - (2.0 * unitDistance), down[1] + unitDistance];
  var bottomRight = [down[0] + (2.0 * unitDistance), down[1] + unitDistance];
  var topLeft = [down[0] - unitDistance, down[1]];
  var topRight = [down[0] + unitDistance, down[1]];

  var sierpinskiVertices = [];
  if(level == 0){
    sierpinskiVertices = [
      bottomRight[0], bottomRight[1],
      topRight[0], topRight[1],
      topLeft[0], topLeft[1],
      bottomLeft[0], bottomLeft[1]
    ];
  }
  else{
    level--;
    var newDiagonalDistance = diagonalDistance/2.0;
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, bottomRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, topRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, topLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, bottomLeft, newDiagonalDistance));
  }
  return sierpinskiVertices;
}
function SierpinskiLeft(level, left, diagonalDistance){
  var unitDistance = diagonalDistance/4.0;
  var bottomLeft = [left[0] - unitDistance, left[1] + 2.0 * unitDistance];
  var bottomRight = [left[0], left[1] + unitDistance];
  var topLeft = [left[0] - unitDistance, left[1] - 2.0 * unitDistance];
  var topRight = [left[0], left[1] - unitDistance];

  var sierpinskiVertices = [];
  if(level == 0){
    sierpinskiVertices = [
      bottomLeft[0], bottomLeft[1],
      bottomRight[0], bottomRight[1],
      topRight[0], topRight[1],
      topLeft[0], topLeft[1]
    ];
  }
  else{
    level--;
    var newDiagonalDistance = diagonalDistance/2.0;
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, bottomLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, bottomRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, topRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiLeft(level, topLeft, newDiagonalDistance));
  }
  return sierpinskiVertices;
}
function SierpinskiRight(level, right, diagonalDistance){
  var unitDistance = diagonalDistance/4.0;
  var topLeft = [right[0], right[1] - unitDistance];
  var topRight = [right[0] + unitDistance, right[1] - 2.0 * unitDistance];
  var bottomLeft = [right[0], right[1] + unitDistance];
  var bottomRight = [right[0] + unitDistance, right[1] + 2.0 * unitDistance];

  var sierpinskiVertices = [];
  if(level == 0){
    sierpinskiVertices = [
      topRight[0], topRight[1],
      topLeft[0], topLeft[1],
      bottomLeft[0], bottomLeft[1],
      bottomRight[0], bottomRight[1]
    ];
  }
  else{
    level--;
    var newDiagonalDistance = diagonalDistance/2.0;
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, topRight, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiDown(level, topLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiUp(level, bottomLeft, newDiagonalDistance));
    Array.prototype.push.apply(sierpinskiVertices, SierpinskiRight(level, bottomRight, newDiagonalDistance));
  }
  return sierpinskiVertices;
}

function Conchoid(a, b, largestX, largestY){
  var vertexArray = [];
  var lineArray = [];
  var radians;
  var secValue;
  var radius;
  var start = true;
  var nextPoint;

  for(i = 0; i < 360; i++){
    radians = i * Math.PI / 180.0;
    secValue = 1 / Math.cos(radians);
    if(secValue != Infinity && Math.abs(secValue) < 1000000000000000){
      radius = b + a * secValue;
      nextPoint = PolarToCartesian(radius, radians, largestX, largestY)
      Array.prototype.push.apply(vertexArray, nextPoint);
      if(start){
        start = false;
        console.log("start");
      }
      else{
        lineArray.push(vertexArray.length / 2.0 - 2);
        lineArray.push(vertexArray.length / 2.0 - 1);
      }
    }
    else{
      start = true;
    }
  }
  lineArray.push(0);
  lineArray.push(vertexArray.length / 2.0 - 1);
  var conchoidCurve = {
    Rotation: 0,
    Vertices: vertexArray,
    Lines: lineArray
  };
  return conchoidCurve;
}

function PolarToCartesian(radius, theta, largestX, largestY){
  return([radius * Math.cos(theta) / (largestX * 0.5), radius * Math.sin(theta) / (largestY * 0.5)]);
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
};
