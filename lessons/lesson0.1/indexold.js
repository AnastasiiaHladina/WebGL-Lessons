function lesson0_1(){

let programInfo, triangleBufferInfo, cubeBufferInfo, mvmLocation, projLocation,
modelView;
let numObjects = 15; 
let translateTriangle = [0, -1, 0]; 
let translateCube = [0, 0, 0];
let emeny = [];

let triangleUniforms = {
  u_matrix: m4.identity(),
  u_color: [0, 0, 0, 1],
}; 

function main(m) { 
  let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
  let program = createProgram(gl, vertexShader, fragmentShader); 
  let positionLocation = gl.getAttribLocation(program, "a_position"); 
  mvmLocation = gl.getUniformLocation(program, "a_mvm");  
  projLocation = gl.getUniformLocation(program, "a_proj");  
  gl.useProgram(program);
  gl.uniformMatrix4fv(projLocation, false, m); 

  let positionBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW); 
  gl.enableVertexAttribArray(positionLocation);  
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0); 
  
 
  triangleUniforms.u_matrix = matrix4.translate(triangleUniforms.u_matrix, 0,-0.9,0);   
  gl.uniformMatrix4fv(mvmLocation, false, triangleUniforms.u_matrix);   

/*
  for (let ii = 0; ii < numObjects; ii++) {
    let object = {
      uniforms: { 
        u_color: [rand(0,1), rand(0,1), rand(0,1), 1],//задаём цвет примитивов от 0 до 1
        u_matrix: m4.identity(),//заполняем матрицу проекций+вида единичной матрицей
      },//задаём значение расположения примитивов
      translation: [0, 0, 0],
      xRotationSpeed: rand(0, 0),
      yRotationSpeed: rand(0, 0),
      bufferInfo: 
    };  
    emeny.push(object); //массив обьектов, в каждом свои параметры
  } 
 
  printM(m)
  console.log() 
*/
  keyboard(window); 
  requestAnimationFrame(drawScene);
  //drawScene(Date.now());
}
 

function drawScene(now){ 
//очищаем канвас
  gl.clearColor(0, 0, 0, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 




  gl.drawArrays(gl.TRIANGLES, 0, 3);
  //requestAnimationFrame(drawScene);
}

 

function update(max) {
}  

function setType(_type){
    type = _type; 
} 

//функция проходится только по координатам не трогая нормали
function returnMaxCoord(){ 
    return 1000;
}

 
let triangle = [
   0,     0.05,
   0.03, -0.03,
  -0.03, -0.03 
];
let cube = [ 
  -0.005,  0.04,
   0.005,  0.04,
  -0.005, -0.04,
  -0.005, -0.04,
   0.005, -0.04,
   0.005,  0.04

/*
  -0.05, -0.05,
  -0.05,  0.05,
   0.05,  0.05,

   0.05,  0.05,
   0.05, -0.05,
  -0.05, -0.05,   
*/
];

const vertexShaderCode =`
attribute vec2 a_position; 
attribute vec3 a_color;
  
uniform mat4 a_proj; 
uniform mat4 a_mvm; 

varying vec4 v_color;

void main() {
  gl_Position = a_mvm * vec4(a_position, 0, 1); 
  v_color = vec4(1.0, 0.0, 1.0, 1.0);
}
`;
const fragmentShaderCode = `
precision mediump float; 
varying vec4 v_color;

void main(){ 
  gl_FragColor = v_color;  
}
`; 
/*----------------------------------------------*/
/*
const vertexShaderCodeCube =`
attribute vec4 a_position;
attribute vec4 a_color; 
uniform mat4 u_matrix; 
varying vec4 v_color;

void main() { 
  gl_Position = u_matrix * a_position; 
  v_color = a_color;
}
`;
const fragmentShaderCodeCube = `
precision mediump float;

varying vec4 v_color;

void main() {
   gl_FragColor = v_color;
}
`; 
*/


return { main, returnMaxCoord, drawScene, update, setType }
}