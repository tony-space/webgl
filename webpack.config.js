'use strict';

const path = require('path');

module.exports = {
    entry: './lib/Context.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        inline: true
    },
    devtool: 'source-map'
};