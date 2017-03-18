precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

varying vec3 vNormal;

void main() {
    mat4 modelView = uView * uModel;
    vNormal = mat3(modelView) * aNormal;
    gl_Position = uProjection * modelView * vec4(aPosition, 1.0);
}
