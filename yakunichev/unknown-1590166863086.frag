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

float random(in float x) {
    return fract(sin(x) * 2132131.213213124);
}

float noise(in float x) {
    return mix(random(floor(x)), random(floor(x) + 1.), smoothstep(0., 1., fract(x)));
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

float rect(vec2 st, float size, float border) {
    size = ((1. - size) / 2.);
    vec4 r1 = vec4(
        step(noise(st.y * 8. + u_time) * size, st.x), 
        step(noise(st.x * 8. + u_time) * size, st.y), 
        step((1. - size * noise(st.y * 8. + u_time)) * -1., (-st.x)),
        step((1. - size * noise(st.x * 8. + u_time)) * -1., -st.y)
    );
    return (r1.x*r1.y*r1.z*r1.w);
}

float circle(in vec2 st, in float radius){
    vec2 l = (st - vec2(.5));
    float r = radius + noise(st + u_time) - (radius / 2.);
    return
        1. -
        smoothstep(
        	r - (r * 0.01),
        	r + (r * 0.01),
        	dot(l, l) * 4.
    	);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(st);
    pos *= 2.;
    vec2 i = floor(pos);
	vec2 f = fract(pos);

    //float n = step(0.15, distance(noise(pos+u_time), noise(pos)));
    
    if (i.x == 0.) {
        color = mix(color, vec3(rect(f, 0.75, 1.), 0., 0.), 1.);   
    } else {
        color = mix(color, vec3(0., circle(f, 0.5), 0.), 1.);  
    }

    gl_FragColor = vec4(color, 1.0);
}
