#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 c1 = vec3(1., 1., 1.);
vec3 c2 = vec3(0., 0., 1.);
vec3 c3 = vec3(1., 0., 0.);

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = mix(c2, c1, step(2./3., st.y));
    color = mix(color, c3, step(2./3., 1. - st.y));
    gl_FragColor = vec4(color, 1.0);
}