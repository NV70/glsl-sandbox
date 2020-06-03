#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Define some constants
const int steps = 128; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = .1; // This is the maximum distance a ray can travel.
 
float sdLink( vec3 p, float le, float r1, float r2 )
{
  vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
  return length(vec2(length(q.xy)-r1,q.z)) - r2;
}

void pR(inout vec2 p, float a) {
	p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

float scene(vec3 position){
    // So this is different from the prev sphere equation in that I am
    // splitting the position into it's three different parts
    // and adding a 10th of a cos wave to the x position so it oscillates left 
    // to right and a (positive) sin wave to the z position
    // so it will go back and forth.
    float sphere = length(
        vec3(
            position.x + cos(u_time)/ 2., 
            position.y, 
            position.z - .5)
        )-0.5;
    
    float link = sdLink(
        vec3(
            position.x,
            position.y,
            position.z
        ),
        0.436,
        0.164,
        0.01
    );
    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    float ground = position.y + sin(position.x * 10.) / 10. 
                              + cos(position.z * 10.) / 10. + 4.;
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return min(min(sphere, ground), link);
}



vec4 trace (vec3 origin, vec3 direction){
    
    float dist = 0.;
    float totalDistance = 0.;
    vec3 positionOnRay = origin;
    
    for(int i = 0 ; i < steps; i++){
        
        dist = scene(positionOnRay);
        
        // Advance along the ray trajectory the amount that we know the ray
        // can travel without going through an object.
        positionOnRay += dist * direction;
        
        // Total distance is keeping track of how much the ray has traveled
        // thus far.
        totalDistance += dist;
        
        // If we hit an object or are close enough to an object,
        if (dist < smallNumber){
            // return the distance the ray had to travel normalized so be white
            // at the front and black in the back.
            return 1. - (vec4(totalDistance) / maxDist);
 
        }
        
        if (totalDistance > maxDist){
 
            return vec4(0.); // Background color.
        }
    }
    
    return vec4(0.);// Background color.
}
 
void main() {
    
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv += -0.5;
    uv *= 2.;

    vec3 camOrigin = vec3(0., 0., -1.);
	vec3 rayOrigin = vec3(uv + camOrigin.xy, camOrigin.z + 1.);
	vec3 dir = camOrigin + rayOrigin;

    vec4 color = vec4(
        trace(rayOrigin,dir)
    );
    
    gl_FragColor = color;
    
    
}
