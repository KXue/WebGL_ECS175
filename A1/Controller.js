//USE OFFSETX & OFFSETY FOR MOUSE STUFF
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
  var value = document.getElementById("level-slider");
  var valueLabel = value.nextSibling;
  valueLabel.innerHTML = value.value;
  currentObject = SierpinskiFillSquare(value.value, [-1.0, -1.0], 2.0);
  Update();
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
