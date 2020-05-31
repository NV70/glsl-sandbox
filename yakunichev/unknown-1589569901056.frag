// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265358979323846

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

vec2 translate(vec2 st, vec2 translate) {
    return st + translate;
}

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

float polygon(in vec2 st, in int edges, in float size) {
    vec2 _st = st * 2. - 1.;
    float a = atan(_st.x,_st.y)+PI;
    float r = (PI*2.)/float(edges);
    float d = cos(floor(0.5+a/r)*r-a)*length(_st);
	return 1.0-smoothstep(size,size+0.01,d);
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.000,0.478,0.623);
    st = st * 7.;
    vec2 board = fract(st);

    // Use a matrix to rotate the space 45 degrees;
	float row = ceil(st.y);
    float col = ceil(st.x);
    if (mod(row - 1., 2.) == 0.) {
        board = rotate2D(board,PI*cos(u_time));
        if (mod(col - 1., 2.) == 0.) {
            color = mix(color, vec3(0.314,1.000,0.786), polygon(board, 5, cos(u_time) / 4. + 0.5));
        }
    } else if (mod(row - 1., 2.) != 0.) {
        board = rotate2D(board,PI*sin(u_time));
        if (mod(col - 1., 2.) != 0.) {
        	color = mix(color, vec3(0.173,0.141,1.000), polygon(board, 3, sin(u_time) / 24. + 0.5));   
        }
    }

    gl_FragColor = vec4(color,1.0);
}
