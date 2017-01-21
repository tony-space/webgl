'use strict';

export default class Program {
    /**
     *
     * @param {Context} context
     * @param {Array<Shader>}shaders
     * @param {WebGLProgram} program
     */
    constructor(context, shaders, program) {
        this._context = context;
        this._shaders = shaders;
        this._program = program;
    }

    dispose() {
        let gl = this._context.gl;

        gl.deleteProgram(this._program);
        this._shaders.forEach(s => s.dispose());
    }
}