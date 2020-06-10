void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 st = fragCoord.xy/iResolution.xy;
  fragColor = vec4(vec3(st.y/st.x), 1.0);
}
