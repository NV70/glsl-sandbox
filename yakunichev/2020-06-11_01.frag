#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define FOUR_PI 12.5663706144
#define SPIRALS 32.

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
	      sin(_angle),cos(_angle));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (2. * fragCoord - iResolution.xy) / iResolution.x;

  vec2 uv2 = uv * 20.;
  uv2 = rotate2d(uv2.y / (2.) + iTime) * uv2;
  float value = step(0.1, fract(uv2.y));
  
  fragColor = vec4(vec3(value), 1.);
}
