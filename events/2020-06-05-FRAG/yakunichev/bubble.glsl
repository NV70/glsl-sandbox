const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0001;
const float MAX_DIST = 128.0;
const float EPSILON = 0.0001;

float sphereSDF(vec3 samplePoint) {
  return length(samplePoint) - 1.0;
}

vec3 opCheapBend(in vec3 p )
{
  const float k = -0.50;
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

float opSmoothUnion( float d1, float d2, float k ) {
  float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
  return mix( d2, d1, h ) - k*h*(1.0-h); }



vec3 opRepLim( in vec3 p, in float c, in vec3 l )
{
  vec3 q = p-c*clamp(vec3(c),-l,l);
  return q;
}

mat4 rotateX( in float angle ) {
  return mat4(	1.0,		0,			0,			0,
		0, 	cos(angle),	-sin(angle),		0,
		0, 	sin(angle),	 cos(angle),		0,
		0, 			0,			  0, 		1);
}

mat4 rotateY( in float angle ) {
  return mat4(	cos(angle),		0,		sin(angle),	0,
		0,		1.0,			 0,	0,
		-sin(angle),	0,		cos(angle),	0,
		0, 		0,				0,	1);
}

mat4 rotateZ( in float angle ) {
  return mat4(	cos(angle),		-sin(angle),	0,	0,
		sin(angle),		cos(angle),		0,	0,
		0,				0,		1,	0,
		0,				0,		0,	1);
}

vec3 opRep( in vec3 p, in vec3 c) {
  vec3 q = mod(p+0.5*c,c)-0.5*c;
  return q;
}

vec3 translate(vec3 p, vec3 d) {
  return p - d;
}

float sceneSDF(vec3 samplePoint) {
  samplePoint = (rotateY(sin(iTime / 3. + 0.6745)) * vec4(samplePoint, 1.)).xyz;
  samplePoint = (rotateX(sin(iTime / 2.)) * vec4(samplePoint, 1.)).xyz;
  samplePoint = (rotateZ(cos(iTime / 4.)) * vec4(samplePoint, 1.)).xyz;
    
  vec3 spherePoint = samplePoint;
  spherePoint /= 4.;
  spherePoint = translate(
			  spherePoint,
			  vec3(
			       sin(iTime) * 4.,
			       sin(iTime) * 4.,
			       sin(iTime))
			  );
  spherePoint = opRep(spherePoint, vec3(4., 8., 0.));
    
  spherePoint = (rotateZ(cos(iTime + 0.125)) * vec4(spherePoint, 1.)).xyz;
    
  samplePoint = opRep(samplePoint, vec3(2.5, 3.9, 0.));
    
  return opSmoothUnion(
		       sphereSDF(spherePoint),
		       sdLink(samplePoint, 0.75, 1., 0.1),
		       5.
		       );
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
			4.0 * cos(iTime));
  vec3 light1Intensity = vec3(0.4, 0.4, 0.4);
    
  color += phongContribForLight(k_d, k_s, alpha, p, eye,
				light1Pos,
				light1Intensity);
    
  vec3 light2Pos = vec3(2.0 * sin(0.37 * iTime),
			2.0 * cos(0.37 * iTime),
			2.0);
  vec3 light2Intensity = vec3(0.4, 0.4, 0.4);
    
  color += phongContribForLight(k_d, k_s, alpha, p, eye,
				light2Pos,
				light2Intensity);    
  return color;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec3 dir = rayDirection(45., iResolution.xy, fragCoord);
  vec3 eye = vec3(cos(iTime) * 8., sin(iTime) * 4., 40.);
  float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);
    
  if (dist > MAX_DIST - EPSILON) {
    // Didn't hit anything
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }
    
  // The closest point on the surface to the eyepoint along the view ray
  vec3 p = eye + dist * dir;
    
  vec3 K_a = vec3(0.101,0.064,cos(iTime + 0.8565 + p.z) / 2. + 0.5);
  vec3 K_d = vec3(0.485,cos(iTime + 0.1254 + p.x) / 2. + 0.5,cos(iTime + 0.21312 + p.x) / 2. + 0.5);
  vec3 K_s = vec3(sin(iTime + 0.1254 + p.x) / 2. + 0.5, 1.0, sin(iTime + 0.1254 + p.x) / 2. + 0.5);
  float shininess = 1000.;
    
  vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, eye);
    
  fragColor = vec4(color, 1.);
}
