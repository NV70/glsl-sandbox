// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rect(vec2 st, vec2 size, float border, float posX, float posY) {
    
    size = ((1. - size) / 2.);
    st.x = (st.x-posX+0.5)-(size.x/4.);
    st.y = st.y-posY+0.5-(size.y/4.);
    vec4 r1 = vec4(step(size, st), step((1. - size) * -1., -st));
    vec4 r2 = vec4(step(size + border, st), step((1. - size - border) * -1., -st));
    return (r1.x*r1.y*r1.z*r1.w)-(r2.x*r2.y*r2.z*r2.w);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.000, 1.000, 1.000);
    
    float r1 = rect(st, vec2(0.640,0.170), 0.184, 0.416, 0.832);
    float r2 = rect(st, vec2(0.260,1.050), 0.160, 0.800, 0.312);
    float r3 = rect(st, vec2(1.000,0.030), 0.440, 0.496, 0.720);
    float r4= rect(st, vec2(0.030,1.060), 0.280, 0.008, 0.480);
    float r5= rect(st, vec2(0.030,1.060), 0.280, 0.648, 0.480);
    float r6 = rect(st, vec2(1.000,0.030), 0.440, 0.624, 0.296);

   // color = color + vec3 (0.176, 0.128, 2.136);
    
    color = mix(color, vec3 (1.0, 0.0, 0.0), r1);
    color = mix(color, vec3 (0.0, 0.0, 1.0), r2);
    color = mix(color, vec3 (0.0, 0.0, 0.0), r3);
    color = mix(color, vec3 (0.0, 0.0, 0.0), r4);
    color = mix(color, vec3 (0.0, 0.0, 0.0), r5);
    color = mix(color, vec3 (0.0, 0.0, 0.0), r6);
    
    gl_FragColor = vec4(color, 1.0);
}