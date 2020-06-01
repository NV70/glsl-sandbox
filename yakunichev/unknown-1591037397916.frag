#ifdef GL_ES
	precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Define some constants
const int steps = 1024; // This is the maximum amount a ray can march.
const float smallNumber = 0.00001;
const float maxDist = 12.; // This is the maximum distance a ray can travel.

float random(in float x) {
    return fract(sin(x) * 2132131.213213124);
}
float noise(in float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(random(i), random(i + 1.), smoothstep(0., 1., f));
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  float m = p.x+p.y+p.z-s;
  vec3 q;
       if( 3.0*p.x < m ) q = p.xyz;
  else if( 3.0*p.y < m ) q = p.yzx;
  else if( 3.0*p.z < m ) q = p.zxy;
  else return m*0.57735027;
    
  float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
  return length(vec3(q.x,q.y-s+k,q.z-k)); 
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}



float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float pMod1(inout float p, float size) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}

float scene(vec3 position) {    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    float ground =
		position.y
        + sin(position.x * 10.) / 10. 
    	+ cos(position.z * 10. - u_time * 20.) / 10. + 1.;
    
    vec3 torusPos = position;
    pMod1(torusPos.x, 2.);
	pMod1(torusPos.z, 5.);
    pMod1(torusPos.y, 2.);
    float torus = sdTorus(
        rotate(torusPos + vec3(0., -0.1, 2.), vec3(1.,0.,0.), u_time * 3.),
        vec2(0.65, 0.2)
    );
    // pMod1(torus, 5.);
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return opSmoothUnion(torus, ground, sin(u_time) / 2. + 0.75);
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
        if (dist < smallNumber) {
            // return the distance the ray had to travel normalized so be white
            // at the front and black in the back.
            return 1.000 - (vec4(totalDistance) / maxDist);
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

    float z = u_time * 4.;
    vec3 camOrigin = vec3(0., 0., z);
	vec3 rayOrigin = vec3(uv + camOrigin.xy, z + (z * -2.) - 1.);
	vec3 dir = camOrigin + rayOrigin;

    vec4 color = vec4(trace(rayOrigin, dir));
    
    gl_FragColor = color;
}
