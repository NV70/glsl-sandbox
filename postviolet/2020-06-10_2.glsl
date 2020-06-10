//fuck in hyperspace
const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.0001;

vec3 opRep( in vec3 p, in vec3 c)
{
    vec3 q = mod(p+0.5*c,c)-0.5*c;
    return q;
}

mat4 rotateX( in float angle ) {
  return mat4(1.0,0,0,0,0,cos(angle),-sin(angle),0,0,sin(angle),cos(angle),0,0,0,0,1);
}

mat4 rotateY( in float angle ) {
  return mat4(cos(angle),0,sin(angle),0,0,1.0,0,0,-sin(angle),0,cos(angle),0,0,0,0,1);
}

mat4 rotateZ( in float angle ) {
  return mat4(cos(angle),-sin(angle),0,0,sin(angle),cos(angle),0,0,0,0,1,0,0,0,0,1);
}

float Capsule( vec3 p, float h, float r ) {
  p.y -= clamp( p.y, 0.0, h );
  return length( p ) - r;
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float Fuck (vec3 p) {
    
    float f1 = Capsule(vec3(p.x,p.y+0.25,p.z),0.5, 0.29);
    float f2 = Capsule(vec3(p.x+0.5,p.y,p.z),0.5,0.29);
    
    float f3 = Capsule(vec3(p.x+1.0,p.y,p.z),0.7,0.29);
    
    float t3 = sin(iTime*5.)/5.8+0.5;
    vec3 pf3a = (vec4(vec3(p.x+1.0,p.y-0.75,p.z),1.) * rotateX(5.01+t3)).xyz;
    float f3a = Capsule(pf3a,0.65,0.29);
    
    float f3combo = opSmoothUnion(f3,f3a,0.1);
    
    float f4 = Capsule(vec3(p.x+1.5,p.y,p.z),0.55,0.29);
    
    vec3 p5 = (vec4(p,1.) * rotateZ(-0.6)).xyz;
    float f5 = Capsule(vec3(p5.x+1.6,p5.y-0.65,p5.z-0.2),0.5,0.28);
    
    float fngrs = opSmoothUnion(
        opSmoothUnion(
            opSmoothUnion(
                opSmoothUnion(f1, f2, 0.1)
                ,f3combo, 0.1),
            f4,0.1),
        f5,0.1);
    
    vec3 pk1 = (vec4(p,1.) * rotateZ(-1.6)).xyz;
    float k1 = Capsule(vec3(pk1.x+0.35,pk1.y-0.04,pk1.z),1.5, 0.34);
    
    return opSmoothUnion(fngrs,k1,0.1);
}

float sceneSDF(vec3 samplePoint) {
    
  samplePoint = (rotateY(sin(iTime/2.)) * vec4(samplePoint, 1.)).xyz;
  samplePoint = opRep(samplePoint, vec3(10., 10., 14.));
    
    return Fuck(samplePoint+0.2);
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
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;
    
    vec3 light1Pos = vec3(4.0 * sin(iTime),
                          2.0,
                          2.0 * cos(iTime));
    vec3 light1Intensity = vec3(0.8,0.1,0.1);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light1Pos,
                                  light1Intensity);
    
    vec3 light2Pos = vec3(1.5,5.0,2.0);
    vec3 light2Intensity = vec3(1.0,0.5,0.5);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light2Pos,
                                  light2Intensity);    
    return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec3 dir = rayDirection(45., iResolution.xy, fragCoord.xy);
    
    vec3 eye = vec3(0., 0., 10);
    
    float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);
    
    if (dist > MAX_DIST - EPSILON) {
        fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
    }
    
    vec3 p = eye + dist * dir;
    
    vec3 K_a = vec3(0.5,0.0,0.4);
    vec3 K_d = vec3(0.7,1.0,2.0+sin(iTime));
    vec3 K_s = vec3(1.0,1.0,1.0);
    float shininess = 20.;
    
    vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, eye);
    
    fragColor = vec4(color, 1.0);
}
