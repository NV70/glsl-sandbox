// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;
    float r = length(pos)*1.528;
    float a = atan(pos.y,pos.x);

    float f = fract(pow(abs(cos(a * 1.5 + u_time) * sin(r*u_time) + pow(sin(u_time), 8.)), -0.2));

    color = vec3( 1.-smoothstep(f,f+0.02,r), 0., 1.);

    gl_FragColor = vec4(color, 1.5);
}
