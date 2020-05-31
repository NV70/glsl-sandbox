// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float mouseX = min(4., u_mouse.x / u_resolution.x);
    float mouseY = min(4., u_mouse.y / u_resolution.y);
    
    float speed = u_time * mouseY * 12.;
    float freq = st.x * (mouseX * 32.);
    
    float color = sin(freq + speed);
    
    gl_FragColor = vec4(color, color, color, 1.0);
}