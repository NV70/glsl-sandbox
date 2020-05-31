// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x, 0.0, 0.0, _scale.y);
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

float polygon(in vec2 st, in int edges, in float size) {
    vec2 _st = st * 2. - 1.;
    float a = atan(_st.x,_st.y)+PI;
    float r = (PI*2.)/float(edges);
    float d = cos(floor(0.5+a/r)*r-a)*length(_st);
	return 1.0-smoothstep(size,size+0.01,d);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.y *= u_resolution.y/u_resolution.x;

    vec2 pos = st.xy*vec2(6.,6.);

    float pattern = pos.x;

    // Add nois÷e
    // pos *= noise(pos * 128.);
    pos = scale(vec2(noise(pos * 1.))) * pos;
    // pos = rotate2d(noise(pos)) * pos;

    // Draw lines
    pattern = polygon(fract(pos), 3, 0.25);

    gl_FragColor = vec4(vec3(pattern), 1.0);
}
