vec2 random2( vec2 p ) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float random (in vec2 _st) {
  return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float random(in float x) {
  return fract(sin(x) * 2132131.213213124);
}

vec2 noise(in vec2 st) {
  float xi = floor(st.x);
  float xf = fract(st.x);
  float yi = floor(st.y);
  float yf = fract(st.y);
  return vec2(
	      mix(random(xi), random(xi + 1.), smoothstep(0., 1., xf)),
	      mix(random(yi), random(yi + 1.), smoothstep(0., 1., yf))
	      );
}

float cnoise2(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  // Smooth Interpolation

  // Cubic Hermine Curve.  Same as SmoothStep()
  vec2 u = f*f*(3.0-2.0*f);
  // u = smoothstep(0.,1.,f);

  // Mix 4 coorners percentages
  return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 st = fragCoord.xy/iResolution.xy;
  st.x *= iResolution.x/iResolution.y;
  vec3 color = vec3(.0);

  // Scale
  st = noise(st - iTime / 2.) + st; 
  // st.x += iTime / 2.;
  // st.y += sin(iTime / 1.2);
  st *= 9.;

  // Tile the space
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  float m_dist = 1.;  // minimum distance

  for (int y= -1; y <= 1; y++) {
    for (int x= -1; x <= 1; x++) {
      // Neighbor place in the grid
      vec2 neighbor = vec2(float(x), float(y));

      // Random position from current + neighbor place in the grid
      vec2 point = vec2(random2(i_st + neighbor));

      // Animate the point
      point = 0.5 + 0.5 * cos(iTime + 6.2831 * noise(point * 2.));

      // Vector between the pixel and the point
      vec2 diff = neighbor + noise(point * 16.) - f_st;

      // Distance to the point
      float dist = length(diff);

      // Keep the closer distance
      m_dist = min(m_dist, dist);
    }
  }

  // Draw the min distance (distance field)
  color += vec3(1. - smoothstep(0.2, 1., m_dist), 0., 0.);

  // Draw cell center
  color = mix(
	      color,
	      vec3(1., 0.5, 0.25),
	      1. - smoothstep(.1, sin(iTime) / 4. + 0.35, m_dist)
	      );

  // Draw grid
  // color.r += step(.98, f_st.x) + step(.98, f_st.y);

  // Show isolines
  // color -= step(.7,abs(sin(27.0*m_dist)))*.5;

  fragColor = vec4(color, 1.0);
}
