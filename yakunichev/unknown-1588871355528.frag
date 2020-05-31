// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rect(vec2 st, float size) {
    vec2 bl = step(size, st);
    float pct = bl.x * bl.y;
    vec2 tr = step((1. - size) * -1., -st);
    pct *= tr.x * tr.y;
    return pct;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.000,0.000,0.000);

    color = vec3(
        rect(st, abs(sin(u_time))),
        rect(st, abs(sin(u_time + 0.25))),
        rect(st, abs(sin(u_time + 0.5)))
    );

    gl_FragColor = vec4(color,1.0);
}
