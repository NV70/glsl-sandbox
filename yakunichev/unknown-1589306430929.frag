// Author @patriciogv - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
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

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

void main(void) {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);
    
    st = tile(st,4.);
    
    st = rotate2D(st,PI*0.35);
    st.x *= 9.0;// 0 -> 3
    st.y *= 9.0; // 0 -> 3
    float col = ceil(st.x); // 1 | 2 | 3
    float row = ceil(st.y); // 1 | 2 | 3
    st = fract(st); // 0 -> 1
    
    
    if (mod(ceil(col), 2.) == 0. && mod(ceil(row), 2.) == 0.) {
    	color = mix(vec3(0.31,0.0,1.000), vec3(1.000,0.190,0.199), circle(st, 0.5));   
    } else {
        color = mix(vec3(0.31,0.0,1.000), color, cross(st, 0.6725));
    }

	gl_FragColor = vec4(color, 1.0);
}
