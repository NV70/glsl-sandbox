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
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float random(in float x) {
    return fract(sin(x) * 2132131.213213124);
}

float noise(in float x) {
    return mix(random(floor(x)), random(floor(x) + 1.), smoothstep(0., 1., fract(x)));
}

float rect(vec2 st, vec2 size, float border, vec2 i3) {
    size = ((1. - size) / 2.);
    vec4 r1 = vec4(
        step(size.x,st.x * noise(st.y * random(i3.x * 512.) + u_time)), 
        smoothstep(size.y, size.y + noise(st.x / 4.), st.y * noise(st.x * 24.)), 
        smoothstep((1. - size.x) * -1., (1. - size.x) * -1. + noise(st.y * 10.), (-st.x) * noise(st.x * 32.)),
        step((1. - size.y) * -1., -st.y)
    );
    return (r1.x*r1.y*r1.z*r1.w);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 m = u_mouse.xy/u_resolution.xy;
    vec3 color = vec3(
        noise(st * 2.) * 0.27,
        noise(st * 2.) * 0.04,
        noise(st) * 0.03
    );

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st);
    vec2 f3 = fract(vec2(pos.x * 3., pos.y));
    vec2 i3 = ceil(vec2(pos.x * 3., pos.y));
    
    color = mix(
        color,
        vec3(0.530,0.095,0.000),
        rect(f3, vec2(0.9,0.98), 1., i3)
    );
    
    gl_FragColor = vec4(color, 1.0);
}
