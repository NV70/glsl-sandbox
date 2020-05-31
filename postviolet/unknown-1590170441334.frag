#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 tile(vec2 st, float zoom){
    st *= zoom;
    return fract(st);}

float triangle (in vec2 _st, int N, vec2 pos, float size){
  
  _st=_st+pos*size;
  float a = atan(_st.x,_st.y)+PI;
  float r = TWO_PI/float(N);
  return cos(floor(0.5+a/r)*r-a)*length(_st);
}

float vulva (in vec2 _st, int N, vec2 pos){
  
     _st=_st+pos;
  float a = atan(_st.x,(pos.y+0.3))+PI;
  float r = TWO_PI/float(N);
  return cos(floor(0.5+a/r)*r-a)*length(_st);
}



void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  //st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.840,0.805,0.744);
    
  st *= 3.0;
  st = fract(st);
  // Remap the space to -1. to 1.
  st = st *2.-1.;
  float tr = triangle(st, 3, vec2(-0.010,0.040),0.5)/triangle(st, 3, vec2(-0.010,0.930),0.948);
  float tr1 = triangle(st, 3, vec2(0.000,0.1),-0.1)/triangle(st, 3, vec2(0.0,0.5),0.268);
  color = mix(color, vec3(0.001,0.305,0.980),1.0-smoothstep(0.448,0.530,tr));
  color = mix(color, vec3(0.980,0.132,0.000),1.0-smoothstep(0.524,0.772,tr1));
    
  vec2 grid1 = tile(st + vec2(cos(u_time),sin(u_time))*0.9,6.760);
  vec2 space1 = st *= 1.0;
  float l1 = triangle(grid1+space1, 2, vec2(0.0,0.0),0.0);
  color = mix(color, vec3(0.000,0.400,0.054),1.0-smoothstep(-0.292,0.284,l1));  
 
  //float vl = vulva (grid1, 3, vec2(0.760,0.460));
  //color = vec3(1.0-smoothstep(0.328,0.530,tr));
  //color = vec3(tr);

  gl_FragColor = vec4(color,1.0);
}
