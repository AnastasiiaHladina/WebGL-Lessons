function lesson3(){

let pointSize, modelViewMatrix;


function main() {
    settings.global.translate[2] = 0;
	let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
	let program = createProgram(gl, vertexShader, fragmentShader);
	let positionLocation = gl.getAttribLocation(program, "a_position"); 
	let colorLocation = gl.getAttribLocation(program, "a_color");
        pointSize = gl.getUniformLocation(program,"u_pointSize");
	let projectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatr");
      modelViewMatrix = gl.getUniformLocation(program, "u_ModelViewMatr");

  gl.useProgram(program);
  gl.uniformMatrix4fv(projectionMatrix, false, settings.matrix.projection);

	let positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	setGeometry();
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0); 

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColor();
  gl.enableVertexAttribArray(colorLocation); 
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0); 

  setMatrix(drawScene);
}


function drawScene() {
    gl.clearColor(1, 1, 1, 1);

	gl.clear(gl.COLOR_BUFFER_BIT);
    let pointS = 12.0;
    if(settings.type === settings.typePrimitive.points) pointS = 12.0;
    gl.uniform1f(pointSize, pointS);
    gl.uniformMatrix4fv(modelViewMatrix, false, settings.matrix.modelView);
    gl.drawArrays(settings.type, 0, settings.positions.coordsData.coordsPair);
}


function setGeometry() {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(settings.positions.coordsData.coords),
      gl.STATIC_DRAW);
}

function setColor() {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(settings.positions.colorData.color),
      gl.STATIC_DRAW);
}



const vertexShaderCode = `
attribute vec2 a_position; 
attribute vec3 a_color;  

uniform mat4 u_ProjectionMatr;  
uniform mat4 u_ModelViewMatr; 
uniform float u_pointSize;  

varying vec4 a_col;  

void main() {
  gl_Position = u_ProjectionMatr * u_ModelViewMatr * vec4(a_position, 0, 1);
  gl_PointSize = u_pointSize;
  a_col = vec4(a_color, 1.0);
}`;

  const fragmentShaderCode = `
  precision mediump float;

  varying vec4 a_col;

  void main() {
     gl_FragColor = a_col;
  }
  `;


  return { main, drawScene }

}
