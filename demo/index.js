'use strict';

// import Context from '../lib/Context'
// import Matrix from '../lib/Matrix'
// import Quaternion from '../lib/Quaternion';

let Context = WEBGL;
let Matrix = WEBGL.Matrix;
let Quaternion = WEBGL.Quaternion;

let canvas = document.getElementById('glcanvas');

let ctx = new Context(canvas);

let vertexShaderPromise = ctx.createShader('./shaders/vertex.glsl', ctx.gl.VERTEX_SHADER);
let fragmentShaderPromise = ctx.createShader('./shaders/fragment.glsl', ctx.gl.FRAGMENT_SHADER);
let programPromise = ctx.createProgram([vertexShaderPromise, fragmentShaderPromise]);

let vertexData = [
    -0.5, -0.25, -1,
    -0.5, -0.25, 1,
    -0.5, 0.25, -1,
    -0.5, 0.25, 1,

    0.5, -0.25, -1,
    0.5, -0.25, 1,
    0.5, 0.25, -1,
    0.5, 0.25, 1
];

let colorData = [
    0, 0, 0,
    0, 0, 1,
    0, 1, 0,
    0, 1, 1,

    1, 0, 0,
    1, 0, 1,
    1, 1, 0,
    1, 1, 1
];

let indices = [
    0, 1, 0, 2, 0, 4,
    1, 3, 1, 5,
    2, 3, 2, 6,
    4, 5, 4, 6,
    7, 6, 7, 5, 7, 3
];

const perspective = Matrix.perspective(60, canvas.width / canvas.height, 0.1, 100.0);

programPromise.then(program => {
    let gl = ctx.gl;

    let translate = Matrix.translate(Matrix.vector([0, 0, -5]));

    let mesh = ctx.createMesh(program);
    mesh.setUniformMatrix('projection', perspective);

    mesh.setBufferData({
        bufferName: 'vertices',
        target: gl.ARRAY_BUFFER,
        data: new Float32Array(vertexData),
        usage: gl.STATIC_DRAW,
        dimensions: 3,
        dataType: gl.FLOAT
    });

    mesh.setBufferData({
        bufferName: 'colors',
        target: gl.ARRAY_BUFFER,
        data: new Float32Array(colorData),
        dimensions: 3,
        dataType: gl.FLOAT,
        usage: gl.STATIC_DRAW
    });

    mesh.setBufferData({
        bufferName: 'indices',
        target: gl.ELEMENT_ARRAY_BUFFER,
        data: new Uint16Array(indices),
        usage: gl.STATIC_DRAW,
        dataType: gl.UNSIGNED_SHORT,
        mode: gl.LINES
    });

    mesh.setAttribute({
        buffer: 'vertices',
        attribute: 'vPosition'
    });

    mesh.setAttribute({
        buffer: 'colors',
        attribute: 'vColor'
    });

    let initial = Quaternion.rotateDegrees(Matrix.vector([0, 0, 0]), 0);
    let final = Quaternion.rotateDegrees(Matrix.vector([0, 1, 0]), 135)
        .mult(Quaternion.rotateDegrees(Matrix.vector([0, 0, 1]), 180));

    function interpolateRotation(initial, final, step){
        let delta = initial.conjugate().mult(final);
        let axis = delta.toAxis();
        let radians = axis.length();

        return initial.mult(Quaternion.rotateRadians(axis, radians * step))
    }

    let step = 0;
    let steps = 1000;
    let interval = setInterval(function () {

        let rotation = interpolateRotation(initial, final, step / steps);
        step++;
        if (step > steps)
            clearInterval(interval);

        mesh.setUniformMatrix('modelView', translate.mult(rotation.toMatrix()));
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mesh.render('indices');
    }, 0);


}).catch(console.log);