// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    
   float sx = smoothstep(0.5, 1., fract(u_time+0.5));
   _st.x += step(1., mod(_st.y,2.0)) * (sx);
   _st.x -= step(1., mod(-_st.y,2.0)) * (sx);

   float sy = smoothstep(0.5, 1., fract(u_time));
   _st.y += step(1., mod(_st.x,2.0)) * (sy);
   _st.y -= step(1., mod(-_st.x,2.0)) * (sy);


    return fract(_st);
}

float circle(in vec2 _st, in float _radius, vec2 _pos){
    vec2 l = _st-_pos;
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // Modern metric brick of 215mm x 102.5mm x 65mm
    // http://www.jaharrison.me.uk/Brickwork/Sizes.html
    //st /= vec2(2.15,0.65)/1.5;

    // Apply the brick tiling
    st = brickTile(st,10.0);

    color = vec3(circle(st, 0.25, vec2(0.5,0.5)));

    // Uncomment to see the space coordinates
    //color = vec3(st,0.0);

    gl_FragColor = vec4(color,1.0);
}
