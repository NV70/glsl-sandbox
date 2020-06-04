float box(vec2 _st, vec2 _size){
    _size = vec2(0.940,0.460)-_size*0.532;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float random (in float _st) {
    return fract(sin(_st)*43758.5453123);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 st = fragCoord.xy/iResolution.xy;
  vec3 color = vec3(0.0);
  st.x *= 64.0;
  st.y *= 128.;
  float direction = (step(0.5, fract(iTime)) * 2.) - 1.;
  if (fract(iTime / 4.) > 0.5) {
      direction = (random(floor(iTime / 4.)) * 4.);
  } else {
      direction = - (random(floor(iTime / 4.)) * 4.);
  }
  vec2 board1 = st;
  board1.x +=  step(1., mod(board1.y,2.)) * (iTime*5.) * 2. * direction + random(floor(iTime / 44.));
  board1.x +=  step(-1., mod(-board1.y,2.)) * (iTime*5.) * -direction + random(floor(iTime / 12.));
  vec2 board2 = st;
  board2.x +=  step(1., mod(board2.y,2.)) * (iTime*5.) * 2. * direction  + random(floor(iTime / 5.));
  board2.x +=  step(-1., mod(-board2.y,2.)) * (iTime*5.) * -direction - random(floor(iTime / 2.));
  vec2 board3 = st;
  board3.x +=  step(1., mod(board3.y,2.)) * (iTime*5.) * 2. * direction - random(floor(iTime / 3.));
  board3.x +=  step(-1., mod(-board3.y,2.)) * (iTime*5.) * -direction + random(floor(iTime / 4.));
  vec2 ipos1 = floor(board1);
  vec2 ipos2 = floor(board2);
  vec2 ipos3 = floor(board3);

  color = vec3(
    step(0.684, random(ipos1)),
    step(0.684, random(ipos2)),
    step(0.508, random(ipos3))
  );
  fragColor = vec4(color, 1.0);
}
