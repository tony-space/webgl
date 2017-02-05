'use strict';

import Shader from './Shader';
import Program from './Program';
import Mesh from './Mesh';

/**
 * The most important class of entire library
 */
class Context {
    /**
     * @param {HTMLCanvasElement} canvas Where image should be rendered
     */
    constructor(canvas) {
        this._gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!this._gl) {
            throw new Error('Unable to initialize WebGL context');
        }
        let gl = this.gl;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }

    get gl() {
        return this._gl;
    }

    /**
     * @param {string} srcURI
     * @param {Number} type
     * @returns {Promise<Shader>}
     */
    createShader(srcURI, type) {
        return fetch(srcURI)
            .then(response => response.text())
            .then(source => {
                let gl = this.gl;
                let shader = gl.createShader(type);
                if (!shader) {
                    return Promise.reject(new Error(`invalid type: '${type}'`));
                }

                gl.shaderSource(shader, source);
                gl.compileShader(shader);

                let failed = !gl.getShaderParameter(shader, gl.COMPILE_STATUS);
                if (failed) {
                    let log = gl.getShaderInfoLog(shader);
                    gl.deleteShader(shader);
                    return Promise.reject(new Error(log));
                }

                return new Shader(this, shader);
            });
    }

    /**
     * @param {Array<Shader>} shaders
     * @returns {Promise<Program>}
     */
    createProgram(shaders) {
        if (!shaders || !(shaders instanceof Array) || shaders.length === 0)
            return Promise.reject(new Error('Invalid argument'));

        return Promise.all(shaders)
            .then(shaders => {
                if (shaders.some(s => !(s instanceof Shader)))
                    return Promise.reject(new Error('Promise returned invalid value'));

                if (shaders.some(s => s.context !== this))
                    return Promise.reject(new Error('Shader belongs to other context'));

                let gl = this.gl;

                let program = gl.createProgram();
                if (!program) {
                    return Promise.reject(new Error('Shader program cannot be created'));
                }
                shaders.forEach(s => gl.attachShader(program, s.shader));

                gl.linkProgram(program);
                gl.validateProgram(program);

                let failed = !gl.getProgramParameter(program, gl.LINK_STATUS);
                if(failed){
                    let log = gl.getProgramInfoLog(program);
                    gl.deleteProgram(program);
                    shaders.forEach(s => s.dispose());
                    return Promise.reject(new Error(log));
                }

                return new Program(this, shaders, program);
            });
    }

    /**
     * @param {Program} program
     * @returns {Mesh}
     */
    createMesh(program){
        let valid = program instanceof Program && program.context === this;
        if(!valid)
            throw new TypeError('invalid program');

        return new Mesh(this, program);
    }
}

export default Context;