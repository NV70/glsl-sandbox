// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // Каждый вызов вернёт 1.0 (белый) или 0.0 (чёрный).
    float left = step(0.25,st.x) + sin(u_time);   // То же, что ( X больше 0.1 )
    float bottom = step(0.25,st.y) + sin(u_time + 0.25); // То же, что ( Y больше 0.1 )
    float right = step(-0.75, -st.x) + cos(u_time);
    float top = step(-0.75, -st.y) + cos(u_time + 0.25);

    // Умножение left*bottom работает как логическое И.
    color = vec3(left * bottom, right * top, bottom * right);

    gl_FragColor = vec4(color, 1.0);
}