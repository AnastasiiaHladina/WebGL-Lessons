function lesson9(){
let cubeVertexIndexBuffer, cubeVertexPositionBuffer, cubeVertexNormalBuffer,
    cubeVertexTextureCoordBuffer, glassTexture, program;

    function main() {
        let { vertexShader, fragmentShader } = InitShaders(gl, vertexShaderCode, fragmentShaderCode);
        program = createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);
        gl.frontFace(gl.CCW);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);

        program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.vertexPositionAttribute);

        program.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
        gl.enableVertexAttribArray(program.vertexNormalAttribute);

        program.textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
        gl.enableVertexAttribArray(program.textureCoordAttribute);

        program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
        program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
        program.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
        program.samplerUniform = gl.getUniformLocation(program, "uSampler");
        program.useLightingUniform = gl.getUniformLocation(program, "uUseLighting");
        program.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
        program.lightingDirectionUniform = gl.getUniformLocation(program, "uLightingDirection");
        program.directionalColorUniform = gl.getUniformLocation(program, "uDirectionalColor");
        program.alphaUniform = gl.getUniformLocation(program, "uAlpha");

        cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(settings.positions.coordsData.coords), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(program.vertexPositionAttribute, settings.positions.coordsData.coordsItemSize, gl.FLOAT, false, 0, 0);

        cubeVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(settings.positions.normalsData.normals), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
        gl.vertexAttribPointer(program.vertexNormalAttribute, settings.positions.normalsData.normalsItemSize, gl.FLOAT, false, 0, 0);

        cubeVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(settings.positions.textureData.texture), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        gl.vertexAttribPointer(program.textureCoordAttribute, settings.positions.textureData.textureItemSize, gl.FLOAT, false, 0, 0);

        cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(settings.positions.indicesData.indices), gl.STATIC_DRAW);
        cubeVertexIndexBuffer.numItems = 36;


        let image = new Image();
        image.src = "./materials/texture/10.jpg";
        image.onload = function() {
            glassTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, glassTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(program.samplerUniform, 0);
        };

        setMatrix(drawScene);
    }



    function drawScene() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.uniform1f(program.alphaUniform, settings.global.blending);

        gl.uniform1i(program.useLightingUniform, settings.checkbox.light);
        gl.uniform3f(program.ambientColorUniform, ...settings.global.ambientColor);

        let adjustedLD = vec3.create();
        vec3.normalize(settings.global.lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -1);
        gl.uniform3fv(program.lightingDirectionUniform, adjustedLD);
        gl.uniform3f(program.directionalColorUniform, ...settings.global.lightingDirColor);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        gl.uniformMatrix4fv(program.pMatrixUniform, false, settings.matrix.projection);
        gl.uniformMatrix4fv(program.mvMatrixUniform, false, settings.matrix.modelView);

        let normalMatrix = mat3.create();
        mat4.toInverseMat3(settings.matrix.modelView, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(program.nMatrixUniform, false, normalMatrix);

        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }



    function update(angle) {
        settings.global.rotation[0] = degreesToRadians(angle);
        settings.global.rotation[1] = degreesToRadians(angle);
        settings.global.rotation[2] = degreesToRadians(angle);

        setMatrix(drawScene);
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
              
                  vec3 transformedNormal = uNMatrix * aVertexNormal;
                  float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
                  vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
         } 
    `;
    const fragmentShaderCode = `
        precision mediump float;
         
         varying vec2 vTextureCoord;
         varying vec3 vLightWeighting;
         uniform float uAlpha;
         uniform sampler2D uSampler;
         void main(void) {
            vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
            gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor * uAlpha);
         }
    `;



    return { main, update, drawScene }
}
