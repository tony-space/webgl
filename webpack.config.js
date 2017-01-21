'use strict';

const path = require('path');

module.exports = {
    entry: './demo/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        inline: true
    }
};