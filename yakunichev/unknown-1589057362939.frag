#ifdef GL_ES
precision highp float;
#endif

#define HALF_PI 1.57079632679

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float exponentialInOut (in float t) {
    return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
        ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
        : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float circle(vec2 st, vec2 pos, float radius, float smoothing) {
    return smoothstep(radius + smoothing, radius, distance(st, pos));
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    //vec3 color = vec3(1., 0.2, 0.65);
	vec3 color = vec3(abs(atan(u_time) + 0.2), abs(cos(u_time)), abs(sin(u_time)));
    
    //float c1 = circle(st, vec2(0.5, 0.5), 0.2, 0.1);
	//float c2 = circle(st, vec2(0.5, 0.5), 0.2, 0.1);
 	
    float prevC = 0.;
    for(float i=0.; i<10.; i++) {
        float c = circle(st, vec2((i/10. * cos(u_time * 3.) * rand(st)) + 0.45, (i/10. * sin(u_time * 2.)) * rand(st) + 0.45), exponentialInOut(abs(sin(u_time))) / 4., 0.266);
        color = mix(color, vec3(rand(st), cos(u_time) * rand(st), i/10. * abs(sin(u_time))), c);
	}

	gl_FragColor = vec4( color, 1.0 );
}
