precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uModelView;

varying vec3 vNormal;

void main() {
    vNormal = mat3(uModelView) * aNormal;
    gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
}
