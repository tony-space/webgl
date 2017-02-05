precision mediump float;

varying vec3 vNormal;

void main() {
    vec3 lightSource = vec3(1.0, 1.0, 1.0);
    float diffuse = clamp(dot(normalize(vNormal), normalize(lightSource)), 0.0, 1.0);
    float specular = pow(diffuse, 32.0);

    vec3 color = vec3(specular + diffuse * 0.2);
    gl_FragColor = vec4(color, 1.0);
}
