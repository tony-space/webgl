'use strict';
import Matrix from './Matrix';

const PRECISION = 1e-6;

class Quaternion {
    /**
     * @param {number} scalar
     * @param {Matrix} vector
     */
    constructor(scalar, vector) {
        let valid = typeof scalar === 'number' && Matrix.isVector(vector, 3);
        if (!valid)
            throw new Error('invalid arguments type');

        let length = scalar * scalar + vector.dot(vector);
        if (Math.abs(length - 1) > PRECISION)
            throw new Error('quaternion must have unit length');

        this._w = scalar;
        this._v = vector.clone();
    }

    /**
     *
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    mult(q) {
        let r1 = this._w;
        let r2 = q._w;

        let v1 = this._v;
        let v2 = q._v;

        let scalarPart = r1 * r2 - v1.dot(v2);
        let vectorPart = v2.mult(r1).add(v1.mult(r2)).add(v1.cross(v2));

        return new Quaternion(scalarPart, vectorPart);
    }

    /**
     * @returns {Quaternion}
     */
    clone() {
        return new Quaternion(this._w, this._v.clone());
    }

    /**
     * @returns {Quaternion}
     */
    conjugate() {
        return new Quaternion(this._w, this._v.mult(-1))
    }

    /**
     * @returns Matrix returns axial vector
     */
    toAxis(){
        return this._v.mult(2 * Math.acos(this._w) / this._v.length());
    }

    /**
     * @returns {Matrix} converts into ordinary 4x4 matrix
     */
    toMatrix() {
        let q0 = this._w;
        let q1 = this._v.getValue(0);
        let q2 = this._v.getValue(1);
        let q3 = this._v.getValue(2);

        return Matrix.fromRows([
            [1 - 2 * (q2 * q2 + q3 * q3), 2 * (q1 * q2 - q0 * q3), 2 * (q0 * q2 + q1 * q3), 0],
            [2 * (q1 * q2 + q0 * q3), 1 - 2 * (q1 * q1 + q3 * q3), 2 * (q2 * q3 - q0 * q1), 0],
            [2 * (q1 * q3 - q0 * q2), 2 * (q0 * q1 + q2 * q3), 1 - 2 * (q1 * q1 + q2 * q2), 0],
            [0, 0, 0, 1]
        ]);
    }

    /**
     * @param {Matrix} axis
     * @param {Number} angle
     * @returns {Quaternion}
     */

    static rotateRadians(axis, angle) {
        if (!Matrix.isVector(axis, 3))
            throw new TypeError('Axis should be 3d vector');

        let length = axis.length();

        if (Math.abs(length) < PRECISION) {
            axis = Matrix.vector([1, 0, 0]);
            angle = 0;
            length = 1;
        }
        axis = axis.mult(1 / length);

        angle *= 0.5;

        let scalarPart = Math.cos(angle);
        let vectorPart = axis.mult(Math.sin(angle));

        return new Quaternion(scalarPart, vectorPart);
    }

    /**
     * @param {Matrix} axis
     * @param {Number} angle
     * @returns {Quaternion}
     */
    static rotateDegrees(axis, angle) {
        return Quaternion.rotateRadians(axis, angle / 180 * Math.PI);
    }
}
export default Quaternion;