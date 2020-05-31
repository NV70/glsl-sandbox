#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle (vec2 st, vec2 cent, float rad) {
    
    
    
    return smoothstep(0.1, rad, distance(st, cent));
    
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    
    
float pct = -0.228;    
pct = pow(smoothstep(0.268, 0.660, distance(st,vec2(0.1,0.1)+abs(sin(u_time)*0.332))), smoothstep(0.1, 0.756, distance(st,vec2(-0.080,0.300))));
    
    vec3 color = mix(
        vec3(1.000,0.092,0.006),
        vec3(0.530,0.383,0.332),
        pct 
    );
    
    color = mix(
        vec3(0.135,0.080,0.570),
        vec3(pct,0.,pct),
        circle(
            st,
            vec2(1.040,pct),
            0.908 + (abs(sin(u_time*55.))/6.000)
        )
    );

    
    

	gl_FragColor = vec4( color, 1.0 );
}