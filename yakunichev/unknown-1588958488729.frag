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
    vec3 color = vec3(1., 1., 1.);
    
    float r1 = rect(st, vec2(0.150,0.690), 0.004, vec2(0.230,0.430));
    float r2 = rect(st, vec2(0.190,0.650), 0.004, vec2(0.710,0.100));
    
    color = mix(color, vec3(1.0, 0., 0.), r1);
    color = mix(color, vec3(.0, 1.0, 0.), r2);

    gl_FragColor = vec4(color, 1.024);
}
