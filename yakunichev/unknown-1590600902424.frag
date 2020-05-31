#ifdef GL_ES
	precision highp float;
#endif

#define HALF_PI 1.57079632679
#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(in float x) {
    return fract(sin(x) * 2132131.213213124);
}
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}
float noise(in float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(random(i), random(i + 1.), smoothstep(0., 1., f));
}
vec2 noise(in vec2 st) {
    float xi = floor(st.x);
    float xf = fract(st.x);
    float yi = floor(st.y);
    float yf = fract(st.y);
    return vec2(
        mix(random(xi), random(xi + 1.), smoothstep(0., 1., xf)),
        mix(random(yi), random(yi + 1.), smoothstep(0., 1., yf))
    );
}
float polygon(in vec2 st, in int edges, in float size) {
    vec2 _st = st * 2. - 1.;
    float a = atan(_st.x,_st.y)+PI;
    float r = (PI*2.)/float(edges);
    float d = cos(floor(0.5+a/r)*r-a)*length(_st);
	return 1.0-smoothstep(size,size+0.01,d);
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
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec4 color = vec4(.0);
	
    // color = mix(color, vec4(1.), mod(noise(st * 12.).x, noise(st * 12.).y +));
	// color = mix(color, vec4(0.5, 0., 0., 1.), polygon(fract(st * 3.), 3, 0.5));
    vec2 space = st;
    // space -= vec2(0.5);
    space *= rotate2d(3.384) * noise(space.y * 1. + u_time) + 0.125;
    space *= scale(vec2(2.)) * noise(space.x + u_time) + 0.5;
    space *= 8.;
    vec2 i = floor(space);
    vec2 f = fract(space);
    color = mix(color, vec4(0.75,0.,0.,1.), vline(fract(f), 0.2, 0.5));
    
    gl_FragColor = color;
}


