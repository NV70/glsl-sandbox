#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Define some constants
const int steps = 128; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = 32.; // This is the maximum distance a ray can travel.
 
float scene(vec3 position){
    // So this is different from the prev sphere equation in that I am
    // splitting the position into it's three different parts
    // and adding a 10th of a cos wave to the x position so it oscillates left 
    // to right and a (positive) sin wave to the z position
    // so it will go back and forth.
    float sphere = length(
        vec3(
            position.x + cos(u_time)/2., 
            position.y, 
            position.z+ sin(u_time * 2.) /2. + 0.5)
        )-0.5;
    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    float ground = position.y + sin(position.x * 62.) / 10. 
                              + cos(position.z * 62.) / 10. + 1.;
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return min(sphere,ground);
}
 
void main() {
    
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv += -0.5;
    uv *= 2.;

	vec3 rayOrigin = vec3(uv, 0.0);

    vec4 color = vec4(scene(rayOrigin));
    
    gl_FragColor = color;
    
    
}
