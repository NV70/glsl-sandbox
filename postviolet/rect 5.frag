// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float rect (float stx, float sty, float size) {
    
    float left = smoothstep(0.7,size, stx )+abs(sin(u_time));   // То же, что ( X больше 0.1 )
    float bottom = step(size, sty); // То же, что ( Y больше 0.1 )
    float right = step((1.-size)*-1.,-stx); // То же, что ( Y больше 0.1 )
    float top = step((1.-size)*-1.,-sty); // То же, что ( Y больше 0.1 )
    
    return left * bottom * right * top;    
}


void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    color = vec3(rect(st.x, st.y, 0.084), rect(st.x, st.y, 0.180), rect(st.x, st.y, 0.316) );

    gl_FragColor = vec4(color,1.0);
}