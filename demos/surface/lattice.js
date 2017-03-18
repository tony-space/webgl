'use strict';

import Matrix from '../../webgl-library/Matrix';

class Lattice {
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this._width = width;
        this._height = height;

        const length = width * height;
        this._data = new Array(length);
        for (let i = 0; i < length; ++i)
            this._data[i] = Matrix.vector([0, 0, 0]);
    }

    /**
     *
     * @param {number} i
     * @param {number} j
     * @return {Matrix}
     */
    get(i, j) {
        if (i >= this._width || j >= this._height)
            throw new RangeError();

        const index = j * this._width + i;
        return this._data[index];
    }

    /**
     * @return {number}
     */
    get width() {
        return this._width;
    }

    /**
     * @return {number}
     */
    get height() {
        return this._height;
    }

    /**
     * @return {number}
     */
    get count() {
        return this._width * this._height;
    }

    /**
     * @param {function} callback
     */
    forEach(callback) {
        for (let i = 0; i < this._width; ++i)
            for (let j = 0; j < this._height; ++j)
                callback(i, j);
    }

    /**
     * @return {Array<number>}
     */
    verticesArray() {
        let result = new Array(this.width * this.height * 3);
        let index = 0;
        this._data.forEach(v => {
            result[index++] = v.getValue(0);
            result[index++] = v.getValue(1);
            result[index++] = v.getValue(2);
        });

        return result;
    }

    /**
     * @return {Uint16Array<number>}
     */
    trianglesArray() {
        let result = [];

        this.forEach((i, j) => {
            if (i === 0 || j === 0) return;

            const current = this.width * j + i;
            const top = this.width * (j - 1) + i;
            const left = this.width * j + i - 1;
            const topLeft = this.width * (j - 1) + i - 1;

            result.push(current, top, topLeft);
            result.push(current, topLeft, left);
        });

        return new Uint16Array(result);
    }

    /**
     * @return {Uint16Array<number>}
     */
    linesArray() {
        let result = [];

        this.forEach((i, j) => {
            if (i === 0 || j === 0) return;

            const current = this.width * j + i;
            const top = this.width * (j - 1) + i;
            const left = this.width * j + i - 1;
            const topLeft = this.width * (j - 1) + i - 1;

            result.push(current, top);
            result.push(top, topLeft);
            result.push(topLeft, left);
            result.push(left, current);
        });

        return new Uint16Array(result);
    }
}

export default Lattice;