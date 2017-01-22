'use strict';

import Context from '../lib/Context'
import Matrix from '../lib/Matrix'

let canvas = document.getElementById('glcanvas');

let ctx = new Context(canvas);

let vertexShaderPromise = ctx.createShader('./shaders/vertex.glsl', ctx.gl.VERTEX_SHADER);
let fragmentShaderPromise = ctx.createShader('./shaders/fragment.glsl', ctx.gl.FRAGMENT_SHADER);
let programPromise = ctx.createProgram([vertexShaderPromise, fragmentShaderPromise]);

let vertexData = [
    -1, -1, 0,
    1, -1, 0,
    1, 1, 0,
    -1, 1, 0
];

let colorData = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 1.0, 1.0
];

let indices = [
    0, 1, 2,
    0, 2, 3
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
        mode: gl.TRIANGLES
    });

    mesh.setAttribute({
        buffer: 'vertices',
        attribute: 'vPosition'
    });

    mesh.setAttribute({
        buffer: 'colors',
        attribute: 'vColor'
    });

    let angle = 0;
    let rotation = Matrix.identity();
    setInterval(function(){
        angle++;
        let cos = Math.cos(angle / 180 * Math.PI);
        let sin = Math.sin(angle / 180 * Math.PI);
        rotation.setValue(0, 0, cos);
        rotation.setValue(0, 2, sin);
        rotation.setValue(2, 0, -sin);
        rotation.setValue(2, 2, cos);
        mesh.setUniformMatrix('modelView', translate.mult(rotation));
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mesh.render('indices');
    }, 0);


}).catch(console.log);