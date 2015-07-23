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
  ChaikinObject = new Chaikin();
  CurrentObject = SierpinskiObject;
  Update();
}

function setZoom(zoom){
  ConchoidObject.zoom(zoom);
  document.getElementById("tab2").checked = true;
  CurrentObject = ConchoidObject;
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
  document.getElementById("tab1").checked = true;
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
  document.getElementById("tab1").checked = true;
  var value = parseFloat(document.getElementById("bound-x").value);
  if(!isNaN(value)){
    var level = SierpinskiObject.level;
    var y = SierpinskiObject.boundY;
    var sideLength = SierpinskiObject.sideLength;
    SierpinskiObject = new Sierpinski(level, [value, y], sideLength);
    CurrentObject = SierpinskiObject;
    Update();
  }
}

function BoundYChange(){
  document.getElementById("tab1").checked = true;
  var value = parseFloat(document.getElementById("bound-y").value);
  if(!isNaN(value)){
    var level = SierpinskiObject.level;
    var x = SierpinskiObject.boundX;
    var sideLength = SierpinskiObject.sideLength;
    SierpinskiObject = new Sierpinski(level, [x, value], sideLength);
    CurrentObject = SierpinskiObject;
    Update();
  }
}

function SideLengthChange(){
  document.getElementById("tab1").checked = true;
  var value = parseFloat(document.getElementById("side-length").value);
  if(!isNaN(value)){
    var level = SierpinskiObject.level;
    var x = SierpinskiObject.boundX;
    var y = SierpinskiObject.boundY;
    SierpinskiObject = new Sierpinski(level, [x, y], value);
    CurrentObject = SierpinskiObject;
    Update();
  }
}

function ConchoidAChange(){
  document.getElementById("tab2").checked = true;
  var value = parseFloat(document.getElementById("conch-a").value);
  if(!isNaN(value)){
    var b = ConchoidObject.b;
    ConchoidObject = new Conchoid(value, b, 1.0, 1.0);
    CurrentObject = ConchoidObject;
    Update();
  }
}

function ConchoidBChange(){
  document.getElementById("tab2").checked = true;
  var value = parseFloat(document.getElementById("conch-b").value);
  if(!isNaN(value)){
    var a = ConchoidObject.a;
    ConchoidObject = new Conchoid(a, value, 1.0, 1.0);
    CurrentObject = ConchoidObject;
    Update();
  }
}

function ZoomChange(){
  document.getElementById("tab2").checked = true;
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
  Update()
}

function ChaikinChecked(){
  CurrentObject = ChaikinObject;
  Update();
}

function DivideBack(){
  document.getElementById("tab3").checked = true;
  ChaikinObject.setLevel(ChaikinObject.Levels - 1);
  Update();
  document.getElementById("back-button").previousSibling.previousSibling.innerHTML = "Level: " + ChaikinObject.Levels + " ";
}

function DivideForward(){
  document.getElementById("tab3").checked = true;
  ChaikinObject.setLevel(ChaikinObject.Levels + 1);
  Update();
  document.getElementById("back-button").previousSibling.previousSibling.innerHTML = "Level: " + ChaikinObject.Levels + " ";
}

function toggleOpenClose(){
  ChaikinObject.toggleOpen();
  if(ChaikinObject.Closed){
    document.getElementById("closed-open-button").innerHTML = "Closed";
  }
  else{
    document.getElementById("closed-open-button").innerHTML = "Open";
  }
  Update();
  document.getElementById("tab3").checked = true;

}

function AddClickEvent(CanvasID){
    var canvas = document.getElementById(CanvasID);
    canvas.addEventListener('click', function(event) {
      if(CurrentObject == ChaikinObject){
        var x = event.offsetX,
            y = event.offsetY;
        ChaikinObject.AddPoint((2 * x / canvas.width) - 1.0, (2 * y / canvas.height) - 1.0);
        Update();
      }
    });
}
