#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 _st, in vec2 _pos, in float _radius) {
    vec2 dist = _st - _pos;
	return 1. - smoothstep(_radius - (_radius*0.01), _radius + (_radius*0.01), dot(dist, dist) * 4.0);
}

void main(void) {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);
    
    color = color + (vec3(.4, .57, .35) *
                circle(st, vec2(0.5,0.5), 0.2) * circle(st, vec2(0.4,0.7), 0.2))
               ;
    
    color = color + (vec3(.4, .57, .35) *
            circle(st, vec2(0.6, 0.8), 0.2) * circle(st, vec2(0.4,0.7), 0.2))
           ;
    
    color = color - (vec3(.4, .57, .35) *
        circle(st, vec2(0.7,0.5), 0.2) * circle(st, vec2(0.5,0.5), 0.2))
       ;
    
	gl_FragColor = vec4(color, 1.0);
}
