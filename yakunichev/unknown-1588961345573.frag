#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(vec2 st, vec2 pos, float radius, float smoothing) {
    return smoothstep(radius, radius + smoothing, distance(st, pos + (radius / 4.)));
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;

    vec3 color = vec3(circle(st, vec2(0.5), 0.2, 0.132));

	gl_FragColor = vec4( color, 1.0 );
}
