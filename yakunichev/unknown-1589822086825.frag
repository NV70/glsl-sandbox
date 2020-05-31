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
    return fract(sin(st)*4375.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // vec2 m = u_mouse.xy/u_resolution.xy;
    vec2 m = vec2(
    	cos(u_time + 0.7652) / 2. + 0.5,
        sin(u_time + 0.3745) / 2. + 0.5
    );
    
	vec2 board = st;
    
    // Rows/Cols
    board.y *= 128.0;
    board.x *= 64.;
    
    // Speed
    float freq = random(floor(board.x)) + 0.256;
    float sy = (freq * u_time * 30.);
    board.y += sy;
    
    // Render
    vec3 color = vec3(
        smoothstep(m.y - 0.5, m.y, random(floor(board.y))),
        smoothstep(m.x - 0.5, m.x, random(floor(board.y - 0.5))),
        smoothstep(m.x, m.y, random(floor(board.y + 0.5)))
    );

    gl_FragColor = vec4(color, 1.0);
}
