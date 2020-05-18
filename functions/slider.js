 
function clearAllParam(){
  settings.matrix.modelView = [];
  settings.matrix.modelView = matrix4.identity();
  settings.global.rotation = [];
  settings.global.scale = [];
  settings.global.translate = [];
  settings.global.camera = [];
  settings.global.radius = [];
}


function updateLight(index, callback) {
  return function(event, ui) {  
    settings.global.lightingDirColor[index] = ui.value;
    setMatrix(callback );
  }
}



function updateAmbient(index, callback) {
  return function(event, ui) {
    settings.global.ambientColor[index] = ui.value;
    setMatrix(callback );
  }
}


function updatePosition(index, callback ) {
  return function(event, ui) { 
    settings.global.translate[index] = ui.value;
    setMatrix(callback );
  }
}


function updateRotation(index, callback ) {
  return function(event, ui) {  
    let angleInRadians = ui.value * Math.PI / 180;
    settings.global.rotation[index] = angleInRadians;
    setMatrix(callback );
  }
}

function updateScale(index, callback ) {
  return function(event, ui) { 
    settings.global.scale[index] = ui.value;
    setMatrix(callback );
  }
}

function updateCamera(callback ){
  return function(event, ui) {
    settings.global.camera = ui.value;
    setMatrix(callback );
  }
}

function updateRadius(callback ){
  return function(event, ui) { 
    settings.global.radius = ui.value;
    setMatrix(callback );
  }
}

function updateDirection(id, callback){
  return function(event, ui) { 
    settings.global.lightingDirection[id] = ui.value;
    setMatrix(callback );
  }
}

function updateBlending(callback){
  return function(event, ui) {
    settings.global.blending = ui.value;
    setMatrix(callback);
  }
}

function setMatrix( callback ){
  settings.matrix.modelView = [];
  settings.matrix.modelView = matrix4.identity();
  settings.matrix.modelView = matrix4.translate(settings.matrix.modelView, ...settings.global.translate);
  settings.matrix.modelView = matrix4.scale(settings.matrix.modelView, ...settings.global.scale);
  settings.matrix.modelView = matrix4.xRotate(settings.matrix.modelView, settings.global.rotation[0]);
  settings.matrix.modelView = matrix4.yRotate(settings.matrix.modelView, settings.global.rotation[1]);
  settings.matrix.modelView = matrix4.zRotate(settings.matrix.modelView, settings.global.rotation[2]);

  callback();  
}
