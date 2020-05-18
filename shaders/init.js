function InitShaders(gl, vertexShaderCode, fragmentShaderCode){
	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);
	return {vertexShader, fragmentShader};
}

function InitWebGL(){ 
	let canvas = document.getElementById("canvas");
	let gl = canvas.getContext("webgl", {
	 	alpha: true,
		premultipliedAlpha: false
	});
	if(!gl){
		console.log("WebGL не работает!");
		return;
	}
	return gl;
}
