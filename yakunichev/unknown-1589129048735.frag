#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.;

  // Remap the space to -1. to 1.
  st = st * 2. - 1.;

  // Make the distance field
  d = pow(length(abs(st) - 0.3), 1.);
  //d = length( min(abs(st)-.3,-0.096) );
  //d = length( max(abs(st)-.3,-0.656) );

  // Visualize the distance field
  gl_FragColor = vec4(vec3(fract(d * 10.)), 1.0);

  // Drawing with the distance field
  //gl_FragColor = vec4(vec3( step(0.188, d) ),1.0);
  //gl_FragColor = vec4(vec3( step(0.164,d) * step(d,0.232)),1.0);
  gl_FragColor = vec4(vec3( smoothstep(0.260,0.264,d)* smoothstep(0.512,abs(sin(u_time)) / 4.,d)) ,1.0);
}
