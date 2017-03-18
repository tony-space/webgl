'use strict';

import Context from '../../webgl-library/Context';
import Matrix from '../../webgl-library/Matrix';
import Quaternion from '../../webgl-library/Quaternion';
import ObjFile from '../../webgl-library/ObjFile';

let canvas = document.getElementById('glcanvas');
let ctx = new Context(canvas);

let objPromise = ObjFile.loadAsync('./obj/bunny.obj');
let vertexShaderPromise = ctx.createShader('./shaders/vertex.glsl', ctx.gl.VERTEX_SHADER);
let fragmentShaderPromise = ctx.createShader('./shaders/fragment.glsl', ctx.gl.FRAGMENT_SHADER);
let programPromise = ctx.createProgram([vertexShaderPromise, fragmentShaderPromise]);

Promise.all([objPromise, programPromise]).then(results => {
    let objFile = results[0];
    let program = results[1];

    const gl = ctx.gl;
    gl.enable(gl.CULL_FACE);
    let mesh = ctx.createMesh(program);

    mesh.loadAttribute3f('aPosition', objFile.getVerticesArray().reduce((r, v) => r.concat([v.getValue(0), v.getValue(1), v.getValue(2)]), []));
    mesh.loadAttribute3f('aNormal', objFile.getNormalsArray().reduce((r, v) => r.concat([v.getValue(0), v.getValue(1), v.getValue(2)]), []));

    mesh.setBufferData({
        bufferName: 'triangles',
        target: gl.ELEMENT_ARRAY_BUFFER,
        data: new Uint16Array(objFile.getTrianglesArray()),
        usage: gl.STATIC_DRAW,
        dataType: gl.UNSIGNED_SHORT,
        mode: gl.TRIANGLES
    });

    mesh.setBufferData({
        bufferName: 'lines',
        target: gl.ELEMENT_ARRAY_BUFFER,
        data: new Uint16Array(objFile.getLinesArray()),
        usage: gl.STATIC_DRAW,
        dataType: gl.UNSIGNED_SHORT,
        mode: gl.LINES
    });

    const perspective = Matrix.perspective(60, canvas.width / canvas.height, 0.001, 100.0);
    mesh.setUniformMatrix('uProjection', perspective);
    return mesh;
}).then(mesh => {
    const gl = ctx.gl;
    let translate = Matrix.vector([0, 0, -0.25]);
    let rotation = Quaternion.rotateRadians(Matrix.vector([0, 0, 0]), 0);
    render();

    canvas.addEventListener('mousemove', function (event) {
        const leftMouseButton = event.buttons & 1;
        if (!leftMouseButton) return;

        rotation = Quaternion.rotateDegrees(Matrix.vector([1, 0, 0]), event.clientY)
            .mult(Quaternion.rotateDegrees(Matrix.vector([0, 1, 0]), event.clientX * 0.75));

        render();
    });

    canvas.addEventListener('wheel', function (event) {
        if (event.deltaY === 0) return;

        if (event.deltaY > 0)
            translate.setValue(2, translate.getValue(2) * 1.05);
        else
            translate.setValue(2, translate.getValue(2) / 1.05);

        render();
    });

    function render() {
        mesh.setUniformMatrix('uModel', Matrix.translate(Matrix.vector([0, -0.075, 0])));
        mesh.setUniformMatrix('uView', Matrix.translate(translate).mult(rotation.toMatrix()));
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mesh.render('triangles');
        //mesh.render('lines');
    }
});