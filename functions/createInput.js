let col = ["R", "G", "B"];
function createRB_Type() {
  let div = document.getElementById("view");
  settings.type = settings.typePrimitive.triangles;
  for (let c = 0; c < 7; c++) {
    let input = document.createElement("input");
    input.type = "radio";
    input.name = "view";
    input.id = c;
    input.value = Object.values(settings.typePrimitive)[c];
    let label = document.createElement("label");
    label.id = c + "_span";
    label.className  = "view";
    label.innerHTML = Object.keys(settings.typePrimitive)[c];
    if(input.value === gl.TRIANGLES)input.checked = true;
    input.onclick = function() {
      settings.type = this.value;
      settings.lesson.drawScene();
    };
    div.appendChild(input);
    div.appendChild(label); 
  }
}


function createTimerButton() {
  let div = document.getElementById("timer");
  let input = document.createElement("input");
  input.type = "submit";
  input.name = "timer";
  input.id = "ButtonTimer";
  input.value = "Включить";
  input.className = "btn btn-primary btn-lg btn-block";
  input.onclick = () => {
    checkTimer();
  };
  div.appendChild(input);
}


function createS_Filter(callback) {
  let div = document.getElementById("texture");
  let select = document.createElement("select");
  select.id = "kernel";
    for (let name in kernels) {
      let option = document.createElement("option");
      option.value = name;
      if (name === "normal") {
        option.selected = true;
      }
      option.appendChild(document.createTextNode(name));
      select.appendChild(option);
    }
  select.onchange = function(event) {
    callback(this.options[this.selectedIndex].value);
  };
  let br = document.createElement("br");  

  div.appendChild(select); 
  div.appendChild(br);  
}


function createRB_Filter(callback) {
  let div = document.getElementById("texture"); 
  for(let c = 0; c < 3; c++){
    let input = document.createElement("input");
    input.type = "radio";
    input.name = "color";
    input.id = c;
    input.onclick = () => {
      let select = document.getElementById("kernel"); 
      callback(select.value, this.id);
    };
    
    input.style.margin = 15 + "px"; 
    if(input.id === 0)input.checked = true;

    let label = document.createElement("label");  
    label.id = c + "_span"; 
    label.innerHTML = "R";    
    if(c === 1)label.innerHTML = "G";
    else if(c === 2)label.innerHTML = "B";  
    div.appendChild(input);
    div.appendChild(label);
  }
}


function createCheckB(callback) {
  let div = document.getElementById("lookAt"); 
  let input = document.createElement("input");
  input.type = "checkbox"; 
  input.id = "lookAt"; 
  input.className = "form-check-input";

  input.onclick = () => {
    settings.checkbox.checkLookAt = input.checked;
    callback();
  };

  let label = document.createElement("label");  
  label.for = "lookAt";  
  label.innerHTML = "Включить lookAt";  
  div.appendChild(input);   
  div.appendChild(label);   
}


function createLight(callback ) {
  let div = document.getElementById("light"); 
  let input = document.createElement("input");
  input.type = "checkbox";
  input.id = "directionalLighting"; 
  input.className = "form-check-input";
  input.onclick = () => {
    settings.checkbox.light = !settings.checkbox.light;
    callback()
  };
  div.appendChild(input);

  let label = document.createElement("label");  
  label.for = "directionalLighting";  
  label.style.fontSize = "12px";
  label.style.margin = "0 40px";
  label.style.width = "65%";
  label.innerHTML = "Включить освещение";
  div.appendChild(label);   
}


function createBlending(callback) {
  let div = document.getElementById("checkBlending");
  let input = document.createElement("input");
  input.type = "checkbox";
  input.id = "blending";
  input.className = "form-check-input";
  input.onclick = () => {
    settings.checkbox.blending = !settings.checkbox.blending;
    callback();
  };
  div.appendChild(input);

  let label = document.createElement("label");
  label.for = "blending";
  label.style.fontSize = "12px";
  label.style.margin = "0 40px";
  label.style.width = "65%";
  label.innerHTML = "Включить смешивание";
  div.appendChild(label);
}


function createS_Transformation(callback ) {
  webglLessonsUI.setupSlider("#x", {
    value: settings.global.translate[0],
    slide: updatePosition(0, callback ),
    min: -2,
    max: 2,
    step: 0.01, 
    precision: 2 
  });  
  webglLessonsUI.setupSlider("#y", {
    value: settings.global.translate[1],
    slide: updatePosition(1, callback ),
    min: -1, 
    max: 1, 
    step: 0.01, 
    precision: 2
  });  
  webglLessonsUI.setupSlider("#z", {
    value: settings.global.translate[2],
    slide: updatePosition(2, callback ),
    min: -7, 
    max: 0, 
    step: 0.01, 
    precision: 2
  });  
  webglLessonsUI.setupSlider("#angleX", {
    value: radiansToDegrees(settings.global.rotation[0]),
    slide: updateRotation(0, callback ),
    min: 0,
    max: 90,
    step: 0.01, 
    precision: 2 
  });  
  webglLessonsUI.setupSlider("#angleY", {
    value: radiansToDegrees(settings.global.rotation[1]),
    slide: updateRotation(1, callback ),
    min: 0,
    max: 360,
    step: 0.01, 
    precision: 2 
  });  
  webglLessonsUI.setupSlider("#angleZ", {
    value: radiansToDegrees(settings.global.rotation[2]),
    slide: updateRotation(2, callback ),
    min: 0,
    max: 90,
    step: 0.01, 
    precision: 2 
  });  
  webglLessonsUI.setupSlider("#scaleX", {
    value: settings.global.scale[0],
    slide: updateScale(0, callback ),
    min: -2, 
    max: 2, 
    step: 0.01, 
    precision: 2
  }); 
  webglLessonsUI.setupSlider("#scaleY", {
    value: settings.global.scale[1],
    slide: updateScale(1, callback ),
    min: -2, 
    max: 2, 
    step: 0.01, 
    precision: 2
  }); 
  webglLessonsUI.setupSlider("#scaleZ", {
    value: settings.global.scale[2],
    slide: updateScale(2, callback ),
    min: 0, 
    max: 6, 
    step: 0.01, 
    precision: 2
  });  
}


function createS_Camera(callback, min, max) {
  webglLessonsUI.setupSlider("#camera", {
    value: settings.global.scale,
    slide: updateCamera(callback),
    min: min, 
    max:  max, 
    step: 0.1,
    precision: 1
  });
  webglLessonsUI.setupSlider("#radius", {
    value: settings.global.radius,
    slide: updateRadius(callback ),
    min: 1, 
    max:  5, 
    step: 0.01, 
    precision: 2 
  }); 
}


function createS_Light(callback ) {
  webglLessonsUI.setupSlider("#R", {
    value: settings.global.lightingDirColor[0],
    slide: updateLight(0, callback), 
    min: 0, 
    max: 1,
    step: 0.01,   
    precision: 2  
  });
  webglLessonsUI.setupSlider("#G", {
    value: settings.global.lightingDirColor[1],
    slide: updateLight(1, callback), 
    min: 0, 
    max: 1,
    step: 0.01, 
    precision: 2 
  }); 
  webglLessonsUI.setupSlider("#B", {
    value: settings.global.lightingDirColor[2],
    slide: updateLight(2, callback), 
    min: 0, 
    max: 1,
    step: 0.01,   
    precision: 2  
  });
  webglLessonsUI.setupSlider("#directionX", {
    value: settings.global.lightingDirection[0],
    slide: updateDirection(0, callback), 
    min: -10, 
    max:  10, 
    step: 0.01, 
    precision: 2 
  }); 
  webglLessonsUI.setupSlider("#directionY", {
    value: settings.global.lightingDirection[1],
    slide: updateDirection(1, callback), 
    min: -10, 
    max:  10, 
    step: 0.01,   
    precision: 2  
  });
  webglLessonsUI.setupSlider("#directionZ", {
    value: settings.global.lightingDirection[2],
    slide: updateDirection(2, callback), 
    min: -10, 
    max:  10, 
    step: 0.01, 
    precision: 2 
  }); 
}

function createS_Ambient(callback) {
  webglLessonsUI.setupSlider("#ambientR", {
    value: settings.global.ambientColor[0],
    slide: updateAmbient(0, callback ),
    min: 0, 
    max: 255, 
    step: 0.01,   
    precision: 2  
  });
  webglLessonsUI.setupSlider("#ambientG", {
    value: settings.global.ambientColor[1],
    slide: updateAmbient(1, callback ),
    min: 0, 
    max: 255, 
    step: 0.01, 
    precision: 2 
  }); 
  webglLessonsUI.setupSlider("#ambientB", {
    value: settings.global.ambientColor[2],
    slide: updateAmbient(2, callback ),
    min: 0, 
    max: 255, 
    step: 0.01,   
    precision: 2  
  });
}

function createS_Blending(callback) {
  webglLessonsUI.setupSlider("#transparentBlending", {
    value: settings.global.blending,
    slide: updateBlending(0, callback ),
    min: 0,
    max: 1,
    step: 0.01,
    precision: 2
  });
}

