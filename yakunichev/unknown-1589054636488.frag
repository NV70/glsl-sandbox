#ifdef GL_ES
precision highp float;
#endif

#define HALF_PI 1.57079632679

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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

float circle(vec2 st, vec2 pos, float radius, float smoothing) {
    return smoothstep(radius + smoothing, radius, distance(st, pos));
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(1., 1., 1.);

    color = mix(
        color,
        vec3(1.0, 0.2, 0.1),
        circle(st, vec2(0.5,0.5), bounceOut(abs(sin(u_time * 2.))) / 4. + 0.1, 0.01)
    );
    
	color = mix(
        color,
    	vec3(0.520,0.990,1.000),
        circle(st, vec2(0.250,0.25), bounceOut(abs(cos(u_time * 3.))) / 6. + 0.05, 0.1) / 1.5
    );
    
    color = mix(
        color,
    	vec3(0.178,1.000,0.019),
        circle(st, vec2(0.5, 0.77), abs(sin(u_time) + 0.25) / 3. + 0.2, 0.001) / 2.
    );


	gl_FragColor = vec4( color, 1.0 );
}
