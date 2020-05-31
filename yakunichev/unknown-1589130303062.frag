// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    //st = st *2.-1.;

    vec2 pos = vec2(0.5)-abs(st);
    float r = length(pos) * 1.;
    float a = atan(pos.y,pos.x);

    float f = pow(fract(abs(cos(a * u_time * 3.)) * sin(a + u_time)), 3.);

    //color = vec3( 1.-smoothstep(f,f+0.02,r), 0., 1.);
    color = vec3(plot(st, f));

    gl_FragColor = vec4(color, 1.5);
}
