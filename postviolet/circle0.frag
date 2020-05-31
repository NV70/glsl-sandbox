

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle (vec2 st, vec2 cent, float rad) {
    return step(rad, distance(st, cent));
    
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec3 color = vec3(circle(st, vec2(0.500,0.500), 0.316));

	gl_FragColor = vec4( color, 1.0 );
}