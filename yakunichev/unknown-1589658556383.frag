#ifdef GL_ES
precision highp float;
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

float vline(in vec2 st, in float width, in float xpos) {
    xpos = xpos - width / 2.;
    return step(xpos, st.x) * step(-(width + xpos), -st.x);
}

float hline(in vec2 st, in float width, in float ypos) {
    ypos = ypos - width / 2.;
    return step(ypos, st.y) * step(-(width + ypos), -st.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    
    st -= vec2(0.5);
    // st *= scale(vec2(2., 2.));
    // st *= scale( vec2(sin(u_time) + 2.) ) * rotate2d(sin(u_time)*PI);
    st += vec2(0.5);
    
    //color = mix(color, vec3(0.,0.760,0.), circle(st, vec2(0.5), 0.45, 0.001, 0.02) - vline(st, 0.05, 0.5));    
        
    vec2 space1 = st - vec2(0.5);
    space1 *= rotate2d(elasticIn(sin(u_time + 1.125))*PI + (PI/2.));
    space1 += vec2(0.5);
    color = mix(color, vec3(0.,0.760,0.), circle(space1, vec2(0.5), 0.25, 0.001, 0.02) * vline(space1, 0.2, 0.5));
    
    vec2 space2 = st - vec2(0.5);
    space2 *= rotate2d(elasticIn(sin(u_time + 1.25))*PI);
    space2 += vec2(0.5);
    color = mix(color, vec3(0.441,0.691,0.725), circle(space2, vec2(0.5), 0.25, 0.001, 0.02) * vline(space2, 0.2, 0.5));
    
    vec2 space3 = st - vec2(0.5);
    space3 *= rotate2d((u_time + .345)*PI/3.);
    space3 += vec2(0.5);
    color = mix(color, vec3(0.,0.760,0.),
                circle(space3, vec2(0.5), 0.475, 0.02, 0.5) * step(0.475, distance(space3, vec2(0.5))) * hline(space3, 0.5, 0.85) * 0.5
               );
    
        color = mix(color, vec3(0.441,0.691,0.725),
                circle(space3, vec2(0.5), 0.475, 0.02, 0.5) * step(0.475, distance(space3, vec2(0.5))) * hline(space3, 0.5, 0.15) * 0.5
               );
    
    vec2 space4 = st - vec2(0.5);
    space4 *= rotate2d((u_time + 2.)*PI/6.);
    space4 += vec2(0.5);
    color = mix(color, vec3(0.441,0.691,0.725),
                circle(space4, vec2(0.5), 0.375, 0.02, 0.5) * step(0.375, distance(space4, vec2(0.5))) * hline(space4, 0.5, 0.85) * 0.5
               );
    
        color = mix(color, vec3(0.,0.760,0.),
                circle(space4, vec2(0.5), 0.375, 0.02, 0.5) * step(0.375, distance(space4, vec2(0.5))) * hline(space4, 0.5, 0.15) * 0.5
               );

	const int LINES = 4;
    for (int i = LINES; i > 0; i--) {
        vec2 _st = st - vec2(0.5);
        _st *= rotate2d(PI * (float(i)/float(LINES)));
        _st += vec2(0.5);
    	color = mix(color, vec3(0.441,0.691,0.725), vline(_st, 0.005, 0.5) * 0.5); 
    }
    color = mix(color, vec3(0.), circle(st, vec2(0.5), 0.05, 0.1, 1.));
    
    const int CIRCLES = 8;
    const float border = 0.01;
    for (int i = CIRCLES; i > 0; i--) {
        float fi = float(i)/float(CIRCLES);
        float width = .2 * fi;
        float x = scale(elasticIn(sin(u_time + width + 0.7565)), width, 1. - width, -1., 1.);
        float y = scale(elasticIn(cos(u_time + width + 0.3575)), width, 1. - width, -1., 1.);
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
    }

    gl_FragColor = vec4(color, 1.0);
}

// float rect(in vec2 st, in vec2 size, in float border, in vec2 pos) {
// float circle(in vec2 st, in vec2 pos, in float radius, in float smoothing, in float border) {
