'use strict';

import Context from '../../webgl-library/Context';
import Matrix from '../../webgl-library/Matrix';
import Quaternion from '../../webgl-library/Quaternion';

import Lattice from './lattice';

let canvas = document.getElementById('glcanvas');
let ctx = new Context(canvas);

let vertexShaderPromise = ctx.createShader('./shaders/vertex.glsl', ctx.gl.VERTEX_SHADER);
let fragmentShaderPromise = ctx.createShader('./shaders/fragment.glsl', ctx.gl.FRAGMENT_SHADER);


ctx.createProgram([vertexShaderPromise, fragmentShaderPromise]).then(program => {
    let lattice = new Lattice(51, 51);
    lattice.forEach((i, j) => {
        let v = lattice.get(i, j);
        let x = (i - 25) * 0.04;
        let y = (j - 25) * 0.04;
        v.setValue(0, x);
        v.setValue(1, y);
    });

    const gl = ctx.gl;
    let mesh = ctx.createMesh(program);
    mesh.loadAttribute3f('aPosition', lattice.verticesArray());
    mesh.setBufferData({
        bufferName: 'triangles',
        target: gl.ELEMENT_ARRAY_BUFFER,
        data: lattice.trianglesArray(),
        usage: gl.STATIC_DRAW,
        dataType: gl.UNSIGNED_SHORT,
        mode: gl.TRIANGLES
    });

    mesh.setBufferData({
        bufferName: 'lines',
        target: gl.ELEMENT_ARRAY_BUFFER,
        data: lattice.linesArray(),
        usage: gl.STATIC_DRAW,
        dataType: gl.UNSIGNED_SHORT,
        mode: gl.LINES
    });

    const perspective = Matrix.perspective(60, canvas.width / canvas.height, 0.001, 100.0);
    mesh.setUniformMatrix('uProjection', perspective);
    return mesh;

}).then(mesh => {
    const gl = ctx.gl;
    mesh.setUniformMatrix('uModel', Quaternion.rotateDegrees(Matrix.vector([1, 0, 0]), -90).toMatrix());

    let translate = Matrix.vector([0, 0, -3]);
    let rotation = Quaternion.rotateRadians(Matrix.vector([0, 0, 0]), 0);

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

    let triangles = true;


    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 32)
            triangles = !triangles;

        render();
    });

    function render() {
        mesh.setUniformMatrix('uView', Matrix.translate(translate).mult(rotation.toMatrix()));
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (triangles)
            mesh.render('triangles');
        else
            mesh.render('lines');
    }

    render();
});