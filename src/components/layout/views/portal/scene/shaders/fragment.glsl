varying vec2 vUv;
uniform vec2 scale;
uniform vec2 imageBounds;
uniform vec3 color;
uniform float opacity;

uniform sampler2D map;
uniform sampler2D depthMap;
uniform sampler2D maskMap;

uniform bool faux3D;
uniform float zoom;
uniform vec2 zoomOrigin;
uniform float maskMaxScale;
uniform vec2 faux3dThreshold;

uniform vec2 mousePosition;
uniform float time;
uniform float progress;

vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.);
    return mix(m, 2.0 - m, step(1.0, m));
}

vec2 aspect(vec2 size) {
    return size / min(size.x, size.y);
}

float mapLinear(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float segment2Start = 0.3333;
float segment3Start = 0.6666;

void main() {
    vec2 s = aspect(scale);
    vec2 i = aspect(imageBounds);
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
    vec2 uv = vUv * s / new + offset;

    float localZoom = clamp(mapLinear(progress, segment2Start, segment3Start, zoom, 1.), 1., zoom);
    vec2 uvWithZoom = (uv - zoomOrigin) / localZoom + zoomOrigin;
    vec2 uvParallax = uvWithZoom;

    if (progress < segment2Start) {
        uvParallax.y += 1. - clamp(mapLinear(progress, 0., segment2Start, 0.5, 1.), 0.5, 1.);

        float yOffset = clamp(mapLinear(progress, 0., segment2Start, 0., 1.), 0., 1.);

        if (vUv.y > yOffset) {
            discard;
        }
    }

    if (progress > segment3Start) {
        uvParallax.y -= clamp(mapLinear(progress, segment3Start, 1., 0., 0.5), 0., 0.5);

        float yOffset = clamp(mapLinear(progress, segment3Start, 1., 0., 1.), 0., 1.);

        if (vUv.y < yOffset) {
            discard;
        }
    }

    vec4 comp;
    if (faux3D) {
        vec4 texDepth = texture2D(depthMap, uvParallax);
        vec2 fake3d = vec2(uvParallax.x + (texDepth.r - 0.5) * (mousePosition.x + cos(time * 0.5) * 0.66) / faux3dThreshold.x, uvParallax.y + (texDepth.r - 0.5) * (mousePosition.y + sin(time * 0.5) * 0.66) / faux3dThreshold.y);
        comp = texture2D(map, mirrored(fake3d));
    } else {
        comp = texture2D(map, uvParallax);
    }
    comp *= vec4(color, opacity);
    vec4 sRGBComp = linearToOutputTexel(comp);
    float sRGBEncodingProgress = clamp(mapLinear(progress, 0.45, segment3Start, 0., 1.), 0., 1.);
    comp = vec4(mix(comp.r, sRGBComp.r, sRGBEncodingProgress), mix(comp.g, sRGBComp.g, sRGBEncodingProgress), mix(comp.b, sRGBComp.b, sRGBEncodingProgress), comp.a);

    vec2 maskCoords = uv;
    maskCoords.y = maskCoords.y + 1. - (clamp(progress, 0., segment2Start) * 3.);

    float maskScale = clamp(mapLinear(progress, segment2Start, segment3Start, 1., maskMaxScale), 1., maskMaxScale);

    maskCoords *= 1. / maskScale;

    float maskOffsetX = 1. / maskScale * .5 - 0.5;
    float maskOffsetY = 1. / maskScale * .5 - 0.5;
    maskCoords.x -= maskOffsetX;
    maskCoords.y -= maskOffsetY;

    vec4 maskTexture = texture2D(maskMap, maskCoords);

    gl_FragColor = mix(vec4(0, 0, 0, 0), comp, smoothstep(0.4, 0.6, maskTexture.r));
}
