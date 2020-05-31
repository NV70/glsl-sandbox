// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorSunset = vec3(0.94, 0.65, 0.4);
vec3 colorSea = vec3(0.41, 0.4, 0.55);

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 vTernerGradient = vec3(0.0);
    
    vec3 pct = vec3(st.y);
    
    pct.b = smoothstep(0.750, 1., pow(sin(st.y * 3.14 + u_time), 64.));
    pct.r = sin(st.y * 3.14 + u_time) + 0.2;
    pct.g = sin(st.y * 3.14 + u_time) + 0.2;
    
    vTernerGradient = mix(colorSunset, colorSea, pct);
    
    gl_FragColor = vec4(vTernerGradient, 1.0);
}