float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}
float random (float st) {
  return fract(sin(st)*4375.5453123);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 st = fragCoord.xy/iResolution.xy;
  vec2 m = vec2(cos(iTime + 0.7652) / 2. + 0.5, sin(iTime + 0.3745) / 2. + 0.5);
	vec2 board = st;

  // Rows/Cols
  board.y *= 128.0;
  board.x *= 64.;

  // Speed
  float freq = random(floor(board.x)) + 0.256;
  float sy = (freq * iTime * 64.);
  board.y += sy;

  // Render
  vec3 color = vec3(
    smoothstep(m.y - 0.5, m.y, random(floor(board.y))),
    smoothstep(m.x - 0.5, m.x, random(floor(board.y - 0.5))),
    smoothstep(m.x, m.y, random(floor(board.y + 0.5)))
  );

  fragColor = vec4(color, 1.0);
}
