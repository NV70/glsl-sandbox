const int POINTS_COUNT = 18;

float random (float i) {
  return fract(sin(i)* 43758.5453123);
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 st = fragCoord.xy / iResolution.xy;
  st.x *= iResolution.x / iResolution.y;

  vec3 color = vec3(.0);

  // Cell positions
  vec2 point[POINTS_COUNT];
  for (int i = 0; i < POINTS_COUNT; i++) {
    point[i] = vec2(noise(i), noise(i + 1));
  }

  float m_dist = 1.;  // minimum distance

  // Iterate through the points positions
  for (int i = 0; i < POINTS_COUNT; i++) {
    float dist = distance(st, point[i] + sin(iTime * (random(i) + 2.5)) / 4.);

    // Keep the closer distance
    m_dist = min(m_dist, dist);
  }

  // Draw the min distance (distance field)
  color += m_dist;

  // Show isolines
  // color -= step(.7,abs(sin(50.0*m_dist)))*.3;

  fragColor = vec4(color, 1.0);
}
