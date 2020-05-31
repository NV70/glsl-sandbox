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

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float noise(in float x) {
    return mix(random(floor(x)), random(floor(x) + 1.), smoothstep(0., 1., fract(x)));
}

void main(void) {
    vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(.0,.01,.1);
    st *= 4.;
    
    vec2 board = st;
    board = fract(board);
	board = rotate2D(board, PI * noise(u_time + noise(st.x) + noise(st.y)));
    
    color = mix(color, vec3(noise(st.x + st.y), noise(st.y), noise(st.x)), rect(board, .5, .1));
        
    gl_FragColor = vec4(color, 1.0);
}
