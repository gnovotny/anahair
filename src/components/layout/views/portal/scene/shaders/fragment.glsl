// mostly from https://gist.github.com/statico/df64c5d167362ecf7b34fca0b1459a44
varying vec2 vUv;
uniform vec2 scale;
uniform vec2 imageBounds;
uniform vec3 color;
uniform sampler2D map;
uniform sampler2D depthMap;
uniform bool useDepthMap;
uniform float zoom;
uniform vec2 zoomCenter;
uniform float grayscale;
uniform float opacity;

uniform vec2 mousePosition;
uniform vec2 fake3dThreshold;
uniform float uTime;

uniform float maskProgress;
uniform float maskIdle;
uniform float maskMaxScale;

uniform sampler2D maskMap;
uniform sampler2D portalMap;

uniform float scrollProgress;

const vec3 luma = vec3(.299, 0.587, 0.114);

vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.);
    return mix(m, 2.0 - m, step(1.0, m));
}

vec4 toGrayscale(vec4 color, float intensity) {
    return vec4(mix(color.rgb, vec3(dot(color.rgb, luma)), intensity), color.a);
}

vec2 aspect(vec2 size) {
    return size / min(size.x, size.y);
}

float map2(float value, float min1, float max1, float min2, float max2)
{
    return min2+(value-min1)*(max2-min2)/(max1-min1);
}

//vec4 LinearTosRGB( in vec4 value ) {
//    return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
//}

void main() {
    vec2 s = aspect(scale);
    vec2 i = aspect(imageBounds);
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
    vec2 uv = vUv * s / new + offset;
//    vec2 zUv = (uv - vec2(0.5, 0.5)) + vec2(0.5, 0.5);
    vec2 zUv = uv;

//    if (scrollProgress > 0.3333) {
//        zUvParallax.y += 1.-clamp(map2(scrollProgress, 0., 0.3333, 0.5, 1.), 0.5, 1.);
//    }

    float localZoom=clamp(map2(scrollProgress, 0.3333, 0.6666, zoom, 1.), 1., zoom);
    float localGrayscale=clamp(map2(scrollProgress, 0.3333, 0.6666, 1., 0.), 0., 1.);
    float sRGBEncodingProgress=clamp(map2(scrollProgress, 0.45, 0.6666, 0., 1.), 0., 1.);


    vec2 zUvWithZoom = (uv - zoomCenter) / localZoom + zoomCenter;

    vec2 zUvParallax = zUvWithZoom;

    if (scrollProgress < 0.3333) {
        zUvParallax.y += 1.-clamp(map2(scrollProgress, 0., 0.3333, 0.5, 1.), 0.5, 1.);

        float yOffset = clamp(map2(scrollProgress, 0., 0.3333, 0., 1.), 0., 1.);

        if (vUv.y>yOffset) {
            discard;
        }
    }

    if (scrollProgress > 0.6666) {
        zUvParallax.y -= clamp(map2(scrollProgress, 0.6666, 1., 0., 0.5), 0., 0.5);

        float yOffset = clamp(map2(scrollProgress, 0.6666, 1., 0., 1.), 0., 1.);

        if (vUv.y<yOffset) {
            discard;
        }
    }

//    if (scrollProgress > 0.6666) {
//        zUvParallax = vec2(zUv.x, zUv.y-clamp(map2(scrollProgress, 0.6666, 1., 0., 0.5), 0., 0.5));
//    }

    vec4 comp;

    if (useDepthMap) {
        vec4 texDepth = texture2D(depthMap, zUvParallax);
        vec2 fake3d = vec2(zUvParallax.x + (texDepth.r - 0.5) * (mousePosition.x + cos(uTime * 0.5) * 0.66) / fake3dThreshold.x, zUvParallax.y + (texDepth.r - 0.5) * (mousePosition.y + sin(uTime * 0.5) * 0.66) / fake3dThreshold.y);
        comp = texture2D(map, mirrored(fake3d)) * vec4(color, opacity);
    } else {
        comp = texture2D(map, zUvParallax) * vec4(color, opacity);
    }



//    vec4 comp = toGrayscale(texture2D(map, mirrored(fake3d)) * vec4(color, opacity), localGrayscale);
//    vec4 comp = texture2D(map, mirrored(fake3d)) * vec4(color, opacity);
//    vec4 comp = texture2D(map, zUvParallax);

    vec4 sRGBComp = linearToOutputTexel(comp);
    comp = vec4(mix(comp.r, sRGBComp.r, sRGBEncodingProgress), mix(comp.g, sRGBComp.g, sRGBEncodingProgress), mix(comp.b, sRGBComp.b, sRGBEncodingProgress), comp.a);

    vec2 maskCoords=zUv;
    maskCoords.y= maskCoords.y+1.-(clamp(scrollProgress,0.,0.3333)*3.);

    float maskScale=clamp(map2(scrollProgress, 0.3333, 0.6666, 1., maskMaxScale), 1., maskMaxScale);

    maskCoords*=1./maskScale;

    float maskOffsetX = 1./maskScale*.5-0.5;
    float maskOffsetY = 1./maskScale*.5-0.5;
    maskCoords.x-=maskOffsetX;
    maskCoords.y-=maskOffsetY;

    vec4 maskTexture=texture2D(maskMap, maskCoords);

    gl_FragColor = mix(vec4(0,0,0,0), comp, smoothstep(0.4,0.6,maskTexture.r));
//    gl_FragColor = comp;

//    gl_FragColor = linearToOutputTexel( gl_FragColor );

//    #include <tonemapping_fragment>
//    #include <encodings_fragment>
}
