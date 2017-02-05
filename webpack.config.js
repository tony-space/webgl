'use strict';

const path = require('path');

module.exports = {
    entry: './demo-src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map"
};