'use strict';

import Matrix from '../math/Matrix';

class ObjFile {
    /**
     *
     * @param {string} text obj file content
     */
    constructor(text) {
        let lines = text.split('\n');
        this._vertices = [];
        this._triangles = [];

        lines.forEach(line => {
            let tokens = line.split(' ');
            if (tokens.length !== 4)
                return;

            switch (tokens[0]) {
                case 'v':
                    let x = parseFloat(tokens[1]);
                    let y = parseFloat(tokens[2]);
                    let z = parseFloat(tokens[3]);

                    this._vertices.push([x, y, z]);
                    break;

                case 'f':
                    let a = parseInt(tokens[1]) - 1;
                    let b = parseInt(tokens[2]) - 1;
                    let c = parseInt(tokens[3]) - 1;

                    this._triangles.push([a, b, c]);
                    break;
            }
        });
    }

    /**
     * @returns {Array<Matrix>}
     */
    getNormalsArray() {
        let verticesTriangles = new Array(this._vertices.length);
        let result = [];

        this._triangles.forEach((triangle, tIndex) =>
            triangle.forEach(vIndex => {
                if (verticesTriangles[vIndex] === undefined)
                    verticesTriangles[vIndex] = [];

                verticesTriangles[vIndex].push(tIndex);
            }));


        verticesTriangles.forEach(triangles => {
            let normal = Matrix.vector([0, 0, 0]);

            triangles.forEach(tIndex => {
                let triangle = this._triangles[tIndex];

                let a = Matrix.vector(this._vertices[triangle[0]]);
                let b = Matrix.vector(this._vertices[triangle[1]]);
                let c = Matrix.vector(this._vertices[triangle[2]]);

                let cross = b.sub(a).cross(c.sub(a));
                normal = cross.mult(1 / cross.length()).add(normal);
            });

            normal = normal.mult(1 / normal.length());
            result.push(normal);
        });

        return result;
    }

    /**
     * @returns {Array<Matrix>}
     */
    getVerticesArray() {
        return this._vertices.map(v => Matrix.vector(v));
    }

    /**
     * @returns {Array<number>}
     */
    getTrianglesArray() {
        let result = [];
        this._triangles.forEach(face => result = result.concat(face));
        return result;
    }

    /**
     * @returns {Array<number>}
     */
    getLinesArray() {
        let result = [];
        this._triangles.forEach(face => {
            result.push(face[0]);
            result.push(face[1]);

            result.push(face[1]);
            result.push(face[2]);

            result.push(face[2]);
            result.push(face[0]);
        });

        return result;
    }

    static loadAsync(url) {
        return fetch(url)
            .then(response => response.text())
            .then(text => new ObjFile(text));
    }
}

export default ObjFile;