'use strict';

const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        bunny: './demos/bunny/app.js',
        surface: './demos/surface/app.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            // (the commons chunk name)

            filename: "commons.js",
            // (the filename of the commons chunk)

            // minChunks: 3,
            // (Modules must be shared between 3 entries)

            // chunks: ["pageA", "pageB"],
            // (Only use these entries)
        })
    ]
};