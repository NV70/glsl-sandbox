// noise+distance+thresh
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float box(in vec2 _st, in vec2 _size, vec2 pos){
    _st= _st+pos;
    _size = vec2(0.5) - _size*0.700;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return (uv.x)*(uv.y);}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));}

float random(in float x) {
    return fract(sin(x) * 2132131.213213124);
}

float noise(in float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(random(i), random(i + 1.), smoothstep(0., 1., f));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.840,0.805,0.744);

    vec2 pos = vec2(st*32.);
    float n = step(0.15, distance(noise(pos+u_time), noise(pos)));
    color = mix(color, vec3(0.830,0.112,0.000),n);
    
    vec2 pos2 = vec2(st);
    pos2 -= vec2(0.5);
    pos2 *= rotate2d(max(0.840, noise(pos2*80.+u_time*22.160))+-0.828);
    pos2 += vec2(0.500,0.480);
    float box1 = box(pos2, vec2(0.230,0.620),vec2(0.300,0.010));
    color = mix(color, vec3(0.425,0.008,0.024),box1);
    
    vec2 pos3 = vec2(st);
    pos3 -= vec2(0.5);
    pos3 *= rotate2d(max(0.840, noise(pos2*60.+u_time*2.))+-0.828);
    pos3 += vec2(0.500,0.480);
    float box2 = box(pos3, vec2(0.170,0.660),vec2(-0.020,0.010));
    color = mix(color, vec3(0.685,0.019,0.065),box2);
    
    vec2 pos4 = vec2(st);
    pos4 -= vec2(0.5);
    pos4 *= rotate2d(max(0.840, noise(pos2*60.+u_time*2.))+-0.828);
    pos4 += vec2(0.500,0.480);
    float box3 = box(pos4, vec2(0.220,0.560),vec2(-0.320,0.010));
    color = mix(color, vec3(0.980,0.300,0.140),box3);




    gl_FragColor = vec4(color, 1.0);
}