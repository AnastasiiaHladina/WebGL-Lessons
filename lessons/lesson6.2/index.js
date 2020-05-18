function lesson6_2(){

let pointSize, texture;
let nMatrixUniform, samplerUniform, lightingDirectionUniform,
    directionalColorUniform, ambientColorUniform,
    modelViewMatrix, useLightingUniform;

function main() {
    settings.global.translate[2] = -3;
	let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
	let program = createProgram(gl, vertexShader, fragmentShader); 
 
    gl.useProgram(program);
    gl.frontFace(gl.CCW);
    gl.enable(gl.DEPTH_TEST);
    let vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition"); 
    let vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal"); 
    let textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord"); 
    let osiAttribute = gl.getAttribLocation(program, "aOsi"); 
    let pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
    modelViewMatrix = gl.getUniformLocation(program, "uMVMatrix");
    nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
    samplerUniform = gl.getUniformLocation(program, "uSampler"); 
    ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
    lightingDirectionUniform = gl.getUniformLocation(program, "uLightingDirection");
    directionalColorUniform = gl.getUniformLocation(program, "uDirectionalColor");
    useLightingUniform = gl.getUniformLocation(program, "uUseLighting");

    gl.uniformMatrix4fv(pMatrixUniform, false, settings.matrix.projection);

    let cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    let cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray( vertexNormalAttribute);
    gl.vertexAttribPointer( vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    let cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    gl.enableVertexAttribArray( textureCoordAttribute);
    gl.vertexAttribPointer( textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);

    initTexture();  
}



function drawScene(){

    gl.clearColor(0.8, 0.8, 0.8, 1); 
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let pointS = 12.0;
    if(settings.type === settings.typePrimitive.points) pointS = 12.0;
    gl.uniform1f(pointSize, pointS);

    if(settings.checkbox.light)
        gl.uniform1i(useLightingUniform, settings.checkbox.light);
    gl.uniformMatrix4fv(modelViewMatrix, false, settings.matrix.modelView);
    gl.uniform1f(pointSize, pointS);

    let normalMatrix = mat3.create();
    mat4.toInverseMat3(settings.matrix.modelView, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(nMatrixUniform, false, normalMatrix);  

    let adjustedLD = vec3.create(); 
    vec3.normalize(settings.global.lightingDirection, adjustedLD);
    vec3.scale(adjustedLD, -1);


    gl.uniform3fv( lightingDirectionUniform, adjustedLD);

    gl.uniform3fv( directionalColorUniform, new Float32Array(settings.global.lightingDirColor));

    gl.uniform3fv( ambientColorUniform, new Float32Array(settings.global.ambientColor));

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}
 


function update(angle) {
    settings.global.rotation[0] = degreesToRadians(angle);
    settings.global.rotation[1] = degreesToRadians(angle);
    settings.global.rotation[2] = degreesToRadians(angle);

    setMatrix(drawScene);
}

function returnMaxCoord(){ 
    let maxCoord = vertices[0];
    for(let i = 0; i < vertices.length - 1; i++){
        if(maxCoord < vertices[i]) maxCoord = vertices[i];
    }
    return maxCoord;
}


function initTexture(){
    let image = new Image();
    image.src = "./materials/texture/7.jpg";
    image.onload = function() {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(samplerUniform, 0);
        setMatrix(drawScene );
    }
}

const vertexShaderCode =`
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat3 uNMatrix; 
    uniform vec3 uAmbientColor; 
    uniform vec3 uLightingDirection;
    uniform vec3 uDirectionalColor; 
    uniform bool uUseLighting;

    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;

        if (!uUseLighting) {
            vLightWeighting = vec3(1.0, 1.0, 1.0);
        } else {
            vec3 transformedNormal = uNMatrix * aVertexNormal;
            float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
            vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
        }
    }
`;
const fragmentShaderCode = `
precision mediump float;

    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;

    uniform sampler2D uSampler;

    void main(void) {
        vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
    }
`;
let osi = [
    1, 0, 0,
    -1, 0, 0,
    0, 1, 0,
    0,-1, 0,
    0, 0, 1,
    0, 0,-1,
];
let vertices = [
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
];
let vertexNormals = [
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
];
let textureCoords = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
];
let cubeVertexIndices = [
    0,  1,  2,    0,  2,  3,
    4,  5,  6,    4,  6,  7,
    8,  9,  10,   8,  10, 11,
    12, 13, 14,   12, 14, 15,
    16, 17, 18,   16, 18, 19,
    20, 21, 22,   20, 22, 23,
];

return { main, update, returnMaxCoord, drawScene }
}
