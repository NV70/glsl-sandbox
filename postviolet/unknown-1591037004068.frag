// raymarching1 две сферы луна

#ifdef GL_ES
  precision highp float;
#endif

vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size * 0.5)/size);
	p = mod (p + size * 0.5, size) - size * 0.5;
	return c;
}

uniform vec2 u_resolution;
uniform float u_time;


float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }


float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

// Define some constants
const int steps = 565; // This is the maximum amount a ray can march.
const float smallNumber = 0.00001;
const float maxDist = 20.; // This is the maximum distance a ray can travel.
//---------------------------------------------------------------------------------

float scene(vec3 position){    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    
    vec3 st = position;
    pMod3 (st, vec3 (0.364, 4.2, 0.));
    
    float ground = st.y + sin(position.x*2. * sin(u_time/5.)) / 5. 
                              + cos(position.z*10. * fract (u_time/5.)) / 12. + 2.0;
    
    float shar = sdSphere (vec3(position.x+0.588, position.y, position.z+1.428), 0.652 );
    float shar1 = sdSphere (vec3(position.x-0.844, position.y-1.036, position.z+0.908), 0.196 );


    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return opSmoothUnion(opSmoothUnion(shar, ground*ground, 3.),shar1, 0.9);
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
            return 1.000 - (vec4(totalDistance) / maxDist);
 
        }
        
        if (totalDistance > maxDist){
 
            return vec4(0.); // Background color.
        }
    }
    
    return vec4(0.890,0.118,0.452,1.000);// Background color.
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