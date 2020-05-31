// узбецкий узор


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

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.660;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float line (vec2 _st, vec2 _size) {
    _size = vec2(0.5) - _size*0.660;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    return uv.x;
}



void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  //st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.840,0.805,0.744);
  
  st *= 6.60 ;
  st = fract(st);
  st = st *2.-1.00;

  float trb = triangle(st, 3, vec2(-0.010,0.340),-1.100)/triangle(st, 3, vec2(0.000,0.470),0.500);  
  float tr = triangle(st, 3, vec2(-0.010,0.040),0.5)/triangle(st, 3, vec2(-0.010,0.930),0.948);
  float tr1 = triangle(st, 3, vec2(0.000,0.1),-0.1)/triangle(st, 3, vec2(0.0,0.5),0.268);
 
  color = mix(color, vec3(0.000,0.016,0.050),1.0-smoothstep(0.448,0.530,trb));  
  color = mix(color, vec3(0.001,0.305,0.980),1.0-smoothstep(0.448,0.530,tr));
  color = mix(color, vec3(0.980,0.132,0.000),1.0-smoothstep(0.524,0.772,tr1));
    
  //vec2 grid1 = tile(vec2(st.x,0.5),0.8);
  vec2 space1 = st *= 0.450; 
  float b1 = line(space1, vec2(1.3,0.0)); 
  color = mix(color, vec3(0.000,0.400,0.054),1.0-smoothstep(0.5,0.5,(b1)));
    
  vec2 space2 = st *= -0.45; 
  float b2 = line(space2, vec2(1.000,-0.060)); 
  color = mix(color, vec3(0.000,0.400,0.054),1.0-smoothstep(0.5,0.5,(b2)));
    
  st *= 2.0;
  st = fract(st);
  st = st *2.0-1.;
  
  vec2 space3 = st *= 1.5;  
  float tr2 = triangle(space3, 12, vec2(0.150,0.510),0.00);
  color = mix(color, vec3(0.980,0.162,0.040),1.0-smoothstep(0.5,0.884,tr2));
    
  float tr3 = triangle(space3, 6, vec2(0.150,0.510),-0.00);
  color = mix(color, vec3(0.980,0.960,0.153),1.0-smoothstep(0.5,0.500,tr3));  

  gl_FragColor = vec4(color,1.0);
}
