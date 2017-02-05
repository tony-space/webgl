'use strict';

class Matrix {
    /**
     *
     * @param {number} rows
     * @param {number} cols
     */
    constructor(rows, cols) {
        this._rows = rows;
        this._cols = cols;

        this._data = new Array(rows * cols);
        for (let i = 0; i < this._data.length; ++i)
            this._data[i] = 0;
    }

    /**
     * @returns {number}
     */
    get rows() {
        return this._rows;
    }

    /**
     * @returns {number}
     */
    get columns() {
        return this._cols;
    }

    /**
     * @param {number} row
     * @param {number} col
     * @param {number} value
     */
    setValue(row, col, value) {
        if (value === undefined) {
            value = col;
            col = 0;
        }

        if (row < 0 || col < 0 || row >= this.rows || col >= this.columns)
            throw new RangeError("invalid index");

        this._data[col + row * this.columns] = value;
    }

    /**
     * @param row
     * @param col
     * @returns {number}
     */
    getValue(row, col) {
        if (col === undefined)
            col = 0;

        if (row < 0 || col < 0 || row >= this.rows || col >= this.columns)
            throw new RangeError("invalid index");

        return this._data[col + row * this.columns];
    }

    /**
     * @returns {Matrix}
     */
    clone() {
        let result = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.columns; ++j)
                result.setValue(i, j, this.getValue(i, j));
        return result;
    }

    /**
     * @param matrix
     * @returns {Matrix}
     */
    add(matrix) {
        if (matrix.rows != this.rows || matrix.columns != this.columns)
            throw new TypeError("invalid argument");

        let result = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.columns; ++j)
                result.setValue(i, j, this.getValue(i, j) + matrix.getValue(i, j));
        return result;
    }

    /**
     * @param matrix
     * @returns {Matrix}
     */
    sub(matrix) {
        if (matrix.rows != this.rows || matrix.columns != this.columns)
            throw new TypeError("invalid argument");

        let result = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.columns; ++j)
                result.setValue(i, j, this.getValue(i, j) - matrix.getValue(i, j));
        return result;
    }

    /**
     * @param tensor
     * @returns {Matrix}
     */
    mult(tensor) {
        if (typeof tensor === 'number') {
            let result = new Matrix(this.rows, this.columns);
            for (let i = 0; i < this.rows; ++i)
                for (let j = 0; j < this.columns; ++j)
                    result.setValue(i, j, this.getValue(i, j) * tensor);
            return result;
        }
        else if (tensor instanceof Matrix) {
            if (this.columns != tensor.rows)
                throw new RangeError("invalid size");

            let result = new Matrix(this.rows, tensor.columns);

            for (let i = 0; i < this.rows; ++i)
                for (let j = 0; j < tensor.columns; ++j) {
                    let sum = 0;
                    for (let k = 0; k < this.columns; ++k)
                        sum = sum + this.getValue(i, k) * tensor.getValue(k, j);

                    result.setValue(i, j, sum);
                }

            return result;
        }
        else
            throw new TypeError("not implemented yet");
    }

    /**
     * @returns {Matrix}
     */
    transpose() {
        let result = new Matrix(this.columns, this.rows);

        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.columns; ++j)
                result.setValue(j, i, this.getValue(i, j));

        return result;
    }

    /**
     * @param {number} i
     * @param {number} j
     */
    swapRows(i, j) {
        if (i === j) return;
        for (let column = 0; column < this.columns; ++column) {
            let temp = this.getValue(i, column);
            this.setValue(i, column, this.getValue(j, column));
            this.setValue(j, column, temp);
        }
    }

    _findNonZeroUnder(row, column) {
        while (row < this.rows) {
            if (this.getValue(row, column))
                return row;
            row++;
        }
        return null;
    }

    /**
     * @returns {Matrix}
     */
    inverse() {
        if (this.rows != this.columns || this.rows < 1)
            throw new TypeError("invalid matrix sizes");

        let result = Matrix.identity(this.rows);
        let self = this.clone();

        for (let i = 0; i < self.rows; ++i) {
            let row = self._findNonZeroUnder(i, i);
            if (row === null)
                throw new Error("determinants equals zero");

            self.swapRows(i, row);
            result.swapRows(i, row);

            let diagonal = self.getValue(i, i);

            for (let j = 0; j < self.columns; ++j) {
                self.setValue(i, j, self.getValue(i, j) / diagonal);
                result.setValue(i, j, result.getValue(i, j) / diagonal);
            }

            for (let k = 0; k < self.rows; ++k) {
                if (k === i) continue;
                let coefficient = self.getValue(k, i);
                for (let j = 0; j < self.columns; ++j) {
                    self.setValue(k, j, self.getValue(k, j) - self.getValue(i, j) * coefficient);
                    result.setValue(k, j, result.getValue(k, j) - result.getValue(i, j) * coefficient);
                }
            }
        }

        return result;
    }


    /**
     * only for vectors
     * @param tensor
     * @returns {number}
     */
    dot(tensor) {
        let valid = Matrix.isVector(this) && Matrix.isVector(tensor) && this.rows === tensor.rows;
        if (!valid)
            throw TypeError('invalid tensor types');
        let sum = 0;
        for (let i = 0; i < this.rows; ++i)
            sum = sum + this.getValue(i, 0) * tensor.getValue(i, 0);
        return sum;
    }

    /**
     * only for vectors
     * @param {Matrix} tensor
     * @returns {Matrix}
     */
    cross(tensor) {
        let valid = Matrix.isVector(this, 3) && Matrix.isVector(tensor, 3);

        if (!valid)
            throw TypeError('invalid tensor types');

        let skewSymmetric = Matrix.fromRows([
            [0, -this.getValue(2), this.getValue(1)],
            [this.getValue(2), 0, -this.getValue(0)],
            [-this.getValue(1), this.getValue(0), 0]
        ]);

        return skewSymmetric.mult(tensor);
    }

    /**
     * only for vectors
     * @returns {number}
     */
    length() {
        if (!Matrix.isVector(this))
            throw TypeError('this is not vector');

        return Math.sqrt(this.dot(this));
    }

    /**
     * @returns {Float32Array}
     */
    toFloat32Array() {
        let rows = this.rows;
        let columns = this.columns;

        let result = new Float32Array(rows * columns);

        for (let j = 0; j < columns; ++j)
            for (let i = 0; i < rows; ++i)
                result[j * rows + i] = this.getValue(i, j);

        return result;
    }

    /**
     * @param data
     * @returns {Matrix}
     */
    static vector(data) {
        let result = new Matrix(data.length, 1);
        data.forEach((e, i) => result.setValue(i, 0, e));
        return result;
    }

    /**
     *
     * @param {Matrix} tensor
     * @param {number} [dimension]
     * @returns {boolean}
     */
    static isVector(tensor, dimension) {
        return tensor instanceof Matrix && tensor.columns === 1 && (dimension === undefined || tensor.rows === dimension);
    }

    /**
     * creates i
     * @param {number} [n=4]
     * @returns {Matrix}
     */
    static identity(n) {
        if (!n)
            n = 4;

        let result = new Matrix(n, n);
        for (let i = 0; i < n; ++i)
            result.setValue(i, i, 1);
        return result;
    }

    /**
     *
     * @param {Array<Array<number>>} rows
     * @returns {Matrix}
     */
    static fromRows(rows) {
        let height = rows.length;
        if (height === 0)
            return new Matrix(0, 0);
        let width = rows[0].length;

        if (rows.some(row => row.length !== width))
            throw new TypeError('all rows should have the same length');

        let result = new Matrix(width, height);
        rows.forEach((row, i) => row.forEach((v, j) => result.setValue(i, j, v)));
        return result;
    }

    /**
     *
     * @param {number} left
     * @param {number} right
     * @param {number} top
     * @param {number} bottom
     * @param {number} zNear
     * @param {number} zFar
     * @returns {Matrix}
     */
    static frustum(left, right, top, bottom, zNear, zFar) {
        let result = new Matrix(4, 4);

        result.setValue(0, 0, 2 * zNear / (right - left));
        result.setValue(0, 2, (right + left) / (left - right));
        result.setValue(1, 1, 2 * zNear / (top - bottom));
        result.setValue(1, 2, (top + bottom) / (top - bottom));
        result.setValue(2, 2, -(zFar + zNear) / (zFar - zNear));
        result.setValue(2, 3, -2 * zFar * zNear / (zFar - zNear));
        result.setValue(3, 2, -1);

        return result;
    }

    /**
     *
     * @param {number} fov
     * @param {number} aspect
     * @param {number} zNear
     * @param {number} zFar
     * @returns {Matrix}
     */
    static perspective(fov, aspect, zNear, zFar) {
        let yMax = zNear * Math.tan(fov * Math.PI / 360.0);
        let yMin = -yMax;
        let xMin = yMin * aspect;
        let xMax = yMax * aspect;

        return Matrix.frustum(xMin, xMax, yMax, yMin, zNear, zFar);
    }

    static translate(vec) {
        let valid = vec instanceof Matrix && vec.columns === 1 && (vec.rows === 3 || vec.rows === 4);
        if (!valid)
            throw new TypeError('invalid vector');

        let result = Matrix.identity();

        result.setValue(0, 3, vec.getValue(0, 0));
        result.setValue(1, 3, vec.getValue(1, 0));
        result.setValue(2, 3, vec.getValue(2, 0));
        if (vec.rows === 4)
            result.setValue(3, 3, vec.getValue(3, 0));

        return result;
    }
}

export default Matrix;