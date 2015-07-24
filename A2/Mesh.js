function Mesh(fileSource, colour){
  this.RotationX = 0;
  this.RotationY = 0;
  this.RotationZ = 0;
  this.translateX = 0;
  this.traslateY = 0;
  this.translateZ = 0;
  this.faces = [];
  this.vertices = [];
  this.modelTransformMatrix;

  if(fileSource){
    readObject(fileSource);
  }
  this.draw = function(WebGL){

  };
  this.translate = function(xyzArray){

  };
  this.zoom = function(xyzZoom){

  };
  this.rotate = function(xyzRotation){

  };
  this.createTransformMatrix = function(){

  };
  this.combineTransforms = function(transformStack){

  };
}
