'use strict';

import Matrix from './Matrix'

class Mesh {

    /**
     * @param {Context} context
     * @param {Program} program
     */
    constructor(context, program) {
        this._context = context;
        this._program = program;
        this._buffers = {};
    }

    /**
     *
     * @param {string} name
     * @param {Matrix} matrix
     */
    setUniformMatrix(name, matrix) {
        let valid = matrix instanceof Matrix && matrix.rows === matrix.columns && (matrix.rows >= 2 || matrix.rows <= 4);

        if (!valid)
            throw new TypeError('Invalid matrix argument');

        let location = this._program.getUniformLocation(name);
        let gl = this._context.gl;

        this._program.use();
        gl[`uniformMatrix${matrix.rows}fv`](location, false, matrix.toFloat32Array());
    }

    /**
     *
     * @param {string} options.buffer
     * @param {string} options.attribute
     */
    setAttribute(options) {
        if(!options) throw new Error('options expected');
        if(!options.buffer) throw new Error('buffer name expected');
        if(!options.attribute) throw new Error('attribute name expected');

        let gl = this._context.gl;
        let location = this._program.getAttributeLocation(options.attribute);
        let buffer = this._buffers[options.buffer];
        if(!buffer)
            throw new Error('invalid buffer name');

        gl.bindBuffer(buffer.target, buffer.handle);
        gl.vertexAttribPointer(location, buffer.dimensions, buffer.dataType, false, 0, 0);

        this._program.use();
        gl.enableVertexAttribArray(location);
    }

    /**
     * @param {string} options.bufferName
     * @param {number} options.target
     * @param {object} options.data
     * @param {number} options.usage
     * @param {number} [options.dimensions]
     * @param {number} [options.mode]
     * @param {number} options.dataType
     */
    setBufferData(options){
        if(!options) throw new Error('options expected');
        if(!options.bufferName) throw new Error('bufferName expected');
        if(!options.target) throw new Error('target type expected');
        if(!options.data) throw new Error('data expected');
        if(!options.usage) throw new Error('usage mode of buffer expected');
        if(!options.dataType) throw new Error('dataType expected');

        let gl = this._context.gl;
        let buffer;
        if(options.bufferName in this._buffers)
            buffer = this._buffers[options.bufferName].handle;
        else
            buffer = gl.createBuffer();

        gl.bindBuffer(options.target, buffer);
        gl.bufferData(options.target, options.data, options.usage);

        if(!(options.bufferName in this._buffers)) {
            this._buffers[options.bufferName] = {
                handle: buffer,
                dimensions: options.dimensions,
                dataType: options.dataType,
                length: options.data.length,
                target: options.target,
                mode: options.mode
            };
        }
    }

    /**
     * @param {string} indicesBuffer
     */
    render(indicesBuffer){
        let gl = this._context.gl;
        let buffer = this._buffers[indicesBuffer];
        if(!buffer)
            throw new Error('invalid buffer name');

        gl.drawElements(buffer.mode, buffer.length, buffer.dataType, 0);
    }

    dispose() {
        Object.getOwnPropertyNames(this._buffers)
            .forEach(name => this._context.gl.deleteBuffer(this._buffers[name].handle));
        this._buffers = {};
    }
}

export default Mesh;