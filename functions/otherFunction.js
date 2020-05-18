
function radiansToDegrees(r) {
	return r * 180 / Math.PI;
}

function degreesToRadians(d) {
	return d * Math.PI / 180;
}

function printM(matr) {
  const n = Math.floor(Math.sqrt(matr.length));
} 

function rand(min, max) {
return Math.random() * (max - min) + min;
}

function emod(x, n) {
return x >= 0 ? (x % n) : ((n - (-x % n)) % n);
}
function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
	let matrix = m4.translate(viewProjectionMatrix,
		translation[0],
		translation[1],
		translation[2]);
	matrix = m4.xRotate(matrix, xRotation);
	return m4.yRotate(matrix, yRotation);
}
function returnMaxCoordAfterThree(arr){
	let maxCoord = arr[0];
	let step = 0;
	for(let i = 0; i < arr.length - 1; i++){
		if(step >= 3){ step = 0; i += 3; }
		if(maxCoord < arr[i]) maxCoord = arr[i];
		step++;
	}
	return maxCoord;
}
function returnMaxCoord(arr){
	let maxCoord = arr.coords[0];
	let step = 0;//0,1
	for(let i = 0; i < arr.coordsLength; i++){
		if(maxCoord < arr.coords[i]) maxCoord = arr.coords[i];
		step++;
	}
	return maxCoord;
}
