const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.0001;


float sphereSDF(vec3 samplePoint) {
    return length(samplePoint) - 1.0;
}

float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}

vec3 opCheapBend(in vec3 p )
{
    const float k = -0.50; // or some other amount
    float c = cos(k*p.x);
    float s = sin(k*p.x);
    mat2 m = mat2(c,-s,s,c);
    vec3 q = vec3(m*p.xy,p.z);
    return q;
}

float sdLink( vec3 p, float le, float r1, float r2 )
{
  vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
  return length(vec2(length(q.xy)-r1,q.z)) - r2;
}

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

vec3 opRep( in vec3 p, in vec3 c)
{
    vec3 q = mod(p+0.5*c,c)-0.5*c;
    return q;
}

mat4 rotateX( in float angle ) {
  return mat4(  1.0,    0,      0,      0,
           0,   cos(angle),  -sin(angle),    0,
          0,   sin(angle),   cos(angle),    0,
          0,       0,        0,     1);
}

mat4 rotateY( in float angle ) {
  return mat4(  cos(angle),    0,    sin(angle),  0,
               0,    1.0,       0,  0,
          -sin(angle),  0,    cos(angle),  0,
              0,     0,        0,  1);
}

mat4 rotateZ( in float angle ) {
  return mat4(  cos(angle),    -sin(angle),  0,  0,
           sin(angle),    cos(angle),    0,  0,
              0,        0,    1,  0,
              0,        0,    0,  1);
}

float sceneSDF(vec3 samplePoint) {
  samplePoint = (rotateY(sin(iTime/2.)) * vec4(samplePoint, 1.)).xyz;
  samplePoint = (rotateX(sin(iTime/2.)) * vec4(samplePoint, 1.)).xyz;
  samplePoint = (rotateZ(sin(iTime/2.)) * vec4(samplePoint, 1.)).xyz;
  samplePoint = opRep(samplePoint, vec3(3., 4., 14.));
    
    return sdOctahedron(samplePoint, 0.446);
}


float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sceneSDF(eye + depth * marchingDirection);
        if (dist < EPSILON) {
      return depth;
        }
        depth += dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
}


vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}


vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPSILON, p.y, p.z)) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + EPSILON, p.z)) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z  + EPSILON)) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON))
    ));
}


vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                          vec3 lightPos, vec3 lightIntensity) {
    vec3 N = estimateNormal(p);
    vec3 L = normalize(lightPos - p);
    vec3 V = normalize(eye - p);
    vec3 R = normalize(reflect(-L, N));
    
    float dotLN = dot(L, N);
    float dotRV = dot(R, V);
    
    if (dotLN < 0.0) {
        // Light not visible from this point on the surface
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        // Light reflection in opposite direction as viewer, apply only diffuse
        // component
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}


vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;
    
    vec3 light1Pos = vec3(4.0 * sin(iTime),
                          2.0,
                          4.0 * cos(iTime));
    vec3 light1Intensity = vec3(0.800,0.096,0.119);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light1Pos,
                                  light1Intensity);
    
    vec3 light2Pos = vec3(1.736,
                          2.0 ,
                          2.0);
    vec3 light2Intensity = vec3(0.4, 0.4, 0.4);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light2Pos,
                                  light2Intensity);    
    return color;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec3 dir = rayDirection(45., iResolution.xy, fragCoord.xy);
    vec3 eye = vec3(0., 0., 40.)+sin(iTime);
    float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);
    
    if (dist > MAX_DIST - EPSILON) {
        // Didn't hit anything
        fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
    }
    
    // The closest point on the surface to the eyepoint along the view ray
    vec3 p = eye + dist * dir;
    
    vec3 K_a = vec3(0.222,0.141,0.440);
    vec3 K_d = vec3(0.700,0.602,0.194);
    vec3 K_s = vec3(0.179,0.962,1.000);
    float shininess = 20.;
    
    vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, eye);
    
    fragColor = vec4(color, 1.0);
}


