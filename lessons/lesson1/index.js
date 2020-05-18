function lesson1(){
let pointSize;
function main(){
	let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
	let program = createProgram(gl, vertexShader, fragmentShader);
	let positionAttributeLocation = gl.getAttribLocation(program, "a_position"); 
	pointSize = gl.getUniformLocation(program,"u_pointSize");


	gl.useProgram(program);

	let positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(settings.positions.coordsData.coords), gl.STATIC_DRAW);

	let size = 2;
	let type = gl.FLOAT;
	let normalize = false;
	let stride = 0;
	let offset = 0;
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.vertexAttribPointer(
		positionAttributeLocation,
		size,
		type,
		normalize,
		stride,
		offset
	);




	gl.clearColor(1, 1, 1, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	drawScene();
}

function drawScene(){
	let pointS = 12.0;
	if(settings.type === settings.typePrimitive.points) pointS = 12.0;
	gl.uniform1f(pointSize, pointS);
	gl.drawArrays(settings.type, 0, settings.positions.coordsData.coordsPair);
}

const vertexShaderCode = ` 

    attribute vec2 a_position; 
    uniform float u_pointSize;

    void main() {
 
	    gl_Position = vec4(a_position, 0, 1);
		gl_PointSize = u_pointSize;
    }
`;
const fragmentShaderCode = ` 
precision mediump float;
	void main(){ 
		gl_FragColor = vec4(1, 0, 0.5, 1);  
	}
`;

return { main, drawScene }

}
