function createShader(gl, shaderType, shaderSource) {
  let shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    console.log("---> Ошибка: компиляция шейдера не удалась:\n" + gl.getShaderInfoLog(shader));
  }
 
  return shader;
}



function createShaderFromScript(gl, shaderType, scriptId) {
  let shaderScript = document.getElementById(scriptId);
  if (!shaderScript) {
    console.log("---> Ошибка: не найден тег скрипта " + scriptId);
  }

  let shaderSource = shaderScript.text;

  if (!shaderType) {
    if (shaderScript.type == "x-shader/x-vertex") {
      shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type == "x-shader/x-fragment") {
      shaderType = gl.FRAGMENT_SHADER;
    } else if (!shaderType) {
      throw("---> Ошибка: не задан тип шейдера");
    }
  }
 
  return createShader(gl, shaderType, shaderSource);
};







