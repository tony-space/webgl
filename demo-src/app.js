'use strict';

import Context from '../webgl-library/Context';
import Matrix from '../webgl-library/Matrix';
import Quaternion from '../webgl-library/Quaternion';
import ObjFile from '../webgl-library/ObjFile';

let canvas = document.getElementById('glcanvas');
let ctx = new Context(canvas);

let objPromise = ObjFile.loadAsync('./demo-src/obj/bunny.obj');
let vertexShaderPromise = ctx.createShader('./demo-src/shaders/vertex.glsl', ctx.gl.VERTEX_SHADER);
let fragmentShaderPromise = ctx.createShader('./demo-src/shaders/fragment.glsl', ctx.gl.FRAGMENT_SHADER);
let programPromise = ctx.createProgram([vertexShaderPromise, fragmentShaderPromise]);

Promise.all([objPromise, programPromise]).then(results => {
    let objFile = results[0];
    let program = results[1];

    const gl = ctx.gl;
    gl.enable(gl.CULL_FACE);

    const translate = Matrix.translate(Matrix.vector([0, -0.1, -0.25]));
    const perspective = Matrix.perspective(60, canvas.width / canvas.height, 0.1, 100.0);

    let mesh = ctx.createMesh(program);

    mesh.setUniformMatrix('projection', perspective);
    mesh.loadAttribute3f('vPosition', objFile.vertices);
    mesh.loadAttribute3f('vColor', objFile.vertices.map(v => 1));

    mesh.setBufferData({
        bufferName: 'triangles',
        target: gl.ELEMENT_ARRAY_BUFFER,
        data: new Uint16Array(objFile.triangles),
        usage: gl.STATIC_DRAW,
        dataType: gl.UNSIGNED_SHORT,
        mode: gl.TRIANGLES
    });

    mesh.setBufferData({
        bufferName: 'lines',
        target: gl.ELEMENT_ARRAY_BUFFER,
        data: new Uint16Array(objFile.lines),
        usage: gl.STATIC_DRAW,
        dataType: gl.UNSIGNED_SHORT,
        mode: gl.LINES
    });

    let rotation = Quaternion.rotateDegrees(Matrix.vector([0, 0, 0]), 0);
    setInterval(function () {
        rotation = rotation.mult(Quaternion.rotateDegrees(Matrix.vector([0, 1, 0]), 0.1));
        mesh.setUniformMatrix('modelView', translate.mult(rotation.toMatrix()));
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //mesh.render('triangles');
        mesh.render('lines');
    }, 0);
});