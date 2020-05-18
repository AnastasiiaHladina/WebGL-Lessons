function lesson0_1(){

let positionCubeBuffer, colorBuffer;
let t=0; 
let uniformSetters, attribSetters; 
let prevTime = 0;
let gameObj = []; 
let enemy = []; 
let bulet = [];
let player = {};
let findInd;

function main() { 
  let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
  let program = createProgram(gl, vertexShader, fragmentShader); 
  gl.useProgram(program);

  uniformSetters = webglUtils.createUniformSetters(gl, program);
  attribSetters  = webglUtils.createAttributeSetters(gl, program);

  let positionTriangleBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, positionTriangleBuffer); 
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW); 

  positionCubeBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, positionCubeBuffer); 
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(cube), gl.STATIC_DRAW); 
 
/*------------------------------------------------------*/
  player = {
    attribs: {
      a_position: { buffer: positionTriangleBuffer, size: 2}, 
    },
    uniforms: {
      u_mvm: matrix4.identity(), 
      u_color: 0,
      who:1,
    },
    numVert: 3,
    XYZ:[0,-0.9,0],
    count: 1,
  };
  gameObj.push(player);
 

let x=-1.2;//начало первого ряда 
let y=0.9;
let r=5;//на каком елементе делать сдвиг
let o=4;//сдвиг
let s=-0.8;//ысчитываем на какой координате надо начинать x
for(let i=0; i<15; i++){
  if(i-r===0){
    y-=0.2;
    r+=o;    
    o-=1;//строка

    s+=0.2;
    x=s;
  } else{
    x+=0.4; 
  }
  

  //console.log(i,r,o, x, y)

  let object = {
    attribs: {
      a_position: { buffer: positionTriangleBuffer, size: 2},
    }, 
    uniforms: {
      u_mvm: matrix4.translate(matrix4.identity(), x,y,0),//заполняем матрицу проекций+вида единичной матрицей
      u_color: 1,
      who: 0,
    }, 
    speed: [0.05, 0.05],  
    numVert: 3,
    XYZ:[ x, y, 0 ],
    count: 15,
  };  
  enemy.push(object); //массив обьектов, в каждом свои параметры
  gameObj.push(object);
}
 
  keyboard(window, player); 
  requestAnimationFrame(drawScene);
}
 

function drawScene(now){
//очищаем канвас
  gl.clearColor(0, 0, 0, 1); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
  const delta=(now-prevTime)*(0.001);
  prevTime=now;

//ДВИЖ ИГРОКА
  player.XYZ[0] += globalTransl[0]*delta;  
  player.uniforms.u_mvm = matrix4.translate(matrix4.identity(), ...player.XYZ);

//ДВИЖ ВРАГОВ
  for(let i=0; i<enemy.length; i++){
    enemy[i].uniforms.u_mvm = matrix4.translate(enemy[i].uniforms.u_mvm, 0, -1*(enemy[i].speed[1]*delta),0);  
    enemy[i].XYZ =[enemy[i].uniforms.u_mvm[12], enemy[i].uniforms.u_mvm[13], enemy[i].uniforms.u_mvm[14]]; 
  }

//СОЗДАНИЕ ПУЛЬ
  t+=delta;
  if(t>=1){
    t=0;
    let object = {
      attribs: {
        a_position: { buffer: positionCubeBuffer, size: 2}, 
      }, 
      uniforms: { 
        u_mvm: matrix4.multiply(
          matrix4.translate(matrix4.identity(), ...player.XYZ),
          matrix4.scale(matrix4.identity(), 1,0.3,1)),
        u_color: 2,
        who:1,
      },//задаём значение расположения примитивов
      speed: [0, 0.8],
      numVert: 6,
      XYZ: matrix4.translate(matrix4.identity(), ...player.XYZ),
    };  
    bulet.push(object); //массив обьектов, в каждом свои параметры
    gameObj.push(object);
  }
  //ПЕРЕМЕЩЕНИЕ ПУЛЬ
  for(let i=0;i<bulet.length; i++){

    bulet[i].uniforms.u_mvm = matrix4.translate(bulet[i].uniforms.u_mvm, 0, (bulet[i].speed[1]*delta),0); 
    //записываем положение каждой пули
    bulet[i].XYZ=[bulet[i].uniforms.u_mvm[12], bulet[i].uniforms.u_mvm[13], bulet[i].uniforms.u_mvm[14]];

//ПРОВЕРКА НА ПОПАДАНИЕ
    for(let j=0; j<enemy.length; j++){ 
      if(bulet[i].XYZ[0]===enemy[j].XYZ[0]){
          console.log("1");
          //удаляем пулю с массива пуль
        /*
          bulet.splice(i, 1);
          enemy.splice(j, 1); 
        */
      }
    }

    //проверяем положение пули
    if(bulet[i].XYZ[1]>=0.8){
      //удаляем пулю с массива пуль
      bulet.splice(i, 1);
      findInd = gameObj.findIndex(remove);
      if(findInd!==-1)
        //удаляем пулю с общего массива
        gameObj.splice(findInd,1);
    }

  }




  for(let i=0;i<gameObj.length; i++){
//ОТРИСОВКА ВСЕХ ОБЬЕКТОВ
    webglUtils.setAttributes(attribSetters, gameObj[i].attribs);
    webglUtils.setUniforms(uniformSetters, gameObj[i].uniforms);
    gl.drawArrays(gl.TRIANGLES, 0, gameObj[i].numVert);
  }
  requestAnimationFrame(drawScene);
}

function remove(el){
//проверка на то, что пуля пролетела все поле и
//чтобы все игроки отбраковывались и брались только пули
  if(el.numVert===6)return true;
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
];

const vertexShaderCode =`
attribute vec2 a_position; 
attribute vec3 a_color;
   
uniform mat4 u_mvm; 
uniform int who;

void main() { 
  gl_Position = u_mvm * vec4(a_position, 0, 1); 
}
`;
const fragmentShaderCode = `
precision mediump float; 
uniform int u_color;

void main(){
  if(u_color==0) gl_FragColor=vec4(0,1,1,1);
  if(u_color==1) gl_FragColor=vec4(1,0,0,1);
  if(u_color==2) gl_FragColor=vec4(1,1,1,1);
 
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