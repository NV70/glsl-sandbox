// noise 1.0
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float random (float puk) {
    return fract(sin(puk)*
        43758.5453123);
}

float noise(float x) {
float i = floor(x);
float f = fract(x);
    
return mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
}

float circle(in vec2 _st, in float _radius, vec2 _pos, float border){
    vec2 l = _st-_pos;
    float c1 = 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
    float c2 = 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0*(noise(u_time + border)));
    
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
    return  box(_st, vec2(_size+(noise(u_time*3.)),_size/4.)) * noise(_st.x + u_time * 2.);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  //st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.180,0.180,0.180);
  
  vec2 space1 = rotate2d(noise(u_time)) * st;  
  float n = noise(u_time);  
  // float c = circle(space1,noise(u_time), vec2(0.5), 1.5*(noise(u_time*3.)))*noise(u_time);
  // color = mix(color, vec3(0.620,0.479,0.601),c);
  
    vec2 space3 = st;
  space3 -= vec2(.5);
  space3 = rotate2d(60.) * space3 + noise(space3.x + u_time);
  // space3 = rotate2d((noise(u_time*5.99999)))*space3+noise(st.x+u_time);
  // space3 += vec2(.5);
  float cr2 = cross(space3, 0.50);
  color = mix(color, vec3(0.945,0.858,0.930),cr2);   
    
  vec2 space2 = st;
  space2 -= vec2(0.5);
  space2 = rotate2d(90.) * space2 + noise(space2.y + u_time);
  // space2 = rotate2d((noise(u_time*6.)))*space2+noise(st.x+u_time);
  // space2 += vec2(0.5);
  float cr1 = cross(space2, 0.5);
  color = mix(color, vec3(0.0,0.,0.),cr1 * noise(u_time * st.x));
    


    /* vec2 space1 = st;
  space1 -= vec2(0.5);
  space1 = rotate2d( sin(u_time )*PI ) * space1;
  space1 += vec2(0.5); */
    
  gl_FragColor = vec4(color,1.0);
}