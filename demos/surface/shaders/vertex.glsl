precision mediump float;

attribute vec3 aPosition;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

varying vec3 vPos;

vec3 f(vec3 pos)
{
    return vec3(pos.x, pos.y, sqrt(pos.x * pos.x + pos.y * pos.y));
}

void main() {
    vPos = f(aPosition);
    gl_Position = uProjection * uView * uModel * vec4(vPos, 1.0);
}
