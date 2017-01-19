'use strict';

requirejs.config({
    baseUrl: '../lib'
});

define(function(require){
    const Matrix = require('Matrix');

    console.log(Matrix.createIdentityMatrix(4));
});