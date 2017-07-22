'use strict';

class Shader {
    /**
     * @param {Context} context
     * @param {WebGLShader} shader
     */
    constructor(context, shader) {
        this._context = context;
        this._shader = shader;
    }

    /**
     * @returns {Context}
     */
    get context(){
        return this._context;
    }

    /**
     * @returns {WebGLShader}
     */
    get shader(){
        return this._shader;
    }

    /**
     * Correctly deletes shader from WebGL context
     */
    dispose(){
        let gl = this._context.gl;
        gl.deleteShader(this._shader);
    }
}

export default Shader;