#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;

float rect(vec2 st, float size, float border) {
    size = ((1. - size) / 2.);
    vec4 r1 = vec4(step(size, st), step((1. - size) * -1., -st));
    vec4 r2 = vec4(step(size + border, st), step((1. - size - border) * -1., -st));
    return (r1.x*r1.y*r1.z*r1.w)-(r2.x*r2.y*r2.z*r2.w);
}

float random(in float x) {
    return fract(sin(x) * 2132131.213213124);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float noise(in float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(random(i), random(i + 1.), smoothstep(0., 1., f));
}
vec2 noise(in vec2 st) {
    float xi = floor(st.x);
    float xf = fract(st.x);
    float yi = floor(st.y);
    float yf = fract(st.y);
    return vec2(
        mix(random(xi), random(xi + 1.), smoothstep(0., 1., xf)),
        mix(random(yi), random(yi + 1.), smoothstep(0., 1., yf))
    );
}

void main(void) {
    vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(.0,.01,.1);
    st *= 4.;
    
    vec2 board = st;
    board = fract(board);
	board = rotate2D(board, PI * noise(u_time + noise(st.x) + noise(st.y)));
    
    float pct = rect(board, max(0.2, noise(st.y + u_time)), 0.02);
    
    color = mix(color, vec3(noise(st.x + st.y), noise(st.y), noise(st.x)), pct);
        
    gl_FragColor = vec4(color, 1.0);
}