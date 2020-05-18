function lesson2(){

const textureCoord = [
	0.0,  0.0,
	1.0,  0.0,
	0.0,  1.0,

	0.0,  1.0,
	1.0,  0.0,
	1.0,  1.0,
];
let kernelWeightLocation; 
let resolutionLocation, textureSizeLocation, kernelLocation, image, colorRGB;
 
function main() {
	image = new Image(); 
	image.crossOrigin = "";
	image.src = "./texture/rainbow2.jpg";
	image.addEventListener('load', function() {
		console.log("---> Картинка полностью загружена");
	    render(gl);
	}, false);
}

function render() {
	let {vertexShader, fragmentShader} = InitShaders(gl, vertexShaderCode, fragmentShaderCode); 
	let program = createProgram(gl, vertexShader, fragmentShader);
	let positionLocation = gl.getAttribLocation(program, "a_position");
	let texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
	resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
	kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
	kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
	colorRGB = gl.getUniformLocation(program,"x");
	let positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	setRectangle(0, 0, image.width, image.height);
	let texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW);
	let texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	setParemeterForImageAnySize();

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	gl.useProgram(program);
	gl.enableVertexAttribArray(positionLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


	gl.enableVertexAttribArray(texCoordLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	gl.uniform2f(resolutionLocation, image.width, image.height);
	gl.uniform2f(textureSizeLocation, image.width, image.height);

	drawScene("normal", 0); 
}

function drawScene(name, color){
	gl.clearColor(1, 1, 1, 1);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	gl.uniform1fv(kernelLocation, kernels[name]);
	gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));
	gl.uniform1i(colorRGB, color);

	gl.drawArrays(gl.TRIANGLES, 0, 6);	
}
  

function setParemeterForImageAnySize(){
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function setRectangle(x, y, width, height) {
  let x1 = x;
  let x2 = x + width;
  let y1 = y;
  let y2 = y + height; 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}


function computeKernelWeight(kernel){
	let weight = kernel.reduce(function(prev, curr){
		return prev + curr;
	});
	return weight <= 0 ? 1 : weight;
}

const vertexShaderCode = `

attribute vec2 a_position; 
attribute vec2 a_texCoord; 
uniform vec2 u_resolution;
varying vec2 v_texCoord; 

    void main() { 

        vec2 zeroToOne = a_position / u_resolution;
     
        vec2 zeroToTwo = zeroToOne * 2.0; 
        vec2 clipSpace = zeroToTwo - 1.0;
//vec2 clipSpace = zeroToTwo ;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); 
        v_texCoord = a_texCoord;
    }`;
const fragmentShaderCode = `
precision mediump float;
uniform sampler2D u_image; 
uniform int x; 
uniform vec2 u_textureSize; 
uniform float u_kernel[9];  
uniform float u_kernelWeight;   
varying vec2 v_texCoord; 

    void main() { 
        vec2 onePixel = vec2(1.0, 1.0) / u_textureSize; 
        vec4 colorSum =
            texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +  
            texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +  
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;   
       if(x == 0){
           gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0); 
        }else if(x == 1){
            gl_FragColor = vec4((colorSum / u_kernelWeight).grb, 1.0);
        }else if(x == 2){
            gl_FragColor = vec4((colorSum / u_kernelWeight).bgr, 1.0);
        }
    }
`;


return { main, returnMaxCoord, drawScene  }
}
