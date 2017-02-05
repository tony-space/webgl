'use strict';

class ObjFile {
    constructor(text) {
        let lines = text.split('\n');
        this.vertices = [];
        this.triangles = [];
        this.lines = [];

        lines.forEach(line => {
            let tokens = line.split(' ');
            if (tokens.length != 4)
                return;

            switch (tokens[0]) {
                case 'v':
                    this.vertices.push(parseFloat(tokens[1]));
                    this.vertices.push(parseFloat(tokens[2]));
                    this.vertices.push(parseFloat(tokens[3]));
                    break;

                case 'f':
                    let a = parseInt(tokens[1]) - 1;
                    let b = parseInt(tokens[2]) - 1;
                    let c = parseInt(tokens[3]) - 1;

                    this.triangles.push(a);
                    this.triangles.push(b);
                    this.triangles.push(c);

                    this.lines.push(a);
                    this.lines.push(b);

                    this.lines.push(b);
                    this.lines.push(c);

                    this.lines.push(c);
                    this.lines.push(a);
                    break;
            }
        });
    }

    static loadAsync(url) {
        return fetch(url)
            .then(response => response.text())
            .then(text => new ObjFile(text));
    }
}

export default ObjFile;