// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}


                    float bounceOut (in float t) {
                        const float a = 4.0 / 11.0;
                        const float b = 8.0 / 11.0;
                        const float c = 9.0 / 10.0;
                        const float ca = 4356.0 / 361.0;
                        const float cb = 35442.0 / 1805.0;
                        const float cc = 16061.0 / 1805.0;
                        float t2 = t * t;
                        return t < a
                        ? 7.5625 * t2
                        : t < b
                            ? 9.075 * t2 - 9.9 * t + 3.4
                            : t < c
                                ? ca * t2 - cb * t + cc
                                : 10.8 * t * t - 20.52 * t + 10.72;
                    }

float bounceInOut (in float t) {
                        return t < 0.5
                        ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
                        : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
                    }

float cubicIn (in float t) {
                        return t * t * t;
                    }

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    
        vec2 translate = vec2(
        cubicIn(0.140+sin(u_time)),
        cos(u_time)*0.5
    );                
    st += translate*0.1;


    // move space from the center to the vec2(0.0)
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d(bounceOut( sin(u_time/10.)*PI )) * st;
    // move it back to the original place
    st += vec2(0.5);
    
    

    // Show the coordinates of the space on the background
    color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(cross(st,0.4));

    gl_FragColor = vec4(color,1.0);
}
