precision mediump float;

varying vec3 vNormal;

void main() {
    const vec3 lightSource = normalize(vec3(1.0, 1.0, 0.0));
    float diffuse = clamp(dot(normalize(vNormal), lightSource), 0.0, 1.0);
    vec3 color = vec3(diffuse);
    gl_FragColor = vec4(color, 1.0);
}
