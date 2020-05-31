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
    float freq = random(floor(u_time))+abs(atan(u_time)*0.1);
    float sx = 60.+u_time*(1.0-freq)*30.;
    board.y *= 2.0;
    board.x *= 64.;
    board.x += step(1., mod(board.y, 2.0)) * sx;
    board.x -= step(-1., mod(-board.y, 2.0)) * sx;
    vec3 color = vec3(step(0.256, random(floor(board))));

    gl_FragColor = vec4(color, 1.0);
}
