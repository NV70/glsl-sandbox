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
    
    
float pct = -0.228;    
pct = mod(distance(st,vec2(-0.490,0.420)+(sin(u_time)*10.)), distance(st,vec2(-0.820,0.410)));
    
    vec3 color = mix(
        vec3(1.000,0.144,0.000),
        vec3(0.071,0.228,0.530),
        pct 
    );
    
    color = mix(
        vec3(0.520,0.025,0.005),
        vec3(pct,0.,pct),
        circle(
            st,
            vec2(0.4,pct),
            0.516 + (abs(sin(u_time*5.))/5.056)
        )
    );

    
    

	gl_FragColor = vec4( color, 1.0 );
}