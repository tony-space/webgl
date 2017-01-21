'use strict';

export default class Shader {
    /**
     * @param {Context} context
     * @param {WebGLShader} shader
     */
    constructor(context, shader) {
        this._context = context;
        this._shader = shader;
    }

    get context(){
        return this._context;
    }

    get shader(){
        return this._shader;
    }

    dispose(){
        let gl = this._context.gl;
        gl.deleteShader(this._shader);
    }
}