function lesson6_3(){

let type, pointSize;
let baseHue = rand(0, 360);
let numObjects = 200; 
let fieldOfViewRadians = degreesToRadians(60);  
let objectsToDraw = [];
let objects = [];

 function main(matrix, _type) {
  type = _type;
  let programInfo = webglUtils.createProgramInfo(gl, [vertexShaderCode, fragmentShaderCode]);    
  gl.useProgram(programInfo.program);   
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
 
  let sphereBufferInfo = createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));
  let cubeBufferInfo   = createFlattenedVertices(gl, primitives.createCubeVertices(20));
  let coneBufferInfo   = createFlattenedVertices(gl, primitives.createTruncatedConeVertices(10, 0, 20, 12, 1, true, false));

  let shapes = [
    sphereBufferInfo,
    cubeBufferInfo,
    coneBufferInfo,
  ];  

  for (let ii = 0; ii < numObjects; ++ii) {
    let object = {
      uniforms: { 
        u_colorMult: [rand(0,1), rand(0,1), rand(0,1), 1],
        u_matrix: m4.identity(),
      },
      translation: [rand(-100, 100), rand(-100, 100), rand(-150, -50)],
      xRotationSpeed: rand(0.8, 3.2),
      yRotationSpeed: rand(0.8, 3.2),
    }; 
    objects.push(object);
    objectsToDraw.push({
      programInfo: programInfo,
      bufferInfo: shapes[ii % shapes.length],
      uniforms: object.uniforms,
    });
  } 
  requestAnimationFrame(drawScene);
}
 

function drawScene(time){
  gl.clearColor(1, 1, 1, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let pointS = 12.0;
    if(settings.type === settings.typePrimitive.points) pointS = 12.0;
    gl.uniform1f(pointSize, pointS);

  time *= 0.0005;  
 
  let cameraPosition = [0, 0, globalCamera];
  let target = [0, 0, 0];
  let up = [0, 1, 0];
  let cameraMatrix = m4.lookAt(cameraPosition, target, up);

  let viewMatrix = m4.inverse(cameraMatrix); 
  let viewProjectionMatrix = m4.multiply(settings.matrix.projection, viewMatrix);

  objects.forEach(function(object) {
    object.uniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        object.translation,
        object.xRotationSpeed * time,
        object.yRotationSpeed * time);
  });
 
  objectsToDraw.forEach(function(object) {
    let programInfo = object.programInfo;
    let bufferInfo = object.bufferInfo; 
    
    webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);  
    webglUtils.setUniforms(programInfo, object.uniforms);  
    gl.drawArrays(settings.type, 0, bufferInfo.numElements);
  });

  requestAnimationFrame(drawScene);
 
}
  

function createFlattenedVertices(gl, vertices) {
  return webglUtils.createBufferInfoFromArrays(
      gl,
      primitives.makeRandomVertexColors(
          primitives.deindexVertices(vertices),
          {
            vertsPerColor: 6,
            rand: function(ndx, channel) {
              return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
            }
          })
    );
}


function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
  let matrix = m4.translate(viewProjectionMatrix,
      translation[0],
      translation[1],
      translation[2]);
  matrix = m4.xRotate(matrix, xRotation);
  return m4.yRotate(matrix, yRotation);
} 

 

function update(max) {  
    settings.global.rotation[0] = degreesToRadians(max);
    settings.global.rotation[1] = degreesToRadians(max);
    settings.global.rotation[2] = degreesToRadians(max);

    setMatrix(drawScene );
} 


function returnMaxCoord(){
    return 1000;
}


const vertexShaderCode =`
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix; 
varying vec4 v_color;

void main() { 
  gl_Position = u_matrix * a_position; 
  v_color = a_color;
}`;

const fragmentShaderCode = `
precision mediump float;
 
varying vec4 v_color; 
uniform vec4 u_colorMult;

void main() {
   gl_FragColor = v_color * u_colorMult;
}
`;

  
return { main, returnMaxCoord, drawScene, update }
}
