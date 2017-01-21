'use strict';

import Context from '../lib/Context'

let ctx = new Context(document.getElementById('glcanvas'));

let vertexShaderPromise = ctx.createShader('./shaders/vertex.glsl', ctx.gl.VERTEX_SHADER);
let fragmentShaderPromise = ctx.createShader('./shaders/fragment.glsl', ctx.gl.FRAGMENT_SHADER);
let programPromise = ctx.createProgram([vertexShaderPromise, fragmentShaderPromise]);

programPromise.then(program => {
    console.log(program);
    program.dispose();
    program.dispose();
}).catch(console.log);

