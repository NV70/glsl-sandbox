// Define some constants
const int steps = 128; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = 3.; // This is the maximum distance a ray can travel.

float sdLink( vec3 p, float le, float r1, float r2 )
{
  vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
  return length(vec2(length(q.xy)-r1,q.z)) - r2;
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}


vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

// Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}

float random(in float x) {
    return fract(sin(x) * 2132131.213213124);
}

float noise1(float x) {
    return mix(random(floor(x)), random(floor(x) + 1.), smoothstep(0., 1., fract(x)));
}

void pR(inout vec2 p, float a) {
	p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

float lighting(vec3 origin, vec3 dir, vec3 normal) {

    vec3 lightPos = vec3(cos(time)*20., sin(time), 12.);
    vec3 light = normalize(lightPos - origin);
    float diffuse = max(0., dot(light, normal));
    vec3 reflectedRay = 2. * dot(light, normal) * normal - light;
    float specular = max(0., (pow(dot(reflectedRay, light), 3.)));
    float ambient = 0.05;
    
    return ambient + diffuse + specular;
}
 
float scene(vec3 position){
    // So this is different from the normal sphere equation in that I am
    // splitting the position into it's three different parts
    // and adding a 10th of a cos wave to the x position so it oscillates left 
    // to right and a (positive) sin wave to the z position
    // so it will go back and forth.
    vec3 spherePos = position;
    pR(spherePos.xz, sin(time));
    pMod3(spherePos, vec3(2.,.5,0.));
    float sphere = length(
        vec3(
            spherePos.x + cos(time)/10., 
            spherePos.y + cos(time) / 2. + 0.5, 
            spherePos.z + (sin(time)+2.))
        )-0.5;
        
    vec3 linkPos = position;
    pR(linkPos.zx, cos(time));
    pMod3(linkPos, vec3(1.,0.7,0));
    float l1 = sdLink(
        vec3(
            linkPos.x,// + sin(time),
            linkPos.y,
            linkPos.z + 1.
        ),
        0.3,
        0.125,
        0.05
    );
    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    float ground =
        noise(position.y)
            + noise(sin(position.x * 10. + time * 32.)) / 10.
            + cos(position.z * 10.) / 10. + 1.;
                              
    // ground = noise(ground * 4.);
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return smin(l1, ground,2.2);
    // return smin(l1, smin(l1,ground,1.), 1.);
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
    
    vec2 pos = uv();

    vec3 camOrigin = vec3(0,0,-1);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
	vec3 dir = camOrigin + rayOrigin;

    vec4 color = vec4(trace(rayOrigin,dir));
    
    gl_FragColor = color;
    
    
}
