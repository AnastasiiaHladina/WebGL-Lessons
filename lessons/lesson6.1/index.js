function lesson6_1(){

let pointSize, projectionMatrix, colorLocation,
    modelViewMatrix, reverseLightDirectionLocation;


 function main() {
    let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
    let program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);
    gl.frontFace(gl.CW);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    
    let positionLocation = gl.getAttribLocation(program, "a_position");
    let normalLocation = gl.getAttribLocation(program, "a_normal");
    projectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatr");
    pointSize = gl.getUniformLocation(program,"u_pointSize");

    modelViewMatrix = gl.getUniformLocation(program, "u_worldInverseTranspose");
    reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
    colorLocation = gl.getUniformLocation(program, "u_color");
     gl.uniform4fv(colorLocation, [0.8, 0.2, 0.8, 1]);

    let positionBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(settings.positions.coordsData.coords), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation); 
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

     let normalsBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(settings.positions.normalsData.normals), gl.STATIC_DRAW);
     gl.enableVertexAttribArray(normalLocation);
     gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

    setMatrix(drawScene);
}
 

function drawScene(){

    gl.clearColor(1, 1, 1, 1); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let pointS = 12.0;
    if(settings.type === settings.typePrimitive.points) pointS = 12.0;
    gl.uniform1f(pointSize, pointS);

    let camera = [0, 0, settings.global.camera];
    let target = [0, 0, 0];
    let up = [0, 1, 0];
    let cameraMatrix = matrix4.lookAt(camera, target, up);
    cameraMatrix = matrix4.inverse(cameraMatrix);
    let viewProjectionMatrix = matrix4.multiply(settings.matrix.projection, cameraMatrix);
    viewProjectionMatrix = matrix4.multiply(viewProjectionMatrix, settings.matrix.modelView);
    gl.uniformMatrix4fv(projectionMatrix, false, viewProjectionMatrix);


    let worldInverseMatrix = matrix4.inverse(settings.matrix.modelView);
    worldInverseMatrix = matrix4.transpose(worldInverseMatrix); 
    gl.uniformMatrix4fv(modelViewMatrix, false, worldInverseMatrix);

    gl.uniform3fv(reverseLightDirectionLocation, matrix4.normalize(settings.global.lightingDirection));
    gl.uniformMatrix4fv(modelViewMatrix, false, settings.matrix.modelView);
    gl.drawArrays(settings.type, 0, settings.positions.coordsData.coordsPair);
}

function update(angle) {
    settings.global.rotation[0] = degreesToRadians(angle);
    settings.global.rotation[1] = degreesToRadians(angle);
    settings.global.rotation[2] = degreesToRadians(angle);

    setMatrix(drawScene);
}


function returnMaxCoord(){ 
    let maxCoord = settings.positions.coordsData.coords[0];
    let step = 0;
    for(let i = 0; i < settings.positions.coordsData.coordsLength - 1; i++){
        if(step >= 3){ step = 0; i += 3; }
        if(maxCoord < settings.positions.coordsData.coords[i]) maxCoord = settings.positions.coordsData.coords[i];
        step++;  
    }
    return maxCoord;
}


const vertexShaderCode =`
attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_ProjectionMatr; 
uniform float u_pointSize;        
uniform mat4 u_worldInverseTranspose; 

varying vec3 v_normal; 

void main() {  
    gl_PointSize = u_pointSize;
    gl_Position = u_ProjectionMatr * a_position * vec4(1, -1, 1, 1); 
    v_normal = mat3(u_worldInverseTranspose) * a_normal; 
 
}`;

const fragmentShaderCode = `
  
precision mediump float;
 
varying vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

void main() {
    vec3 normal = normalize(v_normal); 
    float light = dot(normal, u_reverseLightDirection); 
    gl_FragColor = u_color; 
    gl_FragColor.rgb *= light * vec3(1.0, 1.0, 1.0);  
}
`;



return { main, returnMaxCoord, drawScene, update }
}
