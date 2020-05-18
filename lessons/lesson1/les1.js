

class Lesson1 {
    constructor(gl, shaders, type) {
        this.coord = [
            -0.5, -0.5,
            -0.5,  0.5,
            0.5,  0.5,

            0.5,  0.5,
            0.5, -0.5,
            -0.5, -0.5,
        ];
        this.vertexShaderCode = shaders.vertexShaderCode;
        this.fragmentShaderCode = shaders.fragmentShaderCode;
        this.gl = gl;
        this.type = type;
        this.pointS = 1.0;
        this.getProjectionMatrix();

        this.initVariable();
        this.createBuffer();

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.vertexAttribPointer( this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0 );

        gl.uniform1f(pointSize, this.pointS);
        this.clear();
        this.draw();
    }

    initVariable() {
        this.vertexShader = InitShaders(gl, fragmentShaderCode);
        this.fragmentShader = InitShaders(gl, vertexShaderCode);
        this.program = createProgram(gl, vertexShader, fragmentShader);
        this.positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        this.pointSize = gl.getUniformLocation(program,"u_pointSize");
        this.pointS = 0.1;
        gl.useProgram(this.program);
    }

    createBuffer() {
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.coord), this.gl.STATIC_DRAW);
    }

    clear() {
        this.gl.clearColor(1, 1, 1, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    getProjectionMatrix() {
        this.projectionMatrix = resize(this.gl, null, this.maxSide);
    }

    draw() {
        let _offset = 0;
        let count = 6;
        this.gl.drawArrays(this.type, _offset, count);
    }

    getMaxCoord() {
        let maxCoord = positions[0];
        let step = 0;//0,1
        for(let i = 0; i < positions.length; i++){
            if(maxCoord < positions[i]) maxCoord = positions[i];
            step++;
        }
        return maxCoord * 2;
    }

    setType(type){
        this.type = type;
    }
}