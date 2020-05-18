function lesson5(){
 

 function main() {
	let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
	let program = createProgram(gl, vertexShader, fragmentShader); 
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

	let positionLocation = gl.getAttribLocation(program, "a_position");  
	let colorLocation = gl.getAttribLocation(program, "a_color"); 
    pointSize = gl.getUniformLocation(program,"u_pointSize");
	let projectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatr");
     modelViewMatrix = gl.getUniformLocation(program, "u_ModelViewMatr");

    gl.uniformMatrix4fv(projectionMatrix, false, settings.matrix.projection);


     let positionBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(settings.positions.coordsData.coords), gl.STATIC_DRAW);
     gl.enableVertexAttribArray(positionLocation);
     gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

     let colorBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(settings.positions.colorCameraData.colorCamera), gl.STATIC_DRAW);
     gl.enableVertexAttribArray(colorLocation);
     gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    setMatrix(drawScene );
}



function drawScene(){   

    gl.clearColor(1, 1, 1, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let pointS = 12.0;
    if(settings.type === settings.typePrimitive.points) pointS = 12.0;
    gl.uniform1f(pointSize, pointS);

    let numFs = 5;
    let cameraMatrix = matrix4.yRotation(settings.global.camera);
    cameraMatrix = matrix4.translate(cameraMatrix, 0, 1, settings.global.radius );
    if(settings.checkbox.checkLookAt){
        let fPosition = [settings.global.radius , 0, 0];
        let up = [0, 1, 0];
        let cameraPosition = [
            cameraMatrix[12],
            cameraMatrix[13],
            cameraMatrix[14],
        ];
        cameraMatrix = matrix4.lookAt(cameraPosition, fPosition, up);
    }


    let viewMatrix = matrix4.inverse(cameraMatrix);
  

    for (let ii = 0; ii < numFs; ++ii) {
        let angle = ii * Math.PI * 2 / numFs;
        let x = Math.cos(angle) * settings.global.radius;
        let y = Math.sin(angle) * settings.global.radius;

        let matrix = matrix4.translate(viewMatrix, x, 0, y);

        gl.uniformMatrix4fv(modelViewMatrix, false, matrix);
        gl.drawArrays(settings.type, 0, settings.positions.coordsData.coordsPair);
    }
}


const vertexShaderCode =`
attribute vec3 a_position; 
attribute vec3 a_color; 

uniform mat4 u_ProjectionMatr; 
uniform mat4 u_ModelViewMatr; 


varying vec4 v_color;   
uniform float u_pointSize;

void main() {
    gl_Position = u_ProjectionMatr * u_ModelViewMatr * vec4(a_position, 1);
    gl_PointSize = u_pointSize;
    v_color = vec4(a_color, 1.0);  
}
`;
const fragmentShaderCode = `
precision mediump float;

varying vec4 v_color; 

void main() {
	gl_FragColor = v_color;
} 
`;

return { main, drawScene }
}
