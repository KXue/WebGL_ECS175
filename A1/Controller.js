//USE OFFSETX & OFFSETY FOR MOUSE STUFF

var Color;
var CurrentObject;
var SierpinskiObject;
var ConchoidObject;
var ChaikinObject;
var CurrentZoom = 1;

function Ready(){
  GL = new WebGL("GLCanvas", "FragmentShader", "VertexShader");
  AddClickEvent("GLCanvas");
  Color = [0.0, 0.0, 0.0, 1.0];
  SierpinskiObject = new Sierpinski(1, [-1.0, -1.0], 2.0);
  ConchoidObject = new Conchoid(1.0, 2.0, 1.0, 1.0);
  CurrentObject = SierpinskiObject;
  Update();
}

function setZoom(zoom){
  GL.zoomPerspective(zoom);
  Update();
}

function resetZoom(){
  setZoom(1.0);
  Update();
}

function Update(){
  GL.GL.clear(16384 | 256);
  GL.Draw(CurrentObject, Color)
}

function ColorChange(){
  var colorStr = document.getElementById("color-input").value;
  var regexp = /#(0x)?[0-9A-F]{6}/i;
  if(regexp.test(colorStr)){
    colorStr = colorStr.substring(1);
    if(colorStr.charAt(1).toLowerCase() == "x"){
      colorStr = colorStr.substring(2);
    }
    newColor = [];
    while(colorStr){
      color = parseInt(colorStr.substring(0, 2), 16);
      colorStr = colorStr.substring(2);
      color = color/255.0;
      newColor.push(color)
    }
    newColor.push(1.0);
    Color = newColor;
    Update();
  }
}

function LevelChange(){
  resetZoom();
  var value = document.getElementById("level-slider");
  var valueLabel = value.nextSibling.nextSibling;
  valueLabel.innerHTML = value.value;
  var x = SierpinskiObject.boundX;
  var y = SierpinskiObject.boundY;
  var sideLength = SierpinskiObject.sideLength;
  SierpinskiObject = new Sierpinski(value.value, [x, y], sideLength);
  CurrentObject = SierpinskiObject;
  Update();
}

function BoundXChange(){
  var value = parseFloat(document.getElementById("bound-x").value);
  if(!isNaN(value)){
    resetZoom();
    var level = SierpinskiObject.level;
    var y = SierpinskiObject.boundY;
    var sideLength = SierpinskiObject.sideLength;
    SierpinskiObject = new Sierpinski(level, [value, y], sideLength);
    CurrentObject = SierpinskiObject;
    Update();
  }
}

function BoundYChange(){
  var value = parseFloat(document.getElementById("bound-y").value);
  if(!isNaN(value)){
    resetZoom();
    var level = SierpinskiObject.level;
    var x = SierpinskiObject.boundX;
    var sideLength = SierpinskiObject.sideLength;
    SierpinskiObject = new Sierpinski(level, [x, value], sideLength);
    CurrentObject = SierpinskiObject;
    Update();
  }
}

function SideLengthChange(){
  var value = parseFloat(document.getElementById("side-length").value);
  if(!isNaN(value)){
    resetZoom();
    var level = SierpinskiObject.level;
    var x = SierpinskiObject.boundX;
    var y = SierpinskiObject.boundY;
    SierpinskiObject = new Sierpinski(level, [x, y], value);
    CurrentObject = SierpinskiObject;
    Update();
  }
}

function ConchoidAChange(){
  var value = parseFloat(document.getElementById("conch-a").value);
  if(!isNaN(value)){
    var b = ConchoidObject.b;
    ConchoidObject = new Conchoid(value, b, 1.0, 1.0);
    CurrentObject = ConchoidObject;
    Update();
  }
}

function ConchoidBChange(){
  var value = parseFloat(document.getElementById("conch-b").value);
  if(!isNaN(value)){
    var a = ConchoidObject.a;
    ConchoidObject = new Conchoid(a, value, 1.0, 1.0);
    CurrentObject = ConchoidObject;
    Update();
  }
}

function ZoomChange(){
  var value = parseFloat(document.getElementById("max-value").value);
  if(!isNaN(value)){
    setZoom(1.0/value);
    CurrentZoom = value;
  }
}

function ConchoidChecked(){
  CurrentObject = ConchoidObject;
  setZoom(1.0/CurrentZoom);
  Update();
}

function SierpinskiChecked(){
  CurrentObject = SierpinskiObject;
  resetZoom();
  Update()
}

function AddClickEvent(CanvasID){
    var canvas = document.getElementById(CanvasID);
    canvas.addEventListener('click', function(event) {
      var x = event.offsetX,
          y = event.offsetY;
      console.log(event);
      console.log(x + " " + y)
    });
}
