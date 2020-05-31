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

float rect(vec2 st, float size, float border) {
    size = ((1. - size) / 2.);
    
    vec2 bl =  ceil((size - border) - st) + floor(size - st);
    
    float pct = bl.x * bl.y;
    vec2 tr = ceil((((1. - size) * -1.) - border) + st) + floor(((1. - size)  * -1.) + st);
    pct *= tr.x * tr.y;
    
    return pct;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.000,0.000,0.000);

    color = vec3(rect(st, 0.364, 0.01));

    gl_FragColor = vec4(color,1.024);
}
