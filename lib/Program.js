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

        this._attributeLocations = {};
        this._uniformLocations = {};
    }

    use(){
        this._context.gl.useProgram(this._program);
    }

    dispose() {
        let gl = this._context.gl;

        gl.deleteProgram(this._program);
        this._shaders.forEach(s => s.dispose());
    }

    /**
     *
     * @param {string} name
     */
    getAttributeLocation(name){
        if(name in this._attributeLocations)
            return this._attributeLocations[name];

        let gl = this._context.gl;
        let location = gl.getAttribLocation(this._program, name);
        if(location === -1)
            throw new Error(`Vertex shader does not have attribute ${name}`);

        this._attributeLocations[name] = location;

        return location;
    }
}