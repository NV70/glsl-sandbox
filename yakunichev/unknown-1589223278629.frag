// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define HALF_PI 1.57079632679

uniform vec2 u_resolution;
uniform float u_time;

float rect(in vec2 st, in vec2 size, in float border, in vec2 pos) {
    size = ((1. - size) / 2.);
    st.x = (st.x - pos.x + 0.5) - (size.x / 4.);
    st.y = (st.y - pos.y + 0.5) - (size.y / 4.);
    vec4 r1 = vec4(step(size, st), step((1. - size) * -1., -st));
    vec4 r2 = vec4(step(size + border, st), step((1. - size - border) * -1., -st));
    return (r1.x*r1.y*r1.z*r1.w)-(r2.x*r2.y*r2.z*r2.w);
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

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float circle(in vec2 st, in vec2 pos, in float radius, in float smoothing, in float border) {
    return
        smoothstep(radius + smoothing, radius, distance(st, pos))
        - smoothstep(radius + smoothing, radius - border, distance(st, pos));
}

float scale(in float x, in float min, in float max, in float minRange, in float maxRange) {
    return (max - min) * (x - minRange) / (maxRange - minRange) + min;
}

float elasticIn (in float t) {
    return sin(13.0 * t * HALF_PI) * pow(2.0, 10.0 * (t - 1.0));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    
    st -= vec2(0.5);
    //st *= scale( vec2(sin(u_time) + 2.) ) * rotate2d(sin(u_time)*PI);
    st += vec2(0.5);
    
	const int CIRCLES = 8;
    const float border = 0.002;
    for (int i = CIRCLES; i > 0; i--) {
        float fi = float(i)/float(CIRCLES);
        float width = 0.475 * fi;
        float x = scale(sin(u_time + width + 0.7565), width, 1. - width, -1., 1.);
        float y = elasticIn(scale((cos(u_time + width + 0.3575)), width, 1. - width, -1., 1.)) + 0.5;
        color = mix(
        	color,
        	vec3(width, 0.760, width),
        	circle(
                st,
                vec2(x, y),
                width,
                border,
                0.005
            )
    	);
        color = mix(
        	color,
            vec3(1.),
            cross(st, width)
        );
    }

    gl_FragColor = vec4(color, 1.0);
}
