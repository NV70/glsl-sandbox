//moon

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

float moon (in vec2 _st, in float _radius, vec2 _pos) {
    
    vec2 l = _st-_pos;
    float c1 = 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*3.888);
    float c2 = 1.-smoothstep(_radius-(_radius*0.1),
                         _radius+(_radius*0.01),
                         dot((l+0.062),(l+0.010))*3.344);
    
    return c1/c2;}


void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x -= 0.7;
    st.y -= 0.5;
  vec3 color = vec3(0.000,0.446,1.000);

 
  vec2 space1 = st;
  space1 -= vec2(0.5);
  space1 = rotate2d (-u_time/2.) * space1;
  space1 += vec2(0.5);
    
  float m = moon(st, 0.132, vec2(0.5, 0.5) * space1);
    
  color = mix(color, vec3(0.000,0.005,0.001),m+space1.x);


  gl_FragColor = vec4(color,1.0);
}