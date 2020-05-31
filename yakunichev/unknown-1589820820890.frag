#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}
float random (float st) {
    return fract(sin(st)*43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    vec2 board = st;
    
    // Rows/Cols
    board.y *= 128.0;
    board.x *= 128.;
    
    // Speed
    float freq = random(floor(board.x)) + -0.184;
    float sx = (freq * u_time * 30. * -1.);
    board.y *= sx;
    
    // Render
    vec3 color = vec3(step(0.256, random(floor(board))));

    gl_FragColor = vec4(color, 1.0);
}
