import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_colorDeep;
uniform vec3 u_colorMid;
uniform vec3 u_colorHighlight;
uniform float u_speed;
uniform float u_flowStrength;
uniform float u_grain;
uniform float u_contrast;
uniform float u_opacity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.86, 0.51, -0.51, 0.86);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

vec3 applyContrast(vec3 c, float contrast) {
  return clamp((c - 0.5) * contrast + 0.5, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time * (0.10 * u_speed);
  vec2 aspect = vec2(u_res.x / max(u_res.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;

  vec2 flowP = vec2(p.x * 1.1, p.y - t * 0.2);
  float n1 = fbm(flowP * 2.2 + vec2(0.0, t * 0.1));
  float n2 = fbm((flowP + n1 * 0.4) * 3.2 - vec2(0.0, t * 0.2));
  float n3 = fbm((flowP + n2 * 0.35) * 4.5 + vec2(t * 0.08, 0.0));

  float structure = n3 * 1.1 + (n2 - 0.5) * 0.45;
  structure += (n1 - 0.5) * 0.25 * u_flowStrength;

  float lowBand = smoothstep(0.1, 0.55, structure);
  float highBand = smoothstep(0.55, 1.05, structure);
  vec3 col = mix(u_colorDeep, u_colorMid, lowBand);
  col = mix(col, u_colorHighlight, highBand);

  float glow = smoothstep(0.45, 0.9, structure) * (0.15 + 0.3 * u_flowStrength);
  col += glow * u_colorHighlight * 0.2;

  float vignette = smoothstep(1.4, 0.3, length(uv - 0.5));
  col *= mix(0.75, 1.0, vignette);

  col = applyContrast(col, u_contrast);

  float dither = (hash(gl_FragCoord.xy + t * 10.0) - 0.5) * u_grain;
  col += dither;

  // Dark slate 950 base
  vec3 bg = vec3(0.01, 0.015, 0.035);
  float mask = smoothstep(0.05, 0.85, structure) * u_opacity;
  vec3 finalColor = mix(bg, col, clamp(mask, 0.0, 1.0));

  gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`;

const HEX_COLOR_REGEX = /^#?[0-9a-fA-F]{6}$/;
const FALLBACK_DEEP = '#02040a';

function sanitizeHexColor(value: string, fallback: string) {
  const trimmed = value.trim();
  if (!HEX_COLOR_REGEX.test(trimmed)) {
    return fallback;
  }
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

function hexToRgb01(hex: string): [number, number, number] {
  const normalized = sanitizeHexColor(hex, FALLBACK_DEEP).replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export interface WebGLLiquidProps {
  colorDeep?: string;
  colorMid?: string;
  colorHighlight?: string;
  speed?: number;
  flowStrength?: number;
  grain?: number;
  contrast?: number;
  opacity?: number;
  className?: string;
}

export const WebGLLiquid: React.FC<WebGLLiquidProps> = ({
  colorDeep = '#02040a',
  colorMid = '#0f172a',
  colorHighlight = '#1e3a8a',
  speed = 0.5,
  flowStrength = 0.7,
  grain = 0.02,
  contrast = 1.05,
  opacity = 0.65,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uColorDeep = gl.getUniformLocation(program, 'u_colorDeep');
    const uColorMid = gl.getUniformLocation(program, 'u_colorMid');
    const uColorHighlight = gl.getUniformLocation(program, 'u_colorHighlight');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uFlowStrength = gl.getUniformLocation(program, 'u_flowStrength');
    const uGrain = gl.getUniformLocation(program, 'u_grain');
    const uContrast = gl.getUniformLocation(program, 'u_contrast');
    const uOpacity = gl.getUniformLocation(program, 'u_opacity');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    let rafId = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const start = performance.now();

    const render = (now: number) => {
      const elapsedSec = (now - start) / 1000;

      const deep = hexToRgb01(colorDeep);
      const mid = hexToRgb01(colorMid);
      const highlight = hexToRgb01(colorHighlight);

      gl.clearColor(0.01, 0.015, 0.035, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (uTime) gl.uniform1f(uTime, elapsedSec);
      if (uColorDeep) gl.uniform3f(uColorDeep, deep[0], deep[1], deep[2]);
      if (uColorMid) gl.uniform3f(uColorMid, mid[0], mid[1], mid[2]);
      if (uColorHighlight) gl.uniform3f(uColorHighlight, highlight[0], highlight[1], highlight[2]);
      if (uSpeed) gl.uniform1f(uSpeed, speed);
      if (uFlowStrength) gl.uniform1f(uFlowStrength, flowStrength);
      if (uGrain) gl.uniform1f(uGrain, grain);
      if (uContrast) gl.uniform1f(uContrast, contrast);
      if (uOpacity) gl.uniform1f(uOpacity, opacity);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (isVisible && isPageVisible) {
        rafId = requestAnimationFrame(render);
      }
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && rafId === 0) {
        rafId = requestAnimationFrame(render);
      }
    };

    const tryStop = () => {
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 }
    );
    io.observe(host);

    tryStart();

    return () => {
      tryStop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      io.disconnect();
      resizeObserver.disconnect();
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    colorDeep,
    colorMid,
    colorHighlight,
    speed,
    flowStrength,
    grain,
    contrast,
    opacity,
  ]);

  return (
    <div
      ref={hostRef}
      className={`relative h-full w-full overflow-hidden ${className}`.trim()}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full block"
      />
    </div>
  );
};

export default WebGLLiquid;
