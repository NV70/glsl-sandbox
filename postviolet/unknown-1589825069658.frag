// штрихкоды

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


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

float random (in float _st) {
    return fract(sin(_st)*
        43758.5453123);
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    
    st.x *= 32.0;
    st.y *= 3.;
    
    vec2 board1 = st;
    board1.x +=  step(1., mod(board1.y,2.)) * (u_time*5.176) * -0.276;
    board1.x +=  step(-1., mod(-board1.y,2.)) * (u_time*5.112);
    
    vec2 board2 = st;
    board2.x +=  step(1., mod(board2.y,2.)) * (u_time*4.920) * -0.5;
    board2.x +=  step(-1., mod(-board2.y,2.)) * (u_time*3.888);
    
    vec2 board3 = st;
    board3.x +=  step(1., mod(board3.y,2.)) * (u_time*5.) * -0.5;
    board3.x +=  step(-1., mod(-board3.y,2.)) * (u_time*5.);

    
    vec2 ipos1 = floor(board1);  // integer
    vec2 ipos2 = floor(board2);
    vec2 ipos3 = floor(board3);


    //float c = random(ipos+0.0002)+(u_time);

    //color = vec3(box(st,vec2(0.9)));
    //color = vec3(random( ipos ));
    color = vec3(
                 step(0.332, random(ipos1)),
                 step(0.332, random(ipos2)),
                 step(0.332, random(ipos3))
    );
    // Uncomment to see the space coordinates
    //color = vec3(st,0.0);

    gl_FragColor = vec4(color,1.0);
}
