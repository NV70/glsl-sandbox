#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define FOUR_PI 12.5663706144
#define SPIRALS 32.

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (2. * fragCoord - iResolution.xy) / iResolution.x;
  float theta = ((atan(uv.y, uv.x)) / TWO_PI);

  int N = 3;
  float a = atan(uv.x, uv.y) + PI;
  float r = TWO_PI / float(N);
  float dist = cos(floor(0.5 + a / r) * r - a) * length(uv / 2.);
  float value = theta + dist * SPIRALS;

  if (value < 2.) {
    value = 1.;
  } else {
    value = value < 8. && value > 1.
      ? smoothstep(.2, .21, fract(value))
      : 0.;
  }

  fragColor = vec4(value);
}
