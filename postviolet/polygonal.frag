#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float poly (vec2 st, int N) {
    
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);
  float d = cos(floor(0.164+a/r)*r-a)*length( min(abs(st)-0.500,-0.280) );
  d = (1.0-smoothstep(0.432,0.282,d));
    
    return d;
}


void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.944;

  // Remap the space to -1. to 1.
  st = st *1.896-0.952;

  d = poly(st, 6);

  color = vec3(d);
  // color = vec3(d);

  gl_FragColor = vec4(color,1.0);
}