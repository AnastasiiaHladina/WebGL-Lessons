function circle(r) {
    let coords = [];
    let color = [];
    let i = 0;
    let resolution =  Math.sqrt(2) / Math.PI;

    for (let angle = 0; angle <= 180; angle += resolution) {
        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);
        coords.push(x, y);

        if(angle >= 0 && angle < 60){
            color.push(i+=0.1, 0, 0);
        }
        if(angle >= 60 && angle < 120){
            color.push(0, i+=0.1, 0);
        }
        if(angle >= 120 && angle < 180){
            color.push(0, 0, i+=0.1);
        }
    }

    return {
        coordsData: {
            coords,
            coordsPair: coords.length / 2,
            coordsItemSize: 2,
            coordsLength: coords.length,
        },
        colorData: {
            color,
            colorPair: color.length / 2,
            colorItemSize: 2,
            colorLength: color.length,
        },
    };
}

function triangle() {
    const coords = [
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
    ];
    const color = [
        1, 1, 0,
        1, 0, 0,
        0, 0, 1,
    ];
    return {
        coordsData: {
            coords,
            coordsPair: coords.length / 2,
            coordsItemSize: 2,
            coordsLength: coords.length,
        },
        colorData: {
            color,
            colorPair: color.length / 2,
            colorItemSize: 2,
            colorLength: color.length,
        },
    }
}

function square() {
    const coords = [
        -0.5,  0.5,
        -0.5, -0.5,
        0.5,  0.5,

        -0.5, -0.5,
        0.5, -0.5,
        0.5,  0.5,
    ];
    const color = [
        1, 1, 0,
        1, 0, 0,
        0, 0, 1,

        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];
    return {
        coordsData: {
            coords,
            coordsPair: coords.length/2,
            coordsItemSize: 2,
            coordsLength: coords.length,
        },
        colorData: {
            color,
            colorPair: color.length/2,
            colorItemSize: 2,
            colorLength: color.length,
        }
    };
}

function pyramid() {
    const coords = [
        0.0,  0.5,  0.0,
        -0.5, -0.5,  0.5,
        0.5, -0.5,  0.5,
        0.0,  0.5,  0.0,
        0.5, -0.5,  0.5,
        0.5, -0.5, -0.5,
        0.0,  0.5,  0.0,
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.0,  0.5,  0.0,
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5
    ];
    const color = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,
    ];
    return {
        coordsData: {
            coords,
            coordsPair: coords.length/3,
            coordsItemSize: 3,
            coordsLength: coords.length,
        },
        colorData: {
            color,
            colorPair: color.length/4,
            colorItemSize: 4,
            colorLength: color.length,
        }
    };
}
function sphere() {
    return createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));
    function createFlattenedVertices(gl, vertices) {
        return webglUtils.createBufferInfoFromArrays(
            gl,
            primitives.makeRandomVertexColors(
                primitives.deindexVertices(vertices),
                {
                    vertsPerColor: 6,
                    rand: function(ndx, channel) {
                        return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
                    }
                })
        );
    }
    /*
    let coords = [];
    let color = [];
    let startU = 0;
    let startV = 0;
    let r = 0.5;
    let UResolution = 20;
    let VResolution = 20;
    let endU = Math.PI*2;
    let endV = Math.PI;
    let stepU = (endU-startU)/UResolution;
    let stepV = (endV-startV)/VResolution;
    for(let i = 0;i < UResolution; i++){
        for(let j = 0; j < VResolution; j++){
            let u = i*stepU+startU;
            let v = j*stepV+startV;
            let un = (i+1 === UResolution) ? Math.PI*2 : (i+1)*stepU+startU;
            let vn = (j+1 === VResolution) ? Math.PI : (j+1)*stepV+startV;
            let p0 = (u, v) => { return Math.cos(u) * Math.sin (v) * r, Math.cos (v) * r, Math.sin (u) * Math.sin (v) * r };
            let p1 = (u, vn) => { return Math.cos(u) * Math.sin (vn) * r, Math.cos (vn) * r, Math.sin (u) * Math.sin (vn) * r };
            let p2 = (un, v) => { return Math.cos(un) * Math.sin (v) * r, Math.cos (v) * r, Math.sin (un) * Math.sin (v) * r };
            let p3 = (un, vn) => { return Math.cos(un) * Math.sin (vn) * r, Math.cos (vn) * r, Math.sin (un) * Math.sin (vn) * r };
            coords.push(p0, p2, p1, p3, p1, p2);
            color.push(0.5, 0.5, 0.5);
        }
    }
     */
}
function cube() {
    const coords = [
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    const color = [
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,

        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0
    ];
    const normals = [

        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
    ];
    const texture = [

        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        0.0,  0.0,

        0.0,  1.0,
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,

        1.0,  1.0,
        0.0,  1.0,
        0.0,  0.0,
        1.0,  0.0,

        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        0.0,  0.0,

        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
    ];
    const indices = [
        0,  1, 2,     0,  2, 3,
        4,  5, 6,     4,  6, 7,
        8,  9, 10,    8,  10, 11,
        12, 13, 14,   12, 14, 15,
        16, 17, 18,   16, 18, 19,
        20, 21, 22,   20, 22, 23
    ];
    const axis = [
        1, 0, 0,
       -1, 0, 0,
        0, 1, 0,
        0,-1, 0,
        0, 0, 1,
        0, 0,-1,
    ];
    return {
        coordsData: {
            coords,
            coordsPair: coords.length/3,
            coordsItemSize: 3,
            coordsLength: coords.length,
        },
        colorData: {
            color,
            colorPair: color.length/3,
            colorItemSize: 3,
            colorLength: color.length,
        },
        normalsData: {
            normals,
            normalsPair: normals.length/3,
            normalsItemSize: 3,
            normalsLength: normals.length,
        },
        textureData: {
           texture,
           texturePair: texture.length/2,
           textureItemSize: 2,
           textureLength: texture.length,
        },
        indicesData: {
            indices,
            indicesItemSize: 1,
            indicesLength: indices.length,
        },
        axis: {
            axis,
            axisItemSize: 3,
            axisLength: axis.length,
        }
    };
}

function letterF(){
    const coords = [

        0,    0,    0,
        0,    1.5,  0,
        0.3,  0,    0,
        0,    1.5,  0,
        0.3,  1.5,  0,
        0.3,  0,    0,

        0.3,  0,    0,
        0.3,  0.3,  0,
        1,    0,    0,
        0.3,  0.3,  0,
        1,    0.3,  0,
        1,    0,    0,

        0.3,  0.6,  0,
        0.3,  0.9,  0,
        0.67, 0.6,  0,
        0.3,  0.9,  0,
        0.67, 0.9,  0,
        0.67, 0.6,  0,

        0,    0,    0.3,
        0.3,  0,    0.3,
        0,    1.5,  0.3,
        0,    1.5,  0.3,
        0.3,  0,    0.3,
        0.3,  1.5,  0.3,

        0.3,  0,    0.3,
        1,    0,    0.3,
        0.3,  0.3,  0.3,
        0.3,  0.3,  0.3,
        1,    0,    0.3,
        1,    0.3,  0.3,

        0.3,  0.6,  0.3,
        0.67, 0.6,  0.3,
        0.3,  0.9,  0.3,
        0.3,  0.9,  0.3,
        0.67, 0.6,  0.3,
        0.67, 0.9,  0.3,

        0,   0,    0,
        1,   0,    0,
        1,   0,    0.3,
        0,   0,    0,
        1,   0,    0.3,
        0,   0,    0.3,

        1,   0,    0,
        1,   0.3,  0,
        1,   0.3,  0.3,
        1,   0,    0,
        1,   0.3,  0.3,
        1,   0,    0.3,

        0.3, 0.3,  0,
        0.3, 0.3,  0.3,
        1,   0.3,  0.3,
        0.3, 0.3,  0,
        1,   0.3,  0.3,
        1,   0.3,  0,

        0.3,   0.3,  0,
        0.3,   0.6,  0.3,
        0.3,   0.3,  0.3,
        0.3,   0.3,  0,
        0.3,   0.6,  0,
        0.3,   0.6,  0.3,

        0.3,   0.6,   0,
        0.67,  0.6,   0.3,
        0.3,   0.6,   0.3,
        0.3,   0.6,   0,
        0.67,  0.6,   0,
        0.67,  0.6,   0.3,

        0.67,   0.6,  0,
        0.67,   0.9,  0.3,
        0.67,   0.6,  0.3,
        0.67,   0.6,  0,
        0.67,   0.9,  0,
        0.67,   0.9,  0.3,

        0.3,   0.9,   0,
        0.3,   0.9,   0.3,
        0.67,  0.9,   0.3,
        0.3,   0.9,   0,
        0.67,  0.9,   0.3,
        0.67,  0.9,   0,

        0.3,   0.9,   0,
        0.3,   1.5,   0.3,
        0.3,   0.9,   0.3,
        0.3,   0.9,   0,
        0.3,   1.5,   0,
        0.3,   1.5,   0.3,

        0,    1.5,   0,
        0,    1.5,   0.3,
        0.3,  1.5,   0.3,
        0,    1.5,   0,
        0.3,  1.5,   0.3,
        0.3,  1.5,   0,

        0,   0,      0,
        0,   0,      0.3,
        0,   1.5,    0.3,
        0,   0,      0,
        0,   1.5,    0.3,
        0,   1.5,    0,
    ];
    const normals = [
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,

         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,

         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,

         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,

         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,

         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,
         0, 0, -1,

         0, 1, 0,
         0, 1, 0,
         0, 1, 0,
         0, 1, 0,
         0, 1, 0,
         0, 1, 0,

         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,

         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,

         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,

         0, 1, 0,
         0, 1, 0,
         0, 1, 0,
         0, 1, 0,
         0, 1, 0,
         0, 1, 0,

         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,

         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,

         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,
         1, 0, 0,

         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,
         0, -1, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
    ];
    return {
        primitiveName: 'Letter F',
        coordsData: {
            coords,
            coordsPair: coords.length/3,
            coordsItemSize: 3,
            coordsLength: coords.length,
        },
        normalsData: {
            normals,
            colorPair: normals.length/3,
            colorItemSize: 3,
            colorLength: normals.length,
        },
    }
}
function cubeProj() {
    const coords = [

        -0.5, -0.5, 0.5,
        -0.5,  0.5, 0.5,
        0.5,  0.5, 0.5,
        0.5,  0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5,  0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5,

        0.5, -0.5, -0.5,
        0.5, -0.5,  0.5,
        0.5,  0.5,  0.5,
        0.5,  0.5,  0.5,
        0.5,  0.5, -0.5,
        0.5, -0.5, -0.5,

        -0.5, -0.5,  0.5,
        -0.5, -0.5, -0.5,
        -0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5,
        -0.5,  0.5,  0.5,
        -0.5, -0.5,  0.5,

        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5,  0.5,
        0.5, 0.5,  0.5,
        -0.5, 0.5,  0.5,
        -0.5, 0.5, -0.5,

        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        0.5, -0.5,  0.5,
    ];
    const color = [
        1, 1, 0.2,
        1, 1, 0.2,
        1, 1, 0.2,
        1, 1, 0.2,
        1, 1, 0.2,
        1, 1, 0.2,

        0, 0.4, 1,
        0, 0.4, 1,
        0, 0.4, 1,
        0, 0.4, 1,
        0, 0.4, 1,
        0, 0.4, 1,

        0.7, 0.2, 0,
        0.7, 0.2, 0,
        0.7, 0.2, 0,
        0.7, 0.2, 0,
        0.7, 0.2, 0,
        0.7, 0.2, 0,

        0, 1, 0.2,
        0, 1, 0.2,
        0, 1, 0.2,
        0, 1, 0.2,
        0, 1, 0.2,
        0, 1, 0.2,

        0.6, 0, 0.6,
        0.6, 0, 0.6,
        0.6, 0, 0.6,
        0.6, 0, 0.6,
        0.6, 0, 0.6,
        0.6, 0, 0.6,

        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5
    ];
    const colorCamera = [
        1, 0, 0.2,
        1, 0, 0.2,
        1, 0, 0.2,
        1, 0, 0.2,
        1, 0, 0.2,
        1, 0, 0.2,

        0.5, 0, 0,
        0.5, 0, 0,
        0.5, 0, 0,
        0.5, 0, 0,
        0.5, 0, 0,
        0.5, 0, 0,

        0.7, 0.2, 0,
        0.7, 0.2, 0,
        0.7, 0.2, 0,
        0.7, 0.2, 0,
        0.7, 0.2, 0,
        0.7, 0.2, 0,

        0.7, 0, 0.5,
        0.7, 0, 0.5,
        0.7, 0, 0.5,
        0.7, 0, 0.5,
        0.7, 0, 0.5,
        0.7, 0, 0.5,

        0.7, 0.4, 0.2,
        0.7, 0.4, 0.2,
        0.7, 0.4, 0.2,
        0.7, 0.4, 0.2,
        0.7, 0.4, 0.2,
        0.7, 0.4, 0.2,

        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5,
        0.4, 0.4, 0.5
    ];
    return {
        coordsData: {
            coords,
            coordsPair: coords.length / 3,
            coordsItemSize: 3,
            coordsLength: coords.length,
        },
        colorData: {
            color,
            colorPair: color.length/3,
            colorItemSize: 3,
            colorLength: color.length,
        },
        colorCameraData: {
            colorCamera,
            colorPair: colorCamera.length/3,
            colorItemSize: 3,
            colorLength: colorCamera.length,
        },
    };
}
