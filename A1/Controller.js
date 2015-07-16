
function AddClickEvent(CanvasID){
    var canvas = document.getElementById(CanvasID),
        elemLeft = canvas.offsetLeft,
        elemTop = canvas.offsetTop;
    canvas.addEventListener('click', function(event) {
      var x = event.pageX - elemLeft,
          y = event.pageY - elemTop;
      console.log(event);
    });
}
