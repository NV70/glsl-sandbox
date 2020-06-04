float box(vec2 _st, vec2 _size){
    _size = vec2(0.940,0.460)-_size*0.532;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 st = fragCoord.xy/iResolution.xy;
  vec3 color = vec3(0.0);

  st.x *= 32.0;
  st.y *= 8.0;

  st.x +=  step(1., mod(st.y,2.0)) * fract(st.x);
  st.y +=  step(1., mod(st.x,2.0)) * fract(st.y)+(iTime);

  vec2 ipos = floor(st);  // integer
  vec2 fpos = fract(st);  // fraction
  color = vec3(step(0.332, random(ipos+iTime/24.)));

  fragColor = vec4(color,1.0);
}
