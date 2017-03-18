precision mediump float;

varying vec3 vPos;

void main() {
    if(vPos.z > 1.0)
        discard;

    vec3 color = vec3(vPos.x + 1.0, vPos.y + 1.0, vPos.z);

    gl_FragColor = vec4(color, 1.0);
}
