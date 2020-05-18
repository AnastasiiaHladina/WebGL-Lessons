function lesson7(){

let numObjects = 200;
let objects = [];
let animation, calledOnesAnimation;

 function main() {
  let programInfo = webglUtils.createProgramInfo(gl, [vertexShaderCode, fragmentShaderCode]);
  gl.useProgram(programInfo.program);   
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  let sphereBufferInfo = createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));
  let cubeBufferInfo = createFlattenedVertices(gl, primitives.createCubeVertices(20));
  let coneBufferInfo = createFlattenedVertices(gl, primitives.createTruncatedConeVertices(10, 0, 20, 12, 12, true, false));

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
      programInfo: programInfo,
      bufferInfo: shapes[ii % shapes.length],
    };  
    objects.push(object);
  }
  drawScene(1000);
}


function drawScene(time){
    cancelAnimationFrame(calledOnesAnimation);
  gl.clearColor(1, 1, 1, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  time *= 0.0005;  
 
  let cameraPosition = [0, 0, settings.global.camera ];
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


        let programInfo = object.programInfo;
        let bufferInfo = object.bufferInfo;
        webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        webglUtils.setUniforms(programInfo, object.uniforms);
        gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
  });

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
};


function update() {
    animation = requestAnimationFrame(drawScene);
}

function stopUpdate() {
    cancelAnimationFrame(animation);
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
