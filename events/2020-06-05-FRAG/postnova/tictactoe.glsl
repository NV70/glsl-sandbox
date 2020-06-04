#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

float random (float puk) {
    return fract(sin(puk)* 43758.5453123);
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
    return  box(_st, vec2(_size+(noise(iTime*3.)),_size/4.)) +
            box(_st, vec2(_size/4.,_size+(noise(iTime*3.))));
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 st = fragCoord.xy/iResolution.xy;
  vec3 color = vec3(0.180,0.180,0.180);

  vec2 space1 =st;
  float n = noise(iTime);
  float c = circle(space1,0.604, vec2(0.5,0.5), 1.5*(noise(iTime*3.)));
  color = mix(color, vec3(0.620,0.479,0.601),c);

  vec2 space3 = st;
  space3 -= vec2(0.5);
  space3 = rotate2d((noise(iTime*5.99999)))*space3;
  space3 += vec2(0.5);
  float cr2 = cross(space3, 0.50);
  color = mix(color, vec3(0.945,0.858,0.930),cr2);

  vec2 space2 = st;
  space2 -= vec2(0.5);
  space2 = rotate2d((noise(iTime*6.)))*space2;
  space2 += vec2(0.5);
  float cr1 = cross(space2, 0.5);
  color = mix(color, vec3(0.0,0.,0.),cr1);

  fragColor = vec4(color,1.0);
}
