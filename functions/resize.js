
function resize(id, maxSide){
	let fAspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	gl.canvas.width = window.innerWidth;
	gl.canvas.height = window.innerHeight;
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	if(id===1){
		return resizeOrtho(maxSide, fAspect);
	}
	if(id===2){
		return resizePerspective(maxSide, fAspect);
	}
}


function resizePerspective(maxSide, fAspect){
    let zNear = 1;
    let zFar = 2000;
    let fieldOfViewRadians = [degreesToRadians(100)];
    let PersMatrix = matrix4.perspective(fieldOfViewRadians[0], fAspect, zNear, zFar);
    return PersMatrix;
}


function resizeOrtho(maxSide, fAspect){ 
	maxSide *= 2;
	let orthoMathrix = [];
	if(gl.canvas.width <= gl.canvas.height)
		mat4.ortho(-maxSide, maxSide, -maxSide/fAspect, maxSide/fAspect, -maxSide, maxSide, orthoMathrix);
	else
		mat4.ortho(-maxSide*fAspect, maxSide*fAspect, -maxSide, maxSide, -maxSide, maxSide, orthoMathrix); 
	return orthoMathrix; 
}


function perspective(max_koor, um_max_koor, um_pers){
//max_koor   		переменная - максимальное абсолютное значение между X,Y,Z
//um_max_koor		переменная - доля переднего плана относительно клиентского окна
//um_pers   		переменная- какую долю составляет перспектива относительно переднего плана

	if (max_koor < 0.00001 || um_pers > 0.95 || um_pers < 0.1 || um_max_koor < 0.1 || um_max_koor > 1)
		return false;
	   
	let tg = (1.0/um_pers - 1.0)/2.0;
	ots = -(max_koor/tg + max_koor);
	ugol = 2*Math.atan(tg/um_max_koor)*180.0/Math.PI;

	return { ots, ugol } 
}
