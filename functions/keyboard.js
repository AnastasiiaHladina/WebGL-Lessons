let currentlyPressedKeys = {};
function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}
function handleKeys() {
    if (currentlyPressedKeys[33]) {
        z -= 0.05;
    }
    if (currentlyPressedKeys[34]) {
        z += 0.05;
    }
    if (currentlyPressedKeys[37]) {
        ySpeed -= 1;
    }
    if (currentlyPressedKeys[39]) {
        ySpeed += 1;
    }
    if (currentlyPressedKeys[38]) {
        xSpeed -= 1;
    }
    if (currentlyPressedKeys[40]) {
        xSpeed += 1;
    }
}






















/*--------------------------------------------------------*/
function keyboard(window, player){ 
    window.addEventListener('keydown', function(e){
        setKey(e.keyCode);  
        if (isKeyDown('left')){  
            if(globalTransl[0]>=-0.8){
                //console.log(player); 
                globalTransl[0] = -1*((globalTransl[0]*(-1))+0.1); //-0.2+0.1=-0.1 
            } 
        } 
        else if(isKeyDown('right')){ 
            //console.log("right")
            if(globalTransl[0]<=0.8){
                globalTransl[0]+=0.1;//-0.8+0.1 = -0.7 
            } 
        } 
    });
    window.addEventListener('keyup', function(e) {
        clearKey(e.keyCode); 
        if(isKeyUp('left')){ 
            globalTransl[0] = 0; 
        } 
        if(isKeyUp('right')){ 
            globalTransl[0] = 0; 
        } 
    });
}


let keyDown = {};
let keys = {
    'left' : 37,     
    'right': 39, 
}; 
function setKey(keyCode){
    keyDown[keyCode] = true;
}

function isKeyDown(keyName){
    return keyDown[keys[keyName]] == true;
}

function clearKey(keyCode){
    keyDown[keyCode] = false;
}

function isKeyUp(keyName){
    return keyDown[keys[keyName]] == false;
}





