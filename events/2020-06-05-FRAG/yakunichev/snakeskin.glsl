Hi! I've visited Char Stiles' workshop and learnt about FRAG shader show. I would really love to participate in it if it's not too late. Here are some shaders, published on Shadertoy I'd love to share with you:
  - https://www.shadertoy.com/view/ttsyRn
  - https://www.shadertoy.com/view/wllyRn
  - https://www.shadertoy.com/view/WlXczn
  - https://www.shadertoy.com/view/wtsyRn
  - https://www.shadertoy.com/view/tlsyRn


#define PI 3.14159265358979323846

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x, 0.0, 0.0, _scale.y);
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

float polygon(in vec2 st, in int edges, in float size) {
    vec2 _st = st * 2. - 1.;
    float a = atan(_st.x,_st.y)+PI;
    float r = (PI*2.)/float(edges);
    float d = cos(floor(0.5+a/r)*r-a)*length(_st);
	return 1.0-smoothstep(size,size+0.01,d);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 st = fragCoord.xy/iResolution.xy;
    st.y *= iResolution.y/iResolution.x;
    vec3 color = vec3(0.);
    vec2 pos = st.xy*vec2(28.,28.);
    float pattern = pos.x;
    pos = rotate2d(noise(pos / 20.) + 5.5 + iTime / 4.) * pos + iTime * 3.;
    pattern = polygon(fract(pos), 3, noise(pos + iTime) + 0.2);
    color = mix(color, vec3(0.316,0.635,0.286), pattern * noise(pos * 72.));
    fragColor = vec4(color, 1.0);
}
