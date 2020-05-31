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

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(1., 1., 1.);
    
	float c1 = circle(st, vec2(0.480,0.760) * vec2(abs(cos(u_time) + 0.33), .5), 0.2, 0.2);
	float c2 = circle(st, vec2(0.780,1.000) * vec2(abs(sin(u_time + 0.4)), abs(cos(u_time) - 0.1)), 0.1, exponentialInOut(abs(sin(u_time))) / 3.);

    color = mix(color, vec3(1.0, 0.2, 0.1), mod(c1, c2));


	gl_FragColor = vec4( color, 1.0 );
}
