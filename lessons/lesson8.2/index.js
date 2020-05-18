function lesson8_2(){

let programInfoF, programInfoText, fBufferInfo, textBufferInfo;
let translation = [0, 30, 0];
let rotation = [degreesToRadians(190), degreesToRadians(0), degreesToRadians(0)];
let animation, calledOnesAnimation;
let rotationSpeed = 1.2;
let then = 0; 

let fUniforms = {
  u_matrix: m4.identity(),
};

let textUniforms = {
  u_matrix: m4.identity(),
  u_texture: null,
  u_color: null,
};

 function main() {
  programInfoF = webglUtils.createProgramInfo(gl, [vertexShaderCodeF, fragmentShaderCodeF]);    
  programInfoText = webglUtils.createProgramInfo(gl, [vertexShaderCodeText, fragmentShaderCodeText]);   

  fBufferInfo = primitives.create3DFBufferInfo(gl);
  textBufferInfo = primitives.createPlaneBufferInfo(gl, 1, 1, 1, 1, m4.xRotation(Math.PI / 2));
  
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

   drawScene(1000);
}
 

function drawScene(now){
  cancelAnimationFrame(calledOnesAnimation);
  gl.clearColor(1, 1, 1, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  now *= 0.001;
  let deltaTime = now - then;
  then = now;
  rotation[1] += rotationSpeed * deltaTime;

  let cameraRadius = 360;
  let cameraPosition = [Math.cos(now) * cameraRadius, 0, Math.sin(now) * cameraRadius];
  let target = [0, 0, 0];
  let up = [0, 1, 0];
  let cameraMatrix = m4.lookAt(cameraPosition, target, up);
  let viewMatrix = m4.inverse(cameraMatrix); 

  let textPositions = [];
  gl.useProgram(programInfoF.program);
  webglUtils.setBuffersAndAttributes(gl, programInfoF, fBufferInfo);

  let spread = 170;
  for (let yy = -1; yy <= 1; yy++) {
    for (let xx = -2; xx <= 2; xx++) {
      let fViewMatrix = m4.translate(viewMatrix, translation[0] + xx * spread, translation[1] + yy * spread, translation[2]);
      fViewMatrix = m4.xRotate(fViewMatrix, rotation[0]);
      fViewMatrix = m4.yRotate(fViewMatrix, rotation[1] + yy * xx * 0.2);
      fViewMatrix = m4.zRotate(fViewMatrix, rotation[2] + now + (yy * 3 + xx) * 0.1);
      textPositions.push([fViewMatrix[12], fViewMatrix[13], fViewMatrix[14]]);
 
      fUniforms.u_matrix = m4.multiply(settings.matrix.projection, fViewMatrix);
      webglUtils.setUniforms(programInfoF, fUniforms);
      gl.drawElements(gl.TRIANGLES, fBufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

    }
  }
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.useProgram(programInfoText.program); 
  webglUtils.setBuffersAndAttributes(gl, programInfoText, textBufferInfo); 
  textPositions.forEach(function(pos, ndx) {
    let tex = textTextures[ndx];  
    let fromEye = matrix4.normalize(pos); 
    let viewX = pos[0] - fromEye[0] * 150;
    let viewY = pos[1] - fromEye[1] * 150;
    let viewZ = pos[2] - fromEye[2] * 150;
    let desiredTextScale = -1 / gl.canvas.height;
    let scale = viewZ * desiredTextScale;
    let textMatrix = matrix4.translate(settings.matrix.projection, viewX, viewY, viewZ);
    textMatrix = matrix4.scale(textMatrix, tex.width * scale, tex.height * scale, 1);

    m4.copy(textMatrix, textUniforms.u_matrix);
    textUniforms.u_texture = tex.texture;
    textUniforms.u_color = colors[ndx];
    webglUtils.setUniforms(programInfoText, textUniforms);
 
    gl.drawElements(gl.TRIANGLES, textBufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
  });
}

function update() {
  animation = requestAnimationFrame(drawScene);
}

function stopUpdate() {
  cancelAnimationFrame(animation);
}



function returnMaxCoord(){ 
    return 1000;
}


const vertexShaderCodeF =`
  attribute vec4 a_position;
  attribute vec4 a_color; 
  uniform mat4 u_matrix; 
  varying vec4 v_color;

  void main() { 
    gl_Position = u_matrix * a_position; 
    v_color = a_color;
  }
`;
const fragmentShaderCodeF = `
  precision mediump float; 
  varying vec4 v_color;

  void main() {
     gl_FragColor = v_color;
  }
`;
const vertexShaderCodeText =`
  attribute vec4 a_position;
  attribute vec2 a_texcoord; 
  uniform mat4 u_matrix; 
  varying vec2 v_texcoord;

  void main() { 
    gl_Position = u_matrix * a_position; 
    v_texcoord = a_texcoord;
  }
`;
const fragmentShaderCodeText = `
  precision mediump float; 
  varying vec2 v_texcoord; 
  uniform sampler2D u_texture;
  uniform vec4 u_color;

  void main() {
     gl_FragColor = texture2D(u_texture, v_texcoord) * u_color;
  }
`;

let colors = [
  [0.0, 0.0, 0.0, 1], // 0
  [1.0, 0.0, 0.0, 1], // 1
  [0.0, 1.0, 0.0, 1], // 2
  [1.0, 1.0, 0.0, 1], // 3
  [0.0, 0.0, 1.0, 1], // 4
  [1.0, 0.0, 1.0, 1], // 5
  [0.0, 1.0, 1.0, 1], // 6
  [0.5, 0.5, 0.5, 1], // 7
  [0.5, 0.0, 0.0, 1], // 8
  [0.0, 0.0, 0.0, 1], // 9
  [0.5, 5.0, 0.0, 1], // 10
  [0.0, 5.0, 0.0, 1], // 11
  [0.5, 0.0, 5.0, 1], // 12,
  [0.0, 0.0, 5.0, 1], // 13,
  [0.5, 5.0, 5.0, 1], // 14,
  [0.0, 5.0, 5.0, 1], // 15,
];

let textTextures = [
  "anna",   // 0
  "colin",  // 1
  "james",  // 2
  "danny",  // 3
  "kalin",  // 4
  "hiro",   // 5
  "eddie",  // 6
  "shu",    // 7
  "brian",  // 8
  "tami",   // 9
  "rick",   // 10
  "gene",   // 11
  "natalie",// 12,
  "evan",   // 13,
  "sakura", // 14,
  "kai",    // 15,
].map(function(name) {
  let textCanvas = makeTextCanvas(name, 200, 26);  
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return {
    texture,
    width: textCanvas.width,
    height: textCanvas.height,
  };
});

function makeTextCanvas(text, width, height) {

  let textCtx = document.createElement("canvas").getContext("2d");
  textCtx.canvas.width  = width;
  textCtx.canvas.height = height;
  textCtx.font = "50px monospace";
  textCtx.textAlign = "center";
  textCtx.textBaseline = "middle";
  textCtx.fillStyle = "white";
  textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
  textCtx.fillText(text, width / 2, height / 2);
  return textCtx.canvas;
}


return { main, returnMaxCoord, drawScene, update, stopUpdate }
}
