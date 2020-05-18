function lesson0_1(){

let programInfo, triangleBufferInfo, cubeBuffer, projMatrix;
let numObjects = 15; 
let translateTriangle = [0, -1, 0]; 
let translateCube = [0, 0, 0];
let emeny = [];


function main(projMatrix_) { 
  projMatrix = projMatrix_;
  let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
  let program = createProgram(gl, vertexShader, fragmentShader); 
 
  gl.useProgram(program); 



  cubeBuffer = primitives.createXYQuadVertices(5, 0,0);//размер
    console.log(cubeBuffer)
  let cubeBufferInfo = createFlattenedVertices(gl, cubeBuffer.indices.data);
  console.log("2")
   for (let ii = 0; ii < numObjects; ++ii) {
    let object = {
      uniforms: {  
        u_color: [rand(0,1), rand(0,1), rand(0,1), 1], //задаём цвет примитивов от 0 до 1
        u_matrix: m4.identity(),//заполняем матрицу проекций+вида единичной матрицей
      },//задаём значение расположения примитивов
      translation: [rand(-100, 100), rand(-100, 100), rand(-150, -50)],
      speed: rand(0.2, 0.4), 
      programInfo: program,
      bufferInfo: cubeBufferInfo, //всегда будет 0,1,2 - мы не выйдем за конец массива
    };  
    emeny.push(object); //массив обьектов, в каждом свои параметры
  } 
   console.log("3")
  //printM()
  //console.log() 

  keyboard(window); 
  requestAnimationFrame(drawScene);
  //drawScene(Date.now());
}
 

function drawScene(time){ 
//очищаем канвас
  gl.clearColor(0, 0, 0, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  console.log("4")
  time *= 0.0005;  
//матрица проекции+вида
  emeny.forEach(function(object) {
      console.log("44")
    object.uniforms.u_matrix = computeMatrix(
        projMatrix,
        object.translation,
        object.xRotationSpeed * time,
        object.yRotationSpeed * time);
      console.log(gl, object.programInfo, object.bufferInfo)
// Устанавливаем значения всем буферам и атрибутам
    webglUtils.setBuffersAndAttributes(gl, object.programInfo, object.bufferInfo);  
      console.log("4444")
// Установка всех uniform-переменных и текстур
    webglUtils.setUniforms(object.programInfo, object.uniforms);  
      console.log("44444")
    gl.drawArrays(gl.TRIANGLES, 0, 8);    
  }); 
  console.log("5")
 
  //gl.drawArrays(gl.TRIANGLES, 0, 3);
  //requestAnimationFrame(drawScene);
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
function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
  let matrix = m4.translate(viewProjectionMatrix,
      translation[0],
      translation[1],
      translation[2]);
//делаем xRotate и yRotate потому, что хотим поворачивать обьекты по оси Х и У
  matrix = m4.xRotate(matrix, xRotation);//xRotate и yRotate
  return m4.yRotate(matrix, yRotation);
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