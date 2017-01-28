'use strict';
import Matrix from './Matrix';

const PRECISION = 1e-6;

export default class Quaternion {
    /**
     * @param {Matrix} vector - 4d unit (+-1e-6) vector
     */
    constructor(vector) {
        if (!Matrix.isVector(vector, 4))
            throw new TypeError('invalid parameter');

        let length = vector.length();

        if (Math.abs(length - 1) > PRECISION)
            throw new TypeError('vector should be unit');

        this._r = vector.getValue(0);
        this._v = Matrix.vector([vector.getValue(1), vector.getValue(2), vector.getValue(3)]);
    }

    /**
     *
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    mult(q) {
        let r1 = this._r;
        let r2 = q._r;

        let v1 = this._v;
        let v2 = q._v;

        let scalarPart = r1 * r2 - v1.dot(v2);
        let vectorPart = v2.mult(r1).add(v1.mult(r2)).add(v1.cross(v2));

        return new Quaternion(Matrix.vector([
            scalarPart,
            vectorPart.getValue(0),
            vectorPart.getValue(1),
            vectorPart.getValue(2)
        ]));
    }

    /**
     * @returns {Matrix} 4x4
     */
    toMatrix() {
        let q0 = this._r;
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
            throw new TypeError('Axis shoud be 3d vector');

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

        return new Quaternion(Matrix.vector([
            scalarPart,
            vectorPart.getValue(0),
            vectorPart.getValue(1),
            vectorPart.getValue(2)
        ]));
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