'use strict';

import Context from '../lib/Context'
import Matrix from '../lib/Matrix'

let canvas = document.getElementById('glcanvas');

let ctx = new Context(canvas);

let vertexShaderPromise = ctx.createShader('./shaders/vertex.glsl', ctx.gl.VERTEX_SHADER);
let fragmentShaderPromise = ctx.createShader('./shaders/fragment.glsl', ctx.gl.FRAGMENT_SHADER);
let programPromise = ctx.createProgram([vertexShaderPromise, fragmentShaderPromise]);

programPromise.then(program => {
    let gl = ctx.gl;

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

    let positionBuffer = gl.createBuffer();
    let colorBuffer = gl.createBuffer();
    let indicesBuffer = gl.createBuffer();

    program.use();

    gl.uniformMatrix4fv(program.getUniformLocation("projection"), false,
        new Float32Array(Matrix.perspective(60, canvas.width/ canvas.height, 0.1, 100.0).toArray()));
    gl.uniformMatrix4fv(program.getUniformLocation("modelView"), false, Matrix.translate(Matrix.vector([0, 0, -5])).toArray());

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(program.getAttributeLocation('vPosition'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.getAttributeLocation('vPosition'));

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(program.getAttributeLocation('vColor'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.getAttributeLocation('vColor'));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    gl.finish();

}).catch(console.log);
