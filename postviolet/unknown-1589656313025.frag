#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float poly (vec2 st, int N) {
    
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);
  float d = cos(floor(0.700+a/r)*r-a) * length(min(abs(st)-1.372,-1.264)*abs(sin(u_time*0.5)));
  d = (1.0-smoothstep(1.008,0.786,d));
    
    return d;
}

float circle(in vec2 _st, in float _radius, vec2 _pos, float border){
    vec2 l = _st-_pos;
    float c1 = 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
    float c2 = 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0*(border));
    
    return c1-c2;}

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

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}


void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.944;

  float c = circle(st, 0.604, vec2(0.5,0.5), 1.02);
  

  // Remap the space to -1. to 1.
  vec2 space1 = st;
  space1 -= vec2(0.5);
  space1 = rotate2d( sin(u_time )*PI ) * space1;
  space1 += vec2(0.5);

  d = poly(space1, 4);

  color = mix(color, vec3(0.006,0.620,0.160),c);
  color = mix(color, vec3(0,0,0),d);
 
  vec2 space2 = st;  
  space2 -= vec2(0.5);
  space2 = rotate2d(sin(u_time*2.)*PI) *space2;
  space2 += vec2(0.5);

  float x = cross(space2, 0.516);
  float c1 = circle(space2, 0.260, vec2(0.5,0.5), 1.5);

  
 
  color = mix(color, vec3(0.006,0.620,0.160),c1);  
  color = mix(color, vec3(0.0,0.0,0.0), x);  


    


  gl_FragColor = vec4(color,1.0);
}