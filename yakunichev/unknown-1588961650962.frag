#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(vec2 st, vec2 pos, float radius, float smoothing) {
    return smoothstep(radius + smoothing, radius, distance(st, pos + (radius / 4.)));
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(1., 1., 1.);

    color = mix(color, vec3(1.0, 0.2, 0.1), circle(st, vec2(0.570,0.650)+sin(u_time), 0.408, 0.028));

	gl_FragColor = vec4( color, 1.0 );
}
