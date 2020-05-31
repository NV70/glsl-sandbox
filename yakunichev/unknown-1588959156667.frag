#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rect(vec2 st, vec2 size, float border, vec2 pos) {
    size = ((1. - size) / 2.);
    st.x = (st.x - pos.x + 0.5) - (size.x / 4.);
    st.y = (st.y - pos.y + 0.5) - (size.y / 4.);
    vec4 r1 = vec4(step(size, st), step((1. - size) * -1., -st));
    vec4 r2 = vec4(step(size + border, st), step((1. - size - border) * -1., -st));
    return (r1.x*r1.y*r1.z*r1.w)-(r2.x*r2.y*r2.z*r2.w);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(.98, 0.95, 0.88);
    
    color = mix(color, vec3(0.66, 0.13, 0.14), rect(st, vec2(0.460,0.680), 1., vec2(-0.040,0.980)));
    color = mix(color, vec3(0.12, 0.38, 0.60), rect(st, vec2(0.460,0.680), 1., vec2(0.870,-0.280)));
	color = mix(color, vec3(0.950,0.827,0.433), rect(st, vec2(0.210,0.860), 1., vec2(0.960,1.000)));
    color = mix(color, vec3(0.), rect(st, vec2(1.5,0.2), 0.03, vec2(0.680,0.65)));
    color = mix(color, vec3(0.), rect(st, vec2(0.3,1.4), 0.03, vec2(0.74,0.380)));

    gl_FragColor = vec4(color, 1.024);
}
