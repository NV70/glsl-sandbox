#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.4, pct, st.y) -
          smoothstep( pct, pct+0.5, st.y);
}

// Reference to
// http://thndl.com/square-shaped-shaders.html
void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st * 8. - 4.;

  // Number of sides of your shape
  int N = 3;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*pow(length(min(abs(st) - 0.848, 0.496)), 1.128);
  d = 1.0-smoothstep(.4,0.450,d);

  color = vec3(d, 0.2, 0.1);
  // color = vec3(d);

  gl_FragColor = vec4(color,1.0);
}
