// Author @patriciogv - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 _st, in float _radius, vec2 _pos){
    vec2 l = _st-_pos;
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);
    
    vec2 pos = vec2(0.500,1.04)-st;
    
    float r = length(pos)*0.392;
    float a = atan(pos.y,pos.x*0.696);
    
    float f1 = abs(cos(a*1.644))*0.812+0.044;
        
    float c = circle(st, 0.556, vec2(0.5,0.5))*circle(st, 1.164,vec2(0.290,0.660))*circle(st, 1.164,vec2(0.660,0.670));
    float c1 = circle(st, 0.676,vec2(0.060,0.940))*circle(st, 0.516,vec2(0.430,0.440))*circle(st, 1.452,vec2(0.480,0.170));
    float c2 = circle(st, 0.476,vec2(0.130,0.720))*circle(st, 1.036,vec2(0.160,0.680))*circle(st, 1.444,vec2(0.480,-0.020));
    float c3 = circle(st, 0.628,vec2(0.140,0.160))*circle(st, 0.356,vec2(0.130,0.350))*circle(st, 1.452,vec2(0.780,-0.190));
    float c4 = circle(st, 0.548,vec2(0.160,0.640))*circle(st, 0.156,vec2(0.250,0.490))*circle(st, 2.436,vec2(0.750,-0.260));
    float c5 = circle(st, 0.972,vec2(0.960,1.010))*circle(st, 0.964,vec2(0.480,0.290))*circle(st, 0.884,vec2(0.940,0.720));
    float c6 = circle(st, 0.924,vec2(0.880,0.730))*circle(st, 1.108,vec2(0.350,0.110))*circle(st, 0.788,vec2(0.970,0.730));
    float c7 = circle(st, 0.084,vec2(0.500,0.310))*circle(st, 0.068,vec2(0.670,0.430))*circle(st, 0.660,vec2(0.260,0.150));
    

    
    color = mix(color, vec3(0.006,0.620,0.160),c);
    color = mix(color, vec3(0.000,0.00,0.00), c1);
    color = mix(color, vec3(0.000,0.00,0.00), c2);
    color = mix(color, vec3(0.000,0.00,0.00), c3);
    color = mix(color, vec3(0.000,0.00,0.00), c4);
    color = mix(color, vec3(0.000,0.00,0.00), c5);
    color = mix(color, vec3(0.000,0.00,0.00), c6);
    color = mix(color, vec3(0.000,0.00,0.00), c7) * (cos(a*10.160)* 0.504+1.196);
    

	gl_FragColor = vec4(color,1.0);
}