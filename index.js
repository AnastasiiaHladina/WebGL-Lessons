const gl = InitWebGL();
let settings = {
	lesson: null,
	idLesson: null,
	maxSide: null,
	timerId: null,
	checkTimer: false,
	angle: 0,
	positions: square(),
	type: gl.TRIANGLES,
	checkbox: {
		checkLookAt: false,
		light: false,
		blending: true,
	},
	view: {
		transponation: false,
		primitiveType: false,
		timer: false,
		filter: false,
		camera: false,
		light: false,
		blending: false,
	},
	global: {
		rotation: [
			degreesToRadians(0.01),
			degreesToRadians(0.01),
			degreesToRadians(0.01)],
		scale: [1, 1, 1],
		translate: [0.01, 0.01, -2],
		radius: 3,
		camera: 3,
		lightingDirColor: [1, 1, 1],
		lightingDirection: [0, 0, -1],
		ambientColor: [0, 0, 0],
		blending: 0.4,
	},
	typePrimitive: {
		points: 		gl.POINTS,
		line_strip: 	gl.LINE_STRIP,
		line_loop: 		gl.LINE_LOOP,
		lines: 			gl.LINES,
		triangle_strip: gl.TRIANGLE_STRIP,
		triangle_fan: 	gl.TRIANGLE_FAN,
		triangles: 		gl.TRIANGLES,
	},
	matrix: {
		modelView: [],
		projection: [],
	},
	L: {
		lesson0_1,
		lesson1,
		lesson2,
		lesson3,
		lesson4_1,
		lesson4_2,
		lesson5,
		lesson6_1,
		lesson6_2,
		lesson7,
		lesson8_1,
		lesson8_2,
		lesson8_3,
		lesson9,
	}
};
figureButton();

function setLessons(id) {
	let id_for_resize;
	settings.lesson = null;
	settings.idLesson = id;
	if(id === 0.1){
		id_for_resize = 1;
		settings.global.translate = [0,0,0];
		setViewSettings(
			false,
			false,
			false,
			false,
			false,
			false,
			false
		);
		settings.lesson = settings.L.lesson0_1();
	}
	if(id === 1){
		id_for_resize = null;
		setViewSettings(
			false,
			true,
			false,
			false,
			false,
			false,
			false
		);
		getCoord('square');
		settings.lesson = settings.L.lesson1();
	}
	else if(id === 2){
		id_for_resize = null;
		setViewSettings(
			false,
			true,
			true,
			false,
			false,
			false,
			false
		);
		settings.lesson = settings.L.lesson2();
	}
	else if(id === 3){
		id_for_resize = 1;
		setViewSettings(
			true,
			true,
			false,
			false,
			false,
			false,
			false
		);
		getCoord('square');
		settings.lesson = settings.L.lesson3();
	}
	else if(id === 4.1){
		id_for_resize = 1;
		settings.global.translate = [0.01, 0.01, 0];
		setViewSettings(
			true,
			true,
			false,
			true,
			false,
			false,
			false
		);
		getCoord('cubeProj');
		settings.lesson = settings.L.lesson4_1();
	} 
	else if(id === 4.2){
		id_for_resize = 2;
		settings.global.translate = [0.01, 0.01, -2];
		setViewSettings(
			true,
			true,
			false,
			true,
			false,
			false,
			false
		);
		getCoord('cubeProj');
		settings.lesson = settings.L.lesson4_2();
	} 
	else if(id === 5){
		id_for_resize = 2;
		setViewSettings(
			false,
			true,
			false,
			false,
			true,
			false,
			false
		);
		getCoord('cubeProj');
		settings.lesson = settings.L.lesson5();
	}
	else if(id === 6.1){
		id_for_resize = 2;
		setViewSettings(
			true,
			true,
			false,
			true,
			true,
			true,
			false
		);
		getCoord('F');
		settings.lesson = settings.L.lesson6_1();
	}
	else if(id === 6.2){
		id_for_resize = 2;
		setViewSettings(
			true,
			true,
			false,
			true,
			false,
			true,
			false
		);
		getCoord('cube');
		settings.lesson = settings.L.lesson6_2();
	} 
	else if(id === 7){ 
		id_for_resize = 2;
		settings.global.radius = 200;
		settings.global.camera = 50;
		setViewSettings(
			false,
			true,
			false,
			true,
			true,
			false,
			false
		);
		settings.lesson = settings.L.lesson7();
	}
	else if(id === 8.1){ 
		id_for_resize = 2;
		settings.global.radius = 360;
		setViewSettings(
			false,
			true,
			false,
			true,
			true,
			false,
			false
		);
		settings.lesson = settings.L.lesson8_1();
	}
	else if(id === 8.2){ 
		id_for_resize = 2;
		settings.global.radius = 360;
		setViewSettings(
			false,
			true,
			false,
			true,
			true,
			false,
			false
		);
		settings.lesson = settings.L.lesson8_2();
	}
	else if(id === 8.3){ 
		id_for_resize = 2;
		settings.global.radius = 360;
		setViewSettings(
			false,
			true,
			false,
			true,
			true,
			false,
			false
		);
		settings.lesson = settings.L.lesson8_3();
	}
	else if(id === 9){
		id_for_resize = 2;
		settings.global.translate = [0, 0, -4];
		settings.global.lightingDirection = [-0.25, -0.25, -4];
		settings.global.lightingDirColor = [0.8, 0.8, 0.8];
		settings.global.ambientColor = [0.3, 0.3, 0.3];
		settings.checkbox.light = true;
		settings.checkbox.blending = true;
		setViewSettings(
			true,
			false,
			false,
			true,
			false,
			true,
			true
		);
		getCoord('cube');
		settings.lesson = settings.L.lesson9();
	}
	settings.maxSide = returnMaxCoord(settings.positions.coordsData)*2;
	settings.matrix.projection = resize(id_for_resize, settings.maxSide);

	window.onresize = function(){
		settings.matrix.projection = resize(id_for_resize, settings.maxSide);
		settings.lesson.main();
	};

	settings.lesson.main();
	opacity(settings.lesson.drawScene);
	figureButton(id);
}


function opacity(callback){
	clearAllFilters();
	if(settings.view.transponation) {
		createS_Transformation(callback );
	}
	if (settings.view.timer) {
		createTimerButton();
	}
	if (settings.view.primitiveType) {
		createRB_Type();
	}
	if(settings.view.filter) {
		createS_Filter(callback);
		createRB_Filter(callback);
	} 
	if(settings.view.camera) {
		createS_Camera(callback, 1, 10);
		createCheckB(callback);
	}
	if(settings.view.light) {
		createS_Camera(callback );
		createS_Light(callback );
		createLight(callback );
		createS_Ambient(callback );
	}
	if(settings.view.blending) {
		createBlending(callback);
		createS_Blending(callback);
	}
} 


function checkTimer() {
	let ButtonTimer = document.getElementById("ButtonTimer");
	if(settings.checkTimer){
		stopTime();
		settings.checkTimer = false;
		ButtonTimer.value = "Включить";
	} else{
		runTime();
		settings.checkTimer = true;
		ButtonTimer.value = "Выключить";
	}
}


function runTime() {
	console.log( 'Таймер включен' ); 
	settings.timerId = setInterval(function() {
		settings.angle += 2;
		settings.angle %= 360;
		settings.lesson.update(settings.angle);
	}, 50);
}


function stopTime() {
	clearInterval(settings.timerId);
	if(settings.lesson.stopUpdate) settings.lesson.stopUpdate();
	console.log( 'Таймер выключен' ); 
}


function clearAllFilters() {
	let x = document.getElementById("x"); 
	let y = document.getElementById("y");
	let z = document.getElementById("z");
	let angleX = document.getElementById("angleX");
	let angleY = document.getElementById("angleY");
	let angleZ = document.getElementById("angleZ");
	let scaleX = document.getElementById("scaleX");
	let scaleY = document.getElementById("scaleY");
	let scaleZ = document.getElementById("scaleZ");
	let view = document.getElementById("view");
	let texture = document.getElementById("texture");
	let timer = document.getElementById("timer");
	let camera = document.getElementById("camera");
	let radius = document.getElementById("radius");
	let lookAt = document.getElementById("lookAt");
	let light = document.getElementById("light");
	let checkBlending = document.getElementById("checkBlending");
	let transparentBlending = document.getElementById("transparentBlending");

	x.innerHTML = ""; 
	y.innerHTML = "";
	z.innerHTML = "";
	angleX.innerHTML = "";
	angleY.innerHTML = "";
	angleZ.innerHTML = "";
	scaleX.innerHTML = "";
	scaleY.innerHTML = "";
	scaleZ.innerHTML = "";
	view.innerHTML = "";
	texture.innerHTML = ""; 
	timer.innerHTML = ""; 
	camera.innerHTML = ""; 
	radius.innerHTML = ""; 
	lookAt.innerHTML = "";
	light.innerHTML = "";
	checkBlending.innerHTML = "";
	transparentBlending.innerHTML = "";
}


function figureButton(id) {
	let figureArr = [
		document.getElementById("square"),
		document.getElementById("triangle"),
		document.getElementById("circle"),
		document.getElementById("cube"),
		document.getElementById("pyramid"),
		document.getElementById("scope"),
	];

	if(!settings.lesson){
		turn(0,0, figureArr);
	} else {
		switch (id) {
			case 1:
				turn(0,3, figureArr);
				break;
			case 3:
				turn(0,3, figureArr);
				break;
			case 4.1:
				turn(3,6, figureArr);
				break;
			case 4.2:
				turn(3,6, figureArr);
				break;
			default:
				turn(0,0, figureArr);
				break;
		}
	}
}


function turn(start, end, arr) {
	for(let i = 0; i < arr.length; i++){
		arr[i].disabled = true;
		if(i >= start && i < end) {
			arr[i].disabled = false;
		}
	}
}


function getCoord(viewCoord){
	switch (viewCoord) {
		case 'square':
			settings.positions = square();
			break;
		case 'triangle':
			settings.positions = triangle();
			break;
		case 'circle':
			settings.positions = circle(0.3);
			break;
		case 'cube':
			settings.positions = cube();
			break;
		case 'pyramid':
			settings.positions = pyramid();
			break;
		case 'scope':
			settings.positions = sphere();
			break;
		case 'F':
			settings.positions = letterF();
			break;
		case 'cubeProj':
			settings.positions = cubeProj();
			break;
	}
	if(settings.lesson) {
		settings.lesson.main();
	}
}


function setViewSettings(transponation, primitiveType, filter, timer, camera, light, blending){
	settings.view.transponation = transponation;
	settings.view.primitiveType = primitiveType;
	settings.view.filter = filter;
	settings.view.timer = timer;
	settings.view.camera = camera;
	settings.view.light = light;
	settings.view.blending = blending;
}
