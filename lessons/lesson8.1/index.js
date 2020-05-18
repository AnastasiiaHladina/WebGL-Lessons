function lesson8_1(){

let programInfoF, fBufferInfo;
let translation = [0, 30, 0];
let rotation = [degreesToRadians(190), degreesToRadians(0), degreesToRadians(0)];
let scale = [1, 1, 1];
let animation;
let rotationSpeed = 1.2;
let then = 0; 

let fUniforms = {
  u_matrix: m4.identity(),
};
 

 function main() {
  programInfoF = webglUtils.createProgramInfo(gl, [vertexShaderCodeF, fragmentShaderCodeF]);       

  fBufferInfo = primitives.create3DFBufferInfo(gl); 
  
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

   drawScene(1000);
}
 

function drawScene(now){
  gl.clearColor(1, 1, 1, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

 
  now *= 0.001;
  let deltaTime = now - then;
  then = now;
  rotation[1] += rotationSpeed * deltaTime;
  

  gl.disable(gl.BLEND);
  gl.depthMask(true); 

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
    for (let xx = -1; xx <= 1; xx++) {
      let fViewMatrix = m4.translate(viewMatrix, translation[0] + xx * spread, translation[1] + yy * spread, translation[2]);
      fViewMatrix = m4.xRotate(fViewMatrix, rotation[0]);
      fViewMatrix = m4.yRotate(fViewMatrix, rotation[1] * 0.2);
      fViewMatrix = m4.zRotate(fViewMatrix, rotation[2] + now);
      fViewMatrix = m4.scale(fViewMatrix, scale[0], scale[1], scale[2]);
      fViewMatrix = m4.translate(fViewMatrix, -50, -75, 0);
      textPositions.push([fViewMatrix[12], fViewMatrix[13], fViewMatrix[14]]);

      fUniforms.u_matrix = m4.multiply(settings.matrix.projection, fViewMatrix);
      webglUtils.setUniforms(programInfoF, fUniforms);

      gl.drawElements(gl.TRIANGLES, fBufferInfo.numElements, gl.UNSIGNED_SHORT, 0); 
    }
  }
}

function update() {
  animation = requestAnimationFrame(drawScene);
}

function stopUpdate() {
  cancelAnimationFrame(animation);
}


function setType(_type){
    type = _type; 
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
 


return { main, returnMaxCoord, drawScene, update, stopUpdate, setType }
}
