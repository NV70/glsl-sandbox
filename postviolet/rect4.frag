// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rect(vec2 st, float size, float border, float posX, float posY) {
    size = ((1. - size) / 2.);
    st.x = (st.x-posX+0.5)-(size/4.);
    st.y = st.y-posY+0.5-(size/4.);
    vec4 r1 = vec4(step(size, st), step((1. - size) * -1., -st));
    vec4 r2 = vec4(step(size + border, st), step((1. - size - border) * -1., -st));
    return (r1.x*r1.y*r1.z*r1.w)-(r2.x*r2.y*r2.z*r2.w);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.000, 0.000, 0.000);

    color = vec3(
        rect(st, 0.200, 0.024,0.520,0.272)
        

    );

    gl_FragColor = vec4(color, 1.024);
}