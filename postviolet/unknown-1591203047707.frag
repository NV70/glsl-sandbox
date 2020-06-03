// raymarching2 море

#ifdef GL_ES
  precision highp float;
#endif

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float random(in float x) {
    return fract(sin(x) * 2132131.213213124);
}

float noise(in float x) {
    return mix(random(floor(x)), random(floor(x) + 1.), smoothstep(0., 1., fract(x)));
}




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
    
    vec3 st = position;
    pMod3 (st, vec3 (0.364, 4.2, 0.));
    
    float ground = st.y + sin(position.x*2. * sin(u_time/5.)) / 5. 
                              + cos(position.z*10. * fract (u_time/5.)) / 12. + 2.0 ;
    
    float shar = sdSphere (vec3(position.x+0.588, position.y, position.z+1.428), 0.652 );
    float shar1 = sdSphere (vec3(position.x-0.844, position.y-1.036, position.z+1.788), -0.800 );


    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return opSmoothUnion(shar1, ground*ground, 3.);
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
    
    return vec4(0.890+sin(u_time),0.583+sin(u_time),0.540,1.000);// Background color.
}
 
void main() {
    
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv += -0.5;
    uv *= 2.;

  vec3 camOrigin = vec3(0., 0., -1.)*random(u_time/4.);
  vec3 rayOrigin = vec3(uv + camOrigin.xy, camOrigin.z + 1.);
  vec3 dir = camOrigin + rayOrigin;

    vec4 color = vec4(
        trace(rayOrigin,dir)
    );
    
    gl_FragColor = color;
    
    
}