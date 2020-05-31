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
    
    
    
    
    vec3 color = mix(
        vec3(0.1,0.0,0.0),
        vec3(1.000,0.057,0.009),
        circle(
            st,
            vec2(0.500,0.500),
            0.284 + (abs(sin(u_time*2.))/5.)
        ) 
    );
    
    color = mix(
        vec3(1.000,0.956,0.906), color,
        circle(
            st,
            vec2(0.500,0.50),
            0.236 + (abs(sin(u_time*3.))/5.)
        ) 
    );
    
        color = mix(
        vec3(1.000,0.219,0.017), color,
        circle(
            st,
            vec2(0.5,0.500),
            -0.012 + (abs(sin(u_time*5.))/5.)
        ) 
    );
    
    
    

	gl_FragColor = vec4( color, 1.0 );
}