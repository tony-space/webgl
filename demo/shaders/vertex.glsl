precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;

uniform mat4 projection;
uniform mat4 modelView;

varying vec3 fColor;

void main() {
    fColor = vColor;

    gl_Position = projection * modelView * vec4(vPosition, 1.0);
    //gl_Position = vec4(vPosition, 1.0);
}
