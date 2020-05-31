// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define HALF_PI 1.57079632679

uniform vec2 u_resolution;
uniform float u_time;

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

float elasticInOut (in float t) {
    return t < 0.5
        ? 0.5 * sin(+13.0 * HALF_PI * 2.0 * t) * pow(2.0, 10.0 * (2.0 * t - 1.0))
        : 0.5 * sin(-13.0 * HALF_PI * ((2.0 * t - 1.0) + 1.0)) * pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0;
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

float bounceIn (in float t) {
    return 1.0 - bounceOut(1.0 - t);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // To move the cross we move the space
    vec2 translate = vec2(
        elasticInOut(cos(u_time * 1.3575)) * 2. - 1.,
        elasticInOut(sin(u_time * 3.6525)) * 2. - 1.
    );
    st += translate * 0.340;

    // Show the coordinates of the space on the background
    color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(cross(st,0.25));

    gl_FragColor = vec4(color,1.0);
}
