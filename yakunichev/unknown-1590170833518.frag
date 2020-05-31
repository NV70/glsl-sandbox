#ifdef GL_ES
precision mediump float;
#endif

#define A2 123.213123123

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
        step(size.x,st.x), 
        step(size.y, st.y), 
        step((1. - size.x) * -1., (-st.x)),
        step((1. - size.y) * -1., -st.y)
    );
    return (r1.x*r1.y*r1.z*r1.w)*noise(st * 512.);
}

float hash(vec2 co){
  float t = 12.9898*co.x + 78.233*co.y; 
  return fract((A2+t) * sin(t));  // any B2 is folded into 't' computation
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 m = u_mouse.xy/u_resolution.xy;
    vec3 color = vec3(
        noise(st * 2.) * 0.27,
        noise(st * 2.) * 0.04,
        noise(st) * 0.03
    );
    
    vec2 translate = vec2(cos(u_time),sin(u_time));
    st += translate*noise(u_time + st / 2.);

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st);
    vec2 f3 = fract(vec2(pos.x * 8., pos.y * 12.));
    vec2 i3 = ceil(vec2(pos.x * 8., pos.y));
    
    color = mix(
        color,
        vec3(noise(pos * 2.), noise(pos * 12.), noise(pos * 2.)),
        rect(f3, vec2(0.75,0.75), 1., pos)
    );
    
    gl_FragColor = vec4(color, 1.0);
}
